const API_URL = import.meta.env.DEV 
  ? '' // Empty string to use local proxy
  : (import.meta.env.VITE_API_URL || 'https://two34-designers-backend.onrender.com');
const VERCEL_URL = 'https://directory-liart-five.vercel.app';
const DEV_URL = import.meta.env.DEV ? 'http://localhost:5173' : VERCEL_URL;

/**
 * Designer data interface
 */
interface Designer {
  name: string;
  category: string;
  services?: string[];
  website?: string;
  [key: string]: any;
}

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
        'Origin': DEV_URL,
        'Referer': DEV_URL
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
    
    // Transform data to include portfolioUrl if website field exists
    const designersWithPortfolio = data.pages.map((designer: Designer) => ({
      ...designer,
      portfolioUrl: designer.website || null
    }));
    
    return { 
      data: designersWithPortfolio, 
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