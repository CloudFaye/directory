import { writable } from 'svelte/store';

// API URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://two34-designers-backend.onrender.com';

// For client-side, use relative URL which will go through Vercel's routing
const isClient = typeof window !== 'undefined';
const getApiUrl = () => isClient ? '' : API_URL;

// API functions
export async function fetchDesigners() {
  try {
    // Always use the full API URL to avoid routing issues in production
    const response = await fetch(`${API_URL}/api/creatives`, {
      // Add CORS mode to ensure browser handles the request correctly
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return { 
      data: data.pages, 
      error: null
    };
  } catch (error) {
    console.error('Error fetching designers:', error);
    
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 