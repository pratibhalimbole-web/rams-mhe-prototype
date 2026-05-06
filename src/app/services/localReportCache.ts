/**
 * Local Report Cache Service
 * 
 * Provides browser localStorage caching for reports to survive server restarts.
 * This is especially important when using in-memory storage on the Edge Function.
 */

import { Report } from './reportService';

const CACHE_PREFIX = 'rams_report_';
const CACHE_INDEX_KEY = 'rams_report_index';

// Test localStorage availability on module load
const isLocalStorageAvailable = (() => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    console.log('✅ localStorage is available and working');
    return true;
  } catch (error) {
    console.error('❌ localStorage is NOT available:', error);
    return false;
  }
})();

export const localReportCache = {
  /**
   * Save a report to localStorage
   */
  saveReport(report: Report): void {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot save to localStorage - not available');
      return;
    }
    
    try {
      const key = `${CACHE_PREFIX}${report.id}`;
      const serialized = JSON.stringify(report);
      
      console.log(`💾 Saving report to localStorage...`);
      console.log(`   Key: ${key}`);
      console.log(`   Report ID: ${report.id}`);
      console.log(`   Data size: ${serialized.length} bytes`);
      
      localStorage.setItem(key, serialized);
      
      // Update index
      this.addToIndex(report.id);
      
      // Verify it was saved
      const verified = localStorage.getItem(key);
      if (verified) {
        console.log(`✅ Successfully cached report to localStorage: ${report.id}`);
      } else {
        console.error(`❌ Failed to verify cached report: ${report.id}`);
      }
    } catch (error) {
      console.error('❌ Failed to cache report to localStorage:', error);
      
      // Check if it's a quota error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('❌ localStorage quota exceeded - clearing old data...');
        // Could implement LRU eviction here
      }
    }
  },

  /**
   * Get a report from localStorage
   */
  getReport(reportId: string): Report | null {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot read from localStorage - not available');
      return null;
    }
    
    try {
      const key = `${CACHE_PREFIX}${reportId}`;
      
      console.log(`🔍 Looking for cached report...`);
      console.log(`   Key: ${key}`);
      console.log(`   Report ID: ${reportId}`);
      
      const cached = localStorage.getItem(key);
      
      if (cached) {
        const report = JSON.parse(cached);
        console.log(`✅ Retrieved cached report from localStorage: ${reportId}`);
        return report;
      } else {
        console.log(`❌ Report not found in localStorage: ${reportId}`);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get cached report from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove a report from localStorage
   */
  removeReport(reportId: string): void {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot remove from localStorage - not available');
      return;
    }
    
    try {
      const key = `${CACHE_PREFIX}${reportId}`;
      localStorage.removeItem(key);
      this.removeFromIndex(reportId);
      
      console.log(`📦 Removed cached report from localStorage: ${reportId}`);
    } catch (error) {
      console.error('Failed to remove cached report from localStorage:', error);
    }
  },

  /**
   * Get all cached report IDs
   */
  getCachedReportIds(): string[] {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot get cached report IDs - localStorage not available');
      return [];
    }
    
    try {
      const indexData = localStorage.getItem(CACHE_INDEX_KEY);
      return indexData ? JSON.parse(indexData) : [];
    } catch (error) {
      console.error('Failed to get cached report index:', error);
      return [];
    }
  },

  /**
   * Add report ID to index
   */
  addToIndex(reportId: string): void {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot add to index - localStorage not available');
      return;
    }
    
    try {
      const ids = this.getCachedReportIds();
      if (!ids.includes(reportId)) {
        ids.push(reportId);
        localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(ids));
      }
    } catch (error) {
      console.error('Failed to add report to index:', error);
    }
  },

  /**
   * Remove report ID from index
   */
  removeFromIndex(reportId: string): void {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot remove from index - localStorage not available');
      return;
    }
    
    try {
      const ids = this.getCachedReportIds();
      const filtered = ids.filter(id => id !== reportId);
      localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove report from index:', error);
    }
  },

  /**
   * Clear all cached reports
   */
  clearAll(): void {
    if (!isLocalStorageAvailable) {
      console.error('❌ Cannot clear all cached reports - localStorage not available');
      return;
    }
    
    try {
      const ids = this.getCachedReportIds();
      ids.forEach(id => {
        const key = `${CACHE_PREFIX}${id}`;
        localStorage.removeItem(key);
      });
      localStorage.removeItem(CACHE_INDEX_KEY);
      
      console.log('📦 Cleared all cached reports from localStorage');
    } catch (error) {
      console.error('Failed to clear cached reports:', error);
    }
  },
};