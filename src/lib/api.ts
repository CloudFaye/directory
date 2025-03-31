const API_URL = import.meta.env.VITE_API_URL || 'https://two34-designers-backend.onrender.com';
const VERCEL_URL = 'https://directory-liart-five.vercel.app';

/**
 * Fetch designers from the backend 
 */
export async function fetchDesigners() {
  try {
    const targetUrl = `${API_URL}/api/creatives`;
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors', 
      credentials: 'omit', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': VERCEL_URL,
        'Referer': VERCEL_URL
      },
      signal: AbortSignal.timeout(15000) 
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.pages) {
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
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error connecting to the server';
    
    return { 
      data: [], 
      error: errorMessage
    };
  }
} 