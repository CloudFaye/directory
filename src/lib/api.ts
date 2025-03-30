import { writable } from 'svelte/store';

// API URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://two34-designers-backend.onrender.com';
// Vercel deployment URL
const VERCEL_URL = 'https://directory-liart-five.vercel.app';

/**
 * Fetch designers from the backend 
 */
export async function fetchDesigners() {
  try {
    // Use direct API call
    const targetUrl = `${API_URL}/api/creatives`;
    
    console.log('Fetching designers from:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors', // Keep CORS mode
      credentials: 'omit', // Don't send credentials
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': VERCEL_URL,
        'Referer': VERCEL_URL
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