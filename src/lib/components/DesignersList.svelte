<script lang="ts">
  import { page } from '$app/stores';
  import { 
    filteredDesigners, 
    loading, 
    error, 
    sortOrder,
    toggleSortOrder, 
    applySorting,
    dataLoaded,
    activeCategory,
    activeService,
    searchTerm
  } from '$lib/stores/designers';

  // Track if any filters are active
  $: isFiltered = 
    $activeCategory !== null || 
    $activeService !== null || 
    $searchTerm !== '';

  // Track current filter type and value for display
  $: currentFilterType = $activeCategory ? 'category' : $activeService ? 'service' : 'search';
  $: currentFilterValue = $activeCategory || $activeService || $searchTerm;

  // Apply sorting when filtered designers change or when URL route changes
  $: {
    if ($filteredDesigners.length > 0) {
      applySorting();
    }
  }

  // Force rerender when URL changes
  $: urlPath = $page.url.pathname;
  $: urlSearch = $page.url.search;
  
  // Handle toggling sort order
  function handleSort() {
    toggleSortOrder();
  }

  // Check if empty state should be shown (only if data is loaded and results are empty)
  $: showEmptyState = !$loading && $dataLoaded && $filteredDesigners.length === 0;

  // Get screenshot for a designer's portfolio
  function getScreenshotUrl(url: string): string {
    if (!url) return '';
    return `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`;
  }
</script>

<div class="w-full">
  <!-- Only Sort Controls -->
  <div class="flex justify-end items-center mb-6 pb-2 border-b">
    <div class="flex items-center">
      <button 
        class="px-3 py-1 flex items-center text-sm"
        onclick={handleSort}
      >
        A-Z
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-1" viewBox="0 0 20 20" fill="currentColor">
          {#if $sortOrder === 'asc'}
            <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          {:else}
            <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Initial Loading State -->
  {#if $loading || !$dataLoaded}
    <div class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  
  <!-- Error State -->
  {:else if $error}
    <div class="bg-red-50 border border-red-200 rounded-md p-4 my-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading designers</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{$error}</p>
          </div>
        </div>
      </div>
    </div>
  
  <!-- Empty State - Show only if data is loaded and filtered results are empty -->
  {:else if showEmptyState && isFiltered}
    <div class="text-center py-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No designers found</h3>
      <p class="mt-1 text-sm text-gray-500">Try changing your search or filter criteria.</p>
      <div class="mt-4">
        <a href="/" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          View all designers
        </a>
      </div>
    </div>

  <!-- Designers List -->
  {:else if $filteredDesigners.length > 0}
    <ul class="space-y-4">
      {#each $filteredDesigners as designer, index (designer.id || `${designer.name}-${index}`)}
        <li class="border-b pb-4 hover:bg-gray-50 transition-colors duration-150">
          <div class="flex justify-between items-start">
            <div class="flex items-center justify-between gap-2 flex-row">
             
                <h3 class="text-lg font-semibold">{designer.name}</h3>
            
               <span class="text-sm text-gray-500">{designer.category}</span>
              
              {#if designer.services && designer.services.length}
                <div class=" flex flex-wrap gap-1">
                  {#each designer.services as service}
                    <span class="text-xs px-1 py-0.5  rounded">[{service}]</span>
                  {/each}
                </div>
              {/if}

              {#if designer.portfolioUrl}
                <div class="mt-2">
                  <a 
                    href={designer.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center"
                  >
                    Visit website
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
              {/if}
            </div>

            {#if designer.portfolioUrl}
              <div class="ml-4 w-32 h-20 bg-gray-100 hidden sm:block flex-shrink-0">
                <img 
                  src={getScreenshotUrl(designer.portfolioUrl)} 
                  alt={`${designer.name} website preview`}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  /* Add any component specific styles here */
</style> 