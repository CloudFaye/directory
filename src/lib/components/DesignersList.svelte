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
  import { onMount } from 'svelte';

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

  // Flag to track if we should load screenshots (after initial render)
  let shouldLoadScreenshots = false;
  
  // Use Intersection Observer for lazy loading
  let loadedImages = new Set();
  
  // Get screenshot for a designer's portfolio
  function getScreenshotUrl(url: string, index: number): string {
    if (!url || !shouldLoadScreenshots || !loadedImages.has(index)) return '';
    return `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`;
  }
  
  // Initialize intersection observer after component mounts
  onMount(() => {
    // Wait for initial render and data to load before loading screenshots
    setTimeout(() => {
      shouldLoadScreenshots = true;
    }, 800);
    
    // Use intersection observer to load only visible thumbnails
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '-1');
          if (index >= 0) {
            loadedImages.add(index);
            // Force update
            loadedImages = loadedImages;
            // Stop observing this element
            observer.unobserve(entry.target);
          }
        }
      });
    }, { rootMargin: '200px' });
    
    // Observe all placeholders
    const observePlaceholders = () => {
      document.querySelectorAll('.screenshot-placeholder').forEach((el, i) => {
        observer.observe(el);
      });
    };
    
    // Initial observation
    observePlaceholders();
    
    // Re-observe when designers change
    const unsubscribe = filteredDesigners.subscribe(() => {
      // Wait for DOM to update with new designers
      setTimeout(observePlaceholders, 100);
    });
    
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  });
</script>

<div class="">
  <!-- Only Sort Controls -->
  <div class="flex justify-between items-center mb-6 pb-2 border-b">
    <h2 class="text-lg uppercase tracking-wide font-medium text-gray-800">
      {$activeCategory ? $activeCategory : $activeService ? $activeService : 'All Designers'}
    </h2>
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
    <div class="designers-grid">
      {#each $filteredDesigners as designer, index (designer.id || `${designer.name}-${index}`)}
        <div class="designer relative py-1 border-b border-gray-200 min-w-0">
          {#if designer.portfolioUrl}
            <a href={designer.portfolioUrl} aria-label={`${designer.name} portfolio`} target="_blank" rel="noopener nofollow" class="absolute inset-0 z-10"></a>
          {/if}
          
          <div class="name-row">
            <div class="name-container relative inline-block overflow-hidden">
              <span class="hover-bg absolute inset-0 bg-yellow-300 origin-left transform scale-x-0 transition-transform duration-200 ease-in-out"></span>
              <h3 class="text-sm font-semibold mr-1.5 relative z-[1]">{designer.name}</h3>
            </div>
            <span class="type text-xs px-1 ml-1 text-gray-600 font-mono">
              {designer.type || 'NG'}
            </span>
          </div>
          
          <div class="details text-xs text-gray-600 mt-0.5 leading-tight">
            <span class="category">{designer.category}</span>
            {#if designer.services && designer.services.length}
              <span class="services ml-1">[{designer.services.join(', ')}]</span>
            {/if}
            
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .designers-grid {
    columns: 1;
    column-gap: 3rem;
    column-fill: balance;
    width: 100%;
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  
  @media (min-width: 640px) {
    .designers-grid {
      columns: 2;
    }
  }
  
  @media (min-width: 1024px) {
    .designers-grid {
      columns: 3;
    }
  }
  
  .designer {
    break-inside: avoid;
    page-break-inside: avoid;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    width: 100%;
    min-width: 0;
  }
  
  .name-row {
    display: flex;
    align-items: baseline;
  }
  
  .name-container {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  
  .hover-bg {
    position: absolute;
    inset: 0;
    background-color: #FDE047;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease-out;
  }
  
  .designer:hover .hover-bg {
    transform: scaleX(1);
  }
  
  .designer:not(:hover) .hover-bg {
    transform-origin: right;
  }
  
  h3 {
    position: relative;
    z-index: 1;
    display: inline-block;
  }
  
  .type {
    font-family: monospace;
    opacity: 0.7;
    vertical-align: baseline;
  }
  
  .details {
    font-size: 0.75rem;
    line-height: 1.2;
    color: rgba(0, 0, 0, 0.6);
  }
  
  .services {
    font-style: normal;
  }
  
  .prv {
    opacity: 0.5;
  }
</style>

