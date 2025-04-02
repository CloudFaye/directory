import { fetchDesigners, extractCategories, extractServices, sortDesigners, type Designer } from '$lib/api';
import { writable, derived, get } from 'svelte/store';
export const designers = writable<Designer[]>([]);
export const filteredDesigners = writable<Designer[]>([]);
export const categories = writable<string[]>([]);
export const services = writable<string[]>([]);
export const loading = writable(true);
export const error = writable<string | null>(null);
export const sortOrder = writable<'asc' | 'desc'>('asc');

// Filter parameters
export const activeCategory = writable<string | null>(null);
export const activeService = writable<string | null>(null);
export const searchTerm = writable<string>('');

// Flag to track if data has been loaded
export const dataLoaded = writable(false);

// Load all designers data (only once)
export async function loadAllDesigners() {
  // Don't reload if we already have data and loading is in progress
  if (get(loading) && get(designers).length > 0) {
    return;
  }
  
  // If we already have data, just apply filters
  if (get(dataLoaded) && get(designers).length > 0) {
    applyFiltersLocally();
    return;
  }
  
  loading.set(true);
  error.set(null);
  
  try {
    const result = await fetchDesigners();
    
    if (result.error) {
      error.set(result.error);
      loading.set(false);
      return;
    }
    
    designers.set(result.data);
    categories.set(extractCategories(result.data));
    services.set(extractServices(result.data));
    
    // Set filtered designers based on current filters
    applyFiltersLocally();
    
    dataLoaded.set(true);
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    loading.set(false);
  }
}

// Apply filters locally without making API calls
function applyFiltersLocally() {
  const allDesigners = get(designers);
  const currentCategory = get(activeCategory);
  const currentService = get(activeService);
  const currentSearchTerm = get(searchTerm);
  
  let filtered = [...allDesigners];
  
  // Apply category filter
  if (currentCategory) {
    filtered = filtered.filter(designer => designer.category === currentCategory);
  }
  
  // Apply service filter
  if (currentService) {
    filtered = filtered.filter(designer => 
      designer.services && designer.services.includes(currentService)
    );
  }
  
  // Apply search filter
  if (currentSearchTerm) {
    const searchLower = currentSearchTerm.toLowerCase();
    filtered = filtered.filter(designer => 
      designer.name.toLowerCase().includes(searchLower) || 
      designer.category.toLowerCase().includes(searchLower) ||
      designer.services?.some(service => service.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply current sort order
  filtered = sortDesigners(filtered, get(sortOrder));
  
  // Update filtered designers
  filteredDesigners.set(filtered);
}

// Set active category and apply filters
export function setCategory(category: string | null) {
  const currentCategory = get(activeCategory);
  
  // Don't do anything if category is already active
  if (currentCategory === category) return;
  
  // If switching to a new category, reset service
  if (category !== null && get(activeService) !== null) {
    activeService.set(null);
  }
  
  activeCategory.set(category);
  
  // Apply filters locally if data is loaded
  if (get(dataLoaded)) {
    applyFiltersLocally();
  } else {
    // Load data if not loaded yet
    loadAllDesigners();
  }
}

// Set active service and apply filters
export function setService(service: string | null) {
  const currentService = get(activeService);
  
  // Don't do anything if service is already active
  if (currentService === service) return;
  
  // If switching to a new service, reset category
  if (service !== null && get(activeCategory) !== null) {
    activeCategory.set(null);
  }
  
  activeService.set(service);
  
  // Apply filters locally if data is loaded
  if (get(dataLoaded)) {
    applyFiltersLocally();
  } else {
    // Load data if not loaded yet
    loadAllDesigners();
  }
}

// Set search term and apply filters
export function setSearchTerm(term: string) {
  // Don't do anything if search term is already active
  if (get(searchTerm) === term) return;
  
  searchTerm.set(term);
  
  // Apply filters locally if data is loaded
  if (get(dataLoaded)) {
    applyFiltersLocally();
  } else {
    // Load data if not loaded yet
    loadAllDesigners();
  }
}

// Toggle sort order and apply to filtered designers
export function toggleSortOrder() {
  const current = get(sortOrder);
  const newOrder = current === 'asc' ? 'desc' : 'asc';
  sortOrder.set(newOrder);
  
  // Apply sorting locally
  const filtered = sortDesigners(get(filteredDesigners), newOrder);
  filteredDesigners.set(filtered);
}

// Sort filtered designers
export function applySorting() {
  const current = get(sortOrder);
  const filtered = sortDesigners(get(filteredDesigners), current);
  filteredDesigners.set(filtered);
} 