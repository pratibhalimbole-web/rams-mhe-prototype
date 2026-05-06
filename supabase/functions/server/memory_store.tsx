/**
 * In-Memory Key-Value Store Fallback
 * 
 * This provides a temporary in-memory storage solution when the database table is not available.
 * Data is persisted only during the server session and will be lost on server restart.
 * 
 * Use this for development/prototyping. For production, ensure the database table exists.
 */

// Use globalThis to ensure the store persists across Deno Edge Function requests
// This is critical because Deno can create new module instances per request
declare global {
  var __MEMORY_STORE__: Map<string, any> | undefined;
}

// In-memory storage - use a global variable to persist across requests
const store = globalThis.__MEMORY_STORE__ || new Map<string, any>();
if (!globalThis.__MEMORY_STORE__) {
  globalThis.__MEMORY_STORE__ = store;
  console.log("🔧 Initialized NEW global in-memory store");
} else {
  console.log(`🔧 Reusing EXISTING global in-memory store (${store.size} items)`);
}

// Set stores a key-value pair in memory
export const set = async (key: string, value: any): Promise<void> => {
  store.set(key, value);
  console.log(`💾 Memory store SET: ${key} (Total items: ${store.size})`);
};

// Get retrieves a key-value pair from memory
export const get = async (key: string): Promise<any> => {
  const value = store.get(key);
  console.log(`🔍 Memory store GET: ${key} - ${value ? 'FOUND' : 'NOT FOUND'} (Total items: ${store.size})`);
  return value;
};

// Delete removes a key-value pair from memory
export const del = async (key: string): Promise<void> => {
  store.delete(key);
};

// Sets multiple key-value pairs in memory
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  keys.forEach((key, index) => {
    store.set(key, values[index]);
  });
};

// Gets multiple key-value pairs from memory
export const mget = async (keys: string[]): Promise<any[]> => {
  return keys.map(key => store.get(key)).filter(v => v !== undefined);
};

// Deletes multiple key-value pairs from memory
export const mdel = async (keys: string[]): Promise<void> => {
  keys.forEach(key => store.delete(key));
};

// Search for key-value pairs by prefix
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const results: any[] = [];
  for (const [key, value] of store.entries()) {
    if (key.startsWith(prefix)) {
      results.push(value);
    }
  }
  return results;
};

// Get the number of items in the store (for debugging)
export const size = (): number => {
  return store.size;
};

// Clear all data (for debugging)
export const clear = (): void => {
  store.clear();
};