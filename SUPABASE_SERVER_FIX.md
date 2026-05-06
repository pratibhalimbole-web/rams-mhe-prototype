# Supabase Edge Function - Server Not Responding Fix

## 🔴 Problem
```
Fetch Error: Failed to fetch
URL: https://czqwmmqfduwppzvjzxbz.supabase.co/functions/v1/make-server-02ca646a/templates
Error: Unable to connect to server. Please check that the Supabase Edge Function is deployed and running.
```

## 🔍 Root Cause
The Supabase Edge Function at `/supabase/functions/server/index.tsx` is not responding. This could be due to:

1. **Edge Function not deployed** - The function needs to be deployed to Supabase
2. **Server crashed during initialization** - An error during startup prevented the server from starting
3. **Incorrect server path** - The function is deployed to a different path than expected

## ✅ Solution

### **Step 1: Verify Server File Structure**

Ensure you have the correct file structure:
```
/supabase/functions/server/
  ├── index.tsx          ← Main server file (Hono app)
  ├── kv_store.tsx       ← Database KV store
  └── memory_store.tsx   ← In-memory fallback store
```

✅ **Status**: Files exist and are properly structured

### **Step 2: Check Server Configuration**

The server is configured with:
- **Base Path**: `/make-server-02ca646a`
- **Full URL**: `https://czqwmmqfduwppzvjzxbz.supabase.co/functions/v1/make-server-02ca646a`
- **Templates Endpoint**: `/templates` (full: `/make-server-02ca646a/templates`)

✅ **Status**: Configuration is correct

### **Step 3: Verify Server Deployment**

In Figma Make environments, Edge Functions should **auto-deploy** when files are saved. However, you may need to manually trigger deployment.

**To verify/deploy the server:**

1. **Check Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/czqwmmqfduwppzvjzxbz
   - Navigate to: **Edge Functions** section
   - Look for function named: `server` or `make-server-02ca646a`
   - Check deployment status and logs

2. **Manual Deployment** (if needed):
   ```bash
   # Using Supabase CLI
   supabase functions deploy server
   ```

3. **Check Function Logs**:
   ```bash
   # View real-time logs
   supabase functions logs server --tail
   ```

### **Step 4: Test Server Endpoints**

Once deployed, test the server endpoints:

#### **Health Check Endpoint**:
```bash
curl https://czqwmmqfduwppzvjzxbz.supabase.co/functions/v1/make-server-02ca646a/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "storage": "memory",  // or "database"
  "timestamp": "2026-03-05T..."
}
```

#### **Templates Endpoint**:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     https://czqwmmqfduwppzvjzxbz.supabase.co/functions/v1/make-server-02ca646a/templates
```

**Expected Response**:
```json
[
  {
    "id": "template-default-rams",
    "name": "Default RAMS IRDS Template",
    "status": "Published",
    ...
  }
]
```

### **Step 5: Check Server Logs**

If the server is deployed but not responding, check the logs for errors:

**Common Issues**:
1. **Import errors** - Missing dependencies or incorrect imports
2. **Initialization errors** - Database connection failures
3. **CORS issues** - Blocked by browser (but server would still start)

**Recent Changes to Fix Startup Issues**:
- ✅ Wrapped `initializeKvStore()` in try-catch to ensure server always starts
- ✅ Made `initializeDefaultTemplates()` fire-and-forget (won't block server)
- ✅ Server now falls back to in-memory storage if database table doesn't exist

---

## 🚀 Workaround: Test Server Locally

While troubleshooting deployment, you can test the server locally:

### **Option 1: Local Supabase**
```bash
# Start local Supabase
supabase start

# Deploy function locally
supabase functions serve server

# Test endpoint
curl http://localhost:54321/functions/v1/make-server-02ca646a/health
```

### **Option 2: Standalone Deno**
```bash
cd supabase/functions/server
deno run --allow-net --allow-env index.tsx
```

---

## 📊 Server Status Indicators

The application now includes better error handling:

1. **Server Connection Error Banner**: Shows when server is unreachable
2. **Console Logs**: Detailed fetch error information
3. **Health Check Endpoint**: `/health` - Quick server status check
4. **Storage Status Endpoint**: `/storage-status` - Check if using memory or database

---

## 🔧 Recent Fixes Applied

### **1. Server Initialization Hardening**
```typescript
// Before: Could crash if database unavailable
await initializeKvStore();

// After: Always starts, falls back to memory
try {
  await initializeKvStore();
} catch (error) {
  console.error("❌ CRITICAL: Failed to initialize KV store");
  kv = memoryKv;
  usingMemoryStore = true;
}
```

### **2. Template Initialization Non-Blocking**
```typescript
// Before: Could silently fail
initializeDefaultTemplates();

// After: Fails gracefully with logging
initializeDefaultTemplates().catch(error => {
  console.error("❌ Failed to initialize default templates");
});
```

### **3. Frontend Error Display**
- Now shows server connection errors for both reports AND templates
- More detailed error messages in console
- User-friendly error banner

---

## 🎯 Next Steps

1. **Check Supabase Dashboard** for function deployment status
2. **Review function logs** for any startup errors
3. **Test health endpoint** to verify server is responding
4. **Verify API URL** matches your Supabase project

---

## 📝 Debugging Checklist

- [ ] Server files exist at `/supabase/functions/server/`
- [ ] Function is deployed to Supabase (check dashboard)
- [ ] Health endpoint returns 200 OK
- [ ] Authorization header includes valid anon key
- [ ] CORS is enabled (already configured in server)
- [ ] No errors in Supabase function logs
- [ ] Project ID matches: `czqwmmqfduwppzvjzxbz`

---

## 💡 Alternative: Use Frontend-Only Templates

As a temporary workaround while fixing deployment, you could use frontend-only template storage:

```typescript
// In reportService.ts, add a fallback
getTemplates: async (): Promise<ReportTemplate[]> => {
  try {
    return await fetchWithAuth(`${API_URL}/templates`);
  } catch (error) {
    console.warn("Server unavailable, using local templates");
    return JSON.parse(localStorage.getItem('local_templates') || '[]');
  }
}
```

However, this is **not recommended** for production as it loses sync across devices/browsers.

---

**Status**: ⚠️ Server Deployment Required  
**Impact**: High (Report module non-functional)  
**Priority**: Critical  

**Recommended Action**: Deploy the Edge Function to Supabase and verify with health check endpoint.
