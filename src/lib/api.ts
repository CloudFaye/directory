const API_URL = import.meta.env.DEV 
  ? '' // Empty string to use local proxy in development
  : 'https://two34-designers-backend.onrender.com';
const VERCEL_URL = 'https://directory-liart-five.vercel.app';
const DEV_URL = import.meta.env.DEV ? 'http://localhost:5173' : VERCEL_URL;

// Cache mechanism to avoid redundant fetches
let cachedDesigners: Designer[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedDesigners && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      // Apply filters on cached data to avoid network request
      return applyFiltersToData(cachedDesigners, params);
    }
    
    const targetUrl = `${API_URL}/api/creatives`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Reduced timeout to 10s
    
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
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Update cache
    cachedDesigners = designersWithPortfolio;
    cacheTimestamp = now;
    
    // Apply filters if provided
    return applyFiltersToData(designersWithPortfolio, params);
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
 * Apply filters to data without making API calls
 */
function applyFiltersToData(designers: Designer[], params?: { category?: string; service?: string; searchTerm?: string }) {
  if (!params) {
    return { data: designers, error: null };
  }
  
  let filtered = [...designers];
  
  // Apply category filter
  if (params.category) {
    filtered = filtered.filter(
      (designer: Designer) => designer.category === params.category
    );
  }
  
  // Apply service filter
  if (params.service) {
    filtered = filtered.filter(
      (designer: Designer) => designer.services?.includes(params.service as string)
    );
  }
  
  // Apply search filter
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filtered = filtered.filter((designer: Designer) => 
      designer.name.toLowerCase().includes(searchLower) || 
      designer.category.toLowerCase().includes(searchLower) ||
      designer.services?.some(service => service.toLowerCase().includes(searchLower))
    );
  }
  
  return { data: filtered, error: null };
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