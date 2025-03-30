import { writable } from 'svelte/store';

// API URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://two34-designers-backend.onrender.com';

// For client-side, use relative URL which will go through Vercel's routing
const isClient = typeof window !== 'undefined';
const getApiUrl = () => isClient ? '' : API_URL;

// API functions
export async function fetchDesigners() {
  try {
    console.log('Fetching designers from:', `${API_URL}/api/creatives`);
    
    const response = await fetch(`${API_URL}/api/creatives`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Timeout handling with AbortController
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || !data.pages) {
      console.warn('Unexpected API response structure:', data);
      return { 
        data: [], 
        error: 'Invalid response format from API' 
      };
    }
    
    return { 
      data: data.pages, 
      error: null
    };
  } catch (error) {
    // Improved error logging with more context
    console.error('Error fetching designers:', error);
    
    // User-friendly error messages
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error connecting to the server';
    
    return { 
      data: [], 
      error: errorMessage
    };
  }
} 