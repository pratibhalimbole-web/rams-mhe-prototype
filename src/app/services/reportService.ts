import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { localReportCache } from './localReportCache';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-02ca646a`;

export interface Report {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  site: string;
  inspectionDate: string;
  lastActivityAt?: string;
  status: "Draft" | "Final" | "Published";
  content?: any;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  lastEdited: string;
  createdDate?: string;
  createdBy?: string;
  status: "Draft" | "Published";
  version: number; // Changed from optional string to required number
  sections?: any[];
  modules?: any[];
  sectionsCount?: number;
  modulesCount?: number;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Request failed with status ${response.status}`;
      
      // Only log errors for non-404s or if it's not a template request
      // 404s on templates are expected when templates are deleted
      const isTemplateNotFound = url.includes('/templates/') && response.status === 404;
      const isReportNotFound = url.includes('/reports/') && response.status === 404;
      
      if (!isTemplateNotFound && !isReportNotFound) {
        console.error(`API Error [${response.status}]:`, errorMessage);
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error: any) {
    // Only log fetch errors for non-404 template/report requests
    const is404Error = error.message?.includes('404') || error.message?.includes('not found');
    const isTemplateRequest = url.includes('/templates/');
    const isReportRequest = url.includes('/reports/');
    
    if (!(is404Error && (isTemplateRequest || isReportRequest))) {
      // Provide more helpful error messages
      if (error.message === 'Failed to fetch') {
        // Silently handle offline mode
      } else {
        console.error('Fetch Error Details:', {
          url,
          error: error.message,
          name: error.name,
        });
      }
    }
    
    if (error.message === 'Failed to fetch') {
      throw new Error('Network offline');
    }
    
    throw error;
  }
}

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    try {
      const reports = await fetchWithAuth(`${API_URL}/reports`);
      // Update cache
      if (Array.isArray(reports)) {
        reports.forEach((r: Report) => localReportCache.saveReport(r));
      }
      return reports;
    } catch (error) {
      // Return cached reports when offline
      const cachedIds = localReportCache.getCachedReportIds();
      const cachedReports = cachedIds.map(id => localReportCache.getReport(id)).filter(Boolean) as Report[];
      return cachedReports;
    }
  },

  saveReport: async (report: Report): Promise<void> => {
    // Cache to localStorage before saving to server
    localReportCache.saveReport(report);
    
    return fetchWithAuth(`${API_URL}/reports`, {
      method: "POST",
      body: JSON.stringify(report),
    });
  },

  deleteReport: async (id: string): Promise<void> => {
    // Remove from localStorage cache
    localReportCache.removeReport(id);
    
    return fetchWithAuth(`${API_URL}/reports?id=${id}`, {
      method: "DELETE",
    });
  },

  getTemplates: async (): Promise<ReportTemplate[]> => {
    try {
      return await fetchWithAuth(`${API_URL}/templates`);
    } catch (error) {
      // Fallback to default templates when offline to allow UI to render
      return [
        {
          id: "template-default-rams",
          name: "Default RAMS IRDS Template",
          description: "Standard template for RAMS Inspection and Risk Data System reports",
          lastEdited: new Date().toISOString(),
          createdDate: new Date().toISOString(),
          createdBy: "System",
          status: "Published",
          version: 1,
          sections: [
            {
              id: "section-1",
              name: "Executive Summary",
              modules: []
            },
            {
              id: "section-2",
              name: "Visual Inspection Results",
              modules: []
            }
          ],
          sectionsCount: 2,
          modulesCount: 0,
        }
      ];
    }
  },

  getTemplateById: async (id: string): Promise<ReportTemplate> => {
    try {
      return await fetchWithAuth(`${API_URL}/templates/${id}`);
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        console.log(`ℹ️ Template ${id} not found`);
      }
      
      // Offline fallback
      if (id === "template-default-rams") {
        return {
          id: "template-default-rams",
          name: "Default RAMS IRDS Template",
          description: "Standard template for RAMS Inspection and Risk Data System reports",
          lastEdited: new Date().toISOString(),
          createdDate: new Date().toISOString(),
          createdBy: "System",
          status: "Published",
          version: 1,
          sections: [
            { id: "section-1", name: "Executive Summary", modules: [] },
            { id: "section-2", name: "Visual Inspection Results", modules: [] }
          ],
          sectionsCount: 2,
          modulesCount: 0,
        };
      }
      
      throw error;
    }
  },

  saveTemplate: async (template: ReportTemplate): Promise<ReportTemplate> => {
    return fetchWithAuth(`${API_URL}/templates`, {
      method: "POST",
      body: JSON.stringify(template),
    });
  },

  deleteTemplate: async (id: string): Promise<void> => {
    return fetchWithAuth(`${API_URL}/templates?id=${id}`, {
      method: "DELETE",
    });
  },

  createReport: async (payload: any): Promise<{ id: string }> => {
    const result = await fetchWithAuth(`${API_URL}/reports/create`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    console.log('📝 Report creation response:', result);
    
    // Cache the newly created report to localStorage
    if (result.report) {
      console.log('💾 Caching newly created report to localStorage:', result.report.id);
      localReportCache.saveReport(result.report);
      
      // Verify cache was set
      const cached = localReportCache.getReport(result.report.id);
      if (cached) {
        console.log('✅ Verified report cached successfully');
      } else {
        console.error('❌ Failed to cache report to localStorage');
      }
    } else {
      console.warn('⚠️ No report object in response, cannot cache');
    }
    
    return result;
  },

  getReportById: async (id: string): Promise<Report> => {
    console.log(`🔍 ========== FETCHING REPORT: ${id} ==========`);
    
    // FIRST: Check localStorage before even trying the server
    // This handles the case where the Edge Function restarted
    console.log(`📦 Step 1: Checking localStorage...`);
    
    // Debug: Log ALL localStorage keys
    console.log(`🔍 All localStorage keys:`, Object.keys(localStorage));
    
    const cachedIds = localReportCache.getCachedReportIds();
    console.log(`📦 Cached report IDs from index:`, cachedIds);
    
    const cachedReport = localReportCache.getReport(id);
    if (cachedReport) {
      console.log(`✅ SUCCESS: Found report in localStorage cache!`);
      console.log(`📋 Report details:`, {
        id: cachedReport.id,
        name: cachedReport.name,
        status: cachedReport.status,
      });
      console.log(`🔄 Will attempt to restore to server in background...`);
      
      // Restore to server in the background (non-blocking)
      fetchWithAuth(`${API_URL}/reports`, {
        method: "POST",
        body: JSON.stringify(cachedReport),
      }).then(() => {
        console.log(`✅ Successfully restored report to server in background`);
      }).catch(error => {
        console.warn(`⚠️ Background restoration failed (non-critical):`, error.message);
      });
      
      // Return the cached version immediately
      return { ...cachedReport, _wasRestored: true } as any;
    }
    
    console.log(`❌ Report NOT found in localStorage`);
    console.log(`📦 Step 2: Trying server...`);
    
    try {
      // Try to get from server
      console.log(`📡 Fetching from server: ${API_URL}/reports/${id}`);
      const report = await fetchWithAuth(`${API_URL}/reports/${id}`);
      
      console.log(`✅ SUCCESS: Report found on server!`);
      console.log(`📋 Report details:`, {
        id: report.id,
        name: report.name,
        status: report.status,
      });
      
      // Cache successful retrieval
      console.log(`💾 Caching report to localStorage...`);
      localReportCache.saveReport(report);
      
      return report;
    } catch (error: any) {
      console.log(`❌ Server fetch FAILED:`, error.message);
      console.log(`🔍 Error details:`, {
        message: error.message,
        url: `${API_URL}/reports/${id}`,
        searchedInCache: cachedIds,
        requestedId: id,
      });
      
      // If server fails and we don't have cache, re-throw
      console.error(`❌ FINAL RESULT: Report not found on server OR in localStorage`);
      console.error(`❌ Searched for ID: ${id}`);
      console.error(`❌ Available cached IDs: ${cachedIds.join(', ') || 'NONE'}`);
      
      // Re-throw the original error
      throw error;
    }
  },

  updateReport: async (report: Report): Promise<Report> => {
    // Cache to localStorage before saving to server
    localReportCache.saveReport(report);
    
    try {
      // Try to update the report
      return await fetchWithAuth(`${API_URL}/reports/${report.id}`, {
        method: "PUT",
        body: JSON.stringify(report),
      });
    } catch (error: any) {
      // If report not found on server (404), recreate it instead
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        console.log(`ℹ️ Report not found on server, recreating it...`);
        
        // Use POST to recreate the report on the server
        return await fetchWithAuth(`${API_URL}/reports`, {
          method: "POST",
          body: JSON.stringify(report),
        });
      }
      
      // For other errors, re-throw
      throw error;
    }
  },
};