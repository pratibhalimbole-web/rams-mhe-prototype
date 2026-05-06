import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as dbKv from "./kv_store.tsx";
import * as memoryKv from "./memory_store.tsx";

const app = new Hono().basePath("/make-server-02ca646a");

// KV Store selector - automatically falls back to memory if database is unavailable
let kv = dbKv;
let usingMemoryStore = false;
let lastConnectionError: any = null;

// Test database connection and fallback to memory store if needed
async function initializeKvStore() {
  try {
    // Try to access the database
    console.log('🔍 Testing database connection...');
    await dbKv.getByPrefix("__health_check__");
    console.log("✅ Database connected successfully");
    kv = dbKv;
    usingMemoryStore = false;
    lastConnectionError = null;
  } catch (error) {
    console.error("❌ DATABASE CONNECTION FAILED:");
    console.error("❌ Error details:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);
    console.warn("⚠️  DATABASE TABLE MISSING - Falling back to in-memory storage");
    console.warn("⚠️  Data will be lost on server restart");
    console.warn("⚠️  For production use, please create the database table:");
    console.warn(`⚠️  Table name: kv_store_02ca646a`);
    console.warn(`⚠️  Schema available in: /supabase/functions/server/kv_store.tsx`);
    kv = memoryKv;
    usingMemoryStore = true;
    lastConnectionError = error;
  }
}

// Initialize KV store on startup - wrapped in try-catch to ensure server always starts
try {
  await initializeKvStore();
} catch (error) {
  console.error("❌ CRITICAL: Failed to initialize KV store during startup:", error);
  console.error("❌ Server will continue with memory store fallback");
  // Ensure we fall back to memory store
  kv = memoryKv;
  usingMemoryStore = true;
  lastConnectionError = error;
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize default templates if none exist
async function initializeDefaultTemplates() {
  try {
    const existingTemplates = await kv.getByPrefix("template:");
    
    // Only create default templates if none exist
    if (!existingTemplates || existingTemplates.length === 0) {
      console.log("No templates found. Creating default RAMS IRDS template...");
      
      const defaultTemplate = {
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
      };
      
      await kv.set(`template:${defaultTemplate.id}`, defaultTemplate);
      console.log("Default template created successfully");
    } else {
      console.log(`Found ${existingTemplates.length} existing template(s)`);
    }
  } catch (error) {
    console.error("Error initializing default templates:", error);
    console.error("⚠️  DATABASE TABLE MISSING: The required KV store table does not exist.");
    console.error("⚠️  Please ensure the database table is created before using the Report module.");
    console.error("⚠️  Expected table name from kv_store.tsx schema");
  }
}

// Initialize on server startup - fire and forget, don't block server
initializeDefaultTemplates().catch(error => {
  console.error("❌ Failed to initialize default templates:", error);
  console.warn("⚠️  Server will continue without default templates");
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ 
    status: "ok",
    storage: usingMemoryStore ? "memory" : "database",
    timestamp: new Date().toISOString(),
  });
});

// Force re-check database connection endpoint
app.post("/reconnect-db", async (c) => {
  console.log('🔄 Force reconnecting to database...');
  await initializeKvStore();
  return c.json({ 
    status: "ok",
    storage: usingMemoryStore ? "memory" : "database",
    message: usingMemoryStore 
      ? "Still using memory storage - database table may not exist or have permission issues"
      : "Successfully connected to database!",
    errorDetails: lastConnectionError ? {
      message: lastConnectionError.message,
      code: lastConnectionError.code,
      hint: lastConnectionError.hint,
    } : null,
  });
});

// Storage status endpoint
app.get("/storage-status", (c) => {
  return c.json({ 
    usingMemoryStore,
    storageType: usingMemoryStore ? "in-memory" : "database",
    warning: usingMemoryStore ? "Data will be lost on server restart. Please create the database table for persistent storage." : null
  });
});

// Get all events
app.get("/events", async (c) => {
  try {
    const events = await kv.getByPrefix("event:");
    return c.json(events || []);
  } catch (error) {
    console.error("Error fetching events:", error);
    return c.json({ error: error.message || "Failed to fetch events" }, 500);
  }
});

// Save an event
app.post("/events", async (c) => {
  try {
    const event = await c.req.json();
    if (!event.id) {
        return c.json({ error: "Event ID is required" }, 400);
    }
    await kv.set(`event:${event.id}`, event);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving event:", error);
    return c.json({ error: error.message || "Failed to save event" }, 500);
  }
});

// Update an event
app.put("/events", async (c) => {
  try {
    const event = await c.req.json();
    if (!event.id) {
        return c.json({ error: "Event ID is required" }, 400);
    }
    await kv.set(`event:${event.id}`, event);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating event:", error);
    return c.json({ error: error.message || "Failed to update event" }, 500);
  }
});

// Delete an event
app.delete("/events", async (c) => {
  try {
    const id = c.req.query("id");
    if (!id) {
        return c.json({ error: "Event ID is required" }, 400);
    }
    await kv.del(`event:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return c.json({ error: error.message || "Failed to delete event" }, 500);
  }
});

// --- Reports Endpoints ---

// Debug endpoint to check storage status
app.get("/debug/storage", async (c) => {
  try {
    const allReports = await kv.getByPrefix("report:");
    const allTemplates = await kv.getByPrefix("template:");
    
    return c.json({
      storageType: usingMemoryStore ? "IN-MEMORY (globalThis)" : "DATABASE",
      reports: {
        count: allReports.length,
        ids: allReports.map((r: any) => r.id),
      },
      templates: {
        count: allTemplates.length,
        ids: allTemplates.map((t: any) => t.id),
      },
      memoryStoreInfo: usingMemoryStore ? {
        isGlobal: typeof globalThis.__MEMORY_STORE__ !== 'undefined',
        storeSize: globalThis.__MEMORY_STORE__?.size || 0,
      } : null,
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all reports
app.get("/reports", async (c) => {
  try {
    console.log('========================================');
    console.log('📋 GET /reports - Fetching all reports');
    console.log(`📊 Storage type: ${usingMemoryStore ? 'IN-MEMORY' : 'DATABASE'}`);
    
    // DEBUG: Check if we're using memory store and what's in it
    if (usingMemoryStore) {
      console.log(`🔍 Memory store size: ${memoryKv.size()} items`);
      console.log(`🔍 Checking for report: prefix...`);
    }
    
    const reports = await kv.getByPrefix("report:");
    
    console.log(`✅ Found ${reports.length} reports`);
    if (reports.length > 0) {
      console.log(`📋 Report IDs:`, reports.map((r: any) => r.id));
      console.log(`📋 First report:`, reports[0]);
    } else {
      console.log('⚠️  NO REPORTS FOUND IN STORAGE!');
      
      // DEBUG: List ALL keys in storage
      if (usingMemoryStore) {
        console.log('🔍 Listing ALL keys in memory store...');
        const allItems = await kv.getByPrefix("");
        console.log(`🔍 Total items in store: ${allItems.length}`);
        if (allItems.length > 0) {
          console.log('🔍 All keys:', allItems.map((item: any) => item.id || 'UNKNOWN'));
        }
      }
    }
    console.log('========================================');
    
    return c.json(reports || []);
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    return c.json({ error: error.message || "Failed to fetch reports" }, 500);
  }
});

// Save a report
app.post("/reports", async (c) => {
  try {
    const report = await c.req.json();
    if (!report.id) {
      return c.json({ error: "Report ID is required" }, 400);
    }
    await kv.set(`report:${report.id}`, report);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving report:", error);
    return c.json({ error: error.message || "Failed to save report" }, 500);
  }
});

// Create a new report (wizard endpoint)
app.post("/reports/create", async (c) => {
  try {
    console.log('========================================');
    console.log('📝 POST /reports/create - Creating new report');
    
    const payload = await c.req.json();
    console.log('📦 Payload:', payload);
    
    // Validate required fields
    if (!payload.reportName || !payload.reportType) {
      return c.json({ error: "Report name and type are required" }, 400);
    }
    
    // Generate unique report ID
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🆔 Generated report ID: ${reportId}`);
    
    // If a template is specified, fetch and clone its structure
    let templateSections = [];
    if (payload.templateId) {
      try {
        console.log(`📋 Fetching template: ${payload.templateId}`);
        const template = await kv.get(`template:${payload.templateId}`);
        if (template && template.sections) {
          console.log(`✅ Template found with ${template.sections.length} sections`);
          // Deep clone the template sections to preserve modules and blocks
          templateSections = JSON.parse(JSON.stringify(template.sections));
          console.log(`📦 Cloned ${templateSections.length} sections from template`);
        } else {
          console.warn(`⚠️ Template ${payload.templateId} not found or has no sections`);
        }
      } catch (error) {
        console.error(`❌ Error fetching template ${payload.templateId}:`, error);
      }
    }
    
    // Build report object
    const report = {
      id: reportId,
      name: payload.reportName,
      templateId: payload.templateId || null,
      templateName: payload.templateName || payload.reportType,
      site: payload.siteName || "Not specified",
      inspectionDate: payload.inspectionDate || new Date().toISOString(),
      lastActivityAt: new Date().toISOString(), // Add lastActivityAt for sorting
      status: "Draft" as const,
      createdDate: new Date().toISOString(),
      lastEdited: new Date().toISOString(), // Add lastEdited
      reportType: payload.reportType,
      layout: payload.layout || "single-column",
      pageSize: payload.pageSize || "A4",
      orientation: payload.orientation || "portrait",
      content: {
        sections: templateSections, // Use cloned template sections
      },
      modules: [], // Legacy field (kept for backwards compatibility)
      sections: templateSections, // Also set at root level for backwards compatibility
      version: 1, // Initialize version
      createdBy: "Current User", // Add createdBy
    };
    
    console.log(`📊 Storage type: ${usingMemoryStore ? 'IN-MEMORY' : 'DATABASE'}`);
    console.log(`💾 Saving report with key: report:${reportId}`);
    
    // Save to KV store
    await kv.set(`report:${reportId}`, report);
    
    console.log(`✅ kv.set() completed`);
    
    // Verify the report was saved by attempting to read it back
    console.log(`🔍 Verifying report was saved...`);
    const savedReport = await kv.get(`report:${reportId}`);
    
    if (!savedReport) {
      console.error(`❌ CRITICAL: Report was not saved! ID: ${reportId}`);
      console.error(`❌ Storage type: ${usingMemoryStore ? 'IN-MEMORY' : 'DATABASE'}`);
      
      if (usingMemoryStore) {
        console.error(`❌ Memory store size: ${memoryKv.size()}`);
        const allReports = await kv.getByPrefix("report:");
        console.error(`❌ All reports in store: ${allReports.length}`);
      }
      
      return c.json({ error: "Failed to save report" }, 500);
    }
    
    console.log(`✅ Report verified in storage!`);
    console.log(`✅ Verified report ID: ${savedReport.id}`);
    console.log(`✅ Verified report name: ${savedReport.name}`);
    
    // Check total reports after save
    if (usingMemoryStore) {
      const allReportsAfter = await kv.getByPrefix("report:");
      console.log(`📊 Total reports after save: ${allReportsAfter.length}`);
      console.log(`📊 Report IDs:`, allReportsAfter.map((r: any) => r.id));
    }
    
    console.log('========================================');
    
    // Return the report ID
    return c.json({ id: reportId, report });
  } catch (error) {
    console.error("❌ Error creating report:", error);
    return c.json({ error: error.message || "Failed to create report" }, 500);
  }
});

// Delete a report
app.delete("/reports", async (c) => {
  try {
    const id = c.req.query("id");
    if (!id) {
      return c.json({ error: "Report ID is required" }, 400);
    }
    await kv.del(`report:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting report:", error);
    return c.json({ error: error.message || "Failed to delete report" }, 500);
  }
});

// Get a single report by ID
app.get("/reports/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "Report ID is required" }, 400);
    }
    
    console.log(`Fetching report with ID: ${id}`);
    
    const report = await kv.get(`report:${id}`);
    if (!report) {
      console.log(`Report not found: ${id}`);
      console.log(`Storage type: ${usingMemoryStore ? 'in-memory' : 'database'}`);
      
      // If using memory store, list all reports for debugging
      if (usingMemoryStore) {
        const allReports = await kv.getByPrefix("report:");
        console.log(`Available reports in memory: ${allReports.length}`);
        console.log(`Report IDs: ${allReports.map((r: any) => r.id).join(', ')}`);
      }
      
      return c.json({ error: "Report not found" }, 404);
    }
    
    console.log(`Report found: ${report.id} - ${report.name}`);
    return c.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return c.json({ error: error.message || "Failed to fetch report" }, 500);
  }
});

// Update a report by ID
app.put("/reports/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    if (!id) {
      return c.json({ error: "Report ID is required" }, 400);
    }
    
    // Get existing report
    const existingReport = await kv.get(`report:${id}`);
    if (!existingReport) {
      return c.json({ error: "Report not found" }, 404);
    }
    
    // Merge updates
    const updatedReport = {
      ...existingReport,
      ...updates,
      id, // Ensure ID doesn't change
      lastEdited: new Date().toISOString(),
    };
    
    // Save updated report
    await kv.set(`report:${id}`, updatedReport);
    
    console.log(`Report updated successfully: ${id}`);
    return c.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return c.json({ error: error.message || "Failed to update report" }, 500);
  }
});

// --- Templates Endpoints ---

// Get all templates
app.get("/templates", async (c) => {
  try {
    const templates = await kv.getByPrefix("template:");
    return c.json(templates || []);
  } catch (error) {
    console.error("Error fetching templates:", error);
    
    // Check if it's a database table error
    if (error.message && error.message.includes("Could not find the table")) {
      return c.json({ 
        error: "Database table not found. Please contact your administrator to set up the required database tables.",
        details: error.message 
      }, 503);
    }
    
    return c.json({ error: error.message || "Failed to fetch templates" }, 500);
  }
});

// Get a single template by ID
app.get("/templates/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log(`🔍 Fetching template with ID: "${id}"`);
    
    if (!id) {
      return c.json({ error: "Template ID is required" }, 400);
    }
    
    const key = `template:${id}`;
    console.log(`🔑 Looking for key: "${key}"`);
    
    const template = await kv.get(key);
    
    if (!template) {
      console.warn(`❌ Template not found for key: "${key}"`);
      
      // Debug: List all template keys to help diagnose
      const allTemplates = await kv.getByPrefix("template:");
      console.log(`📋 All template keys in database:`, allTemplates.map((t: any) => t.id));
      
      return c.json({ error: "Template not found" }, 404);
    }
    
    console.log(`✅ Template found: ${template.name} (v${template.version})`);
    return c.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return c.json({ error: error.message || "Failed to fetch template" }, 500);
  }
});

// Save a template
app.post("/templates", async (c) => {
  try {
    const template = await c.req.json();
    if (!template.id) {
      return c.json({ error: "Template ID is required" }, 400);
    }
    await kv.set(`template:${template.id}`, template);
    return c.json(template); // Return the saved template
  } catch (error) {
    console.error("Error saving template:", error);
    return c.json({ error: error.message || "Failed to save template" }, 500);
  }
});

// Delete a template
app.delete("/templates", async (c) => {
  try {
    const id = c.req.query("id");
    if (!id) {
      return c.json({ error: "Template ID is required" }, 400);
    }
    await kv.del(`template:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return c.json({ error: error.message || "Failed to delete template" }, 500);
  }
});

// Get integrity kpi data
app.get("/integrity-kpi", async (c) => {
  try {
    const key = "integrity:kpi";
    let data = await kv.get(key);
    if (!data) {
      // Seed data matching the prompt example
      data = {
        totalTests: 30,
        testsExecuted: 18,
        testsPending: 12,
        coverage: 60
      };
      await kv.set(key, data);
    }
    return c.json(data);
  } catch (error) {
    console.error("Error fetching kpi data:", error);
    return c.json({ error: error.message || "Failed to fetch kpi data" }, 500);
  }
});

Deno.serve(app.fetch);