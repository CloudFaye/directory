import { writable } from 'svelte/store';

// API URL from environment or fallback - will be used for non-proxied calls
const API_URL = import.meta.env.VITE_API_URL || 'https://two34-designers-backend.onrender.com';

// For client-side, use relative URL which will go through Vercel's routing
const isClient = typeof window !== 'undefined';
const getApiUrl = () => isClient ? '' : API_URL;

// Network status store
export const networkStatus = writable({
  online: navigator.onLine,
  lastUpdated: null as Date | null
});

// Update network status when connection changes
window.addEventListener('online', () => {
  networkStatus.update(status => ({ ...status, online: true }));
});

window.addEventListener('offline', () => {
  networkStatus.update(status => ({ ...status, online: false }));
});

// Cache utilities
const CACHE_KEY_DESIGNERS = 'designers_cache';

const saveToCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
};

const getFromCache = (key: string) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Failed to retrieve cached data:', error);
    return null;
  }
};

// API functions
export async function fetchDesigners() {
  try {
    // Use relative URL for client which will go through Vercel's proxy route
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/creatives`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save to cache for offline access
    if (data.pages) {
      saveToCache(CACHE_KEY_DESIGNERS, data.pages);
      networkStatus.update(status => ({ ...status, lastUpdated: new Date() }));
    }
    
    return { 
      data: data.pages, 
      error: null, 
      source: 'network' 
    };
  } catch (error) {
    console.error('Error fetching designers:', error);
    
    // Try to get from cache if network request fails
    const cached = getFromCache(CACHE_KEY_DESIGNERS);
    
    if (cached?.data) {
      return { 
        data: cached.data, 
        error: null, 
        source: 'cache',
        timestamp: cached.timestamp
      };
    }
    
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'none'
    };
  }
} 