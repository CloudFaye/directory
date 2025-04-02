const API_URL = import.meta.env.DEV 
  ? '' // Empty string to use local proxy in development
  : 'https://two34-designers-backend.onrender.com';
const VERCEL_URL = 'https://directory-liart-five.vercel.app';
const DEV_URL = import.meta.env.DEV ? 'http://localhost:5173' : VERCEL_URL;

/**
 * Designer data interface
 */
export interface Designer {
  name: string;
  category: string;
  services?: string[];
  website?: string;
  portfolioUrl?: string;
  [key: string]: any;
}

/**
 * Fetch designers from the backend 
 */
export async function fetchDesigners(params?: { category?: string; service?: string; searchTerm?: string }) {
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
    let designersWithPortfolio = data.pages.map((designer: Designer) => ({
      ...designer,
      portfolioUrl: designer.website || null
    }));
    
    // Apply filters if provided
    if (params) {
      if (params.category) {
        designersWithPortfolio = designersWithPortfolio.filter(
          (designer: Designer) => designer.category === params.category
        );
      }
      
      if (params.service) {
        designersWithPortfolio = designersWithPortfolio.filter(
          (designer: Designer) => designer.services?.includes(params.service as string)
        );
      }
      
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        designersWithPortfolio = designersWithPortfolio.filter((designer: Designer) => 
          designer.name.toLowerCase().includes(searchLower) || 
          designer.category.toLowerCase().includes(searchLower) ||
          designer.services?.some(service => service.toLowerCase().includes(searchLower))
        );
      }
    }
    
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

/**
 * Extract unique categories from designers data
 */
export function extractCategories(designers: Designer[]): string[] {
  const categoriesSet = new Set<string>();
  
  designers.forEach(designer => {
    if (designer.category) {
      categoriesSet.add(designer.category);
    }
  });
  
  return Array.from(categoriesSet).sort();
}

/**
 * Extract unique services from designers data
 */
export function extractServices(designers: Designer[]): string[] {
  const servicesSet = new Set<string>();
  
  designers.forEach(designer => {
    if (designer.services && Array.isArray(designer.services)) {
      designer.services.forEach(service => {
        servicesSet.add(service);
      });
    }
  });
  
  return Array.from(servicesSet).sort();
}

/**
 * Sort designers alphabetically by name
 */
export function sortDesigners(designers: Designer[], order: 'asc' | 'desc' = 'asc'): Designer[] {
  return [...designers].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
} 