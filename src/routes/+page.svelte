<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchDesigners } from '$lib/api';
  import { getScreenshot } from '$lib/services/screenshot';

  interface Designer {
    name: string;
    category: string;
    services?: string[];
    portfolioUrl?: string;
  }
  
  let designers = $state<Designer[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let hoveredDesigner = $state<Designer | null>(null);
  let loadingPlaceholder: HTMLElement | null = null;
  let screenshotUrls = $state<Record<string, string | null>>({});

  async function loadDesigners() {
    loading = true;
    error = null;
    
    const result = await fetchDesigners();
    
    designers = result.data;
    error = result.error;
    loading = false;
    
    // Queue screenshots for all designers with portfolio URLs
    queueDesignerScreenshots();
  }
  
  async function queueDesignerScreenshots() {
    // Get all unique portfolio URLs
    const portfolioUrls = designers
      .filter(d => d.portfolioUrl)
      .map(d => d.portfolioUrl as string);
    
    // Remove duplicates
    const uniqueUrls = [...new Set(portfolioUrls)];
    
    // Request screenshots for each URL
    for (const url of uniqueUrls) {
      // Initial request to queue screenshots
      getScreenshot(url).then(screenshotUrl => {
        if (screenshotUrl) {
          screenshotUrls[url] = screenshotUrl;
        }
      });
    }
  }

  function getScreenshotUrl(url: string): string {
    // Return cached screenshot URL if available
    if (screenshotUrls[url]) {
      return screenshotUrls[url] as string;
    }
    
    // Otherwise request screenshot and return placeholder
    getScreenshot(url).then(screenshotUrl => {
      if (screenshotUrl) {
        screenshotUrls[url] = screenshotUrl;
      }
    });
    
    // Return thum.io as fallback while loading
    return `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`;
  }

  onMount(() => {
    loadDesigners();
  });
</script>

<div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
  
  {#if loading}
    <div class="flex justify-center py-4 col-span-full">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-md p-4 my-4 col-span-full">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading designers</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div class="mt-4">
            <button 
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              on:click={loadDesigners}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else if designers.length === 0}
    <p class="text-gray-600 col-span-full">No designers found</p>
  {:else}
    <ul class="space-y-4 col-span-full md:col-span-5 lg:col-span-5">
      {#each designers as designer}
        <li 
          class="border-b cursor-pointer pb-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
          on:mouseenter={() => hoveredDesigner = designer}
          on:mouseleave={() => hoveredDesigner = null}
        >
          <div class="flex flex-col">
            <div class="flex items-center justify-between">
              <h2 class="font-semibold text-lg">{designer.name}</h2>
              <span class="text-sm text-gray-500">{designer.category}</span>
            </div>
            
            {#if designer.services && designer.services.length}
              <div class="mt-2 flex flex-wrap gap-1">
                {#each designer.services as service}
                  <span class="text-xs px-2 py-0.5 bg-gray-100 rounded">{service}</span>
                {/each}
              </div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>

    <div class="sticky top-8 col-span-full md:col-span-7 lg:col-span-7 h-[70vh] rounded-xl overflow-hidden transition-all duration-500 flex items-center justify-center">
      {#if hoveredDesigner}
        {#if hoveredDesigner.portfolioUrl}
          <div class="w-full h-full relative">
            <div class="absolute inset-0 bg-gray-200 animate-pulse" bind:this={loadingPlaceholder}></div>
            <img 
              src={getScreenshotUrl(hoveredDesigner.portfolioUrl)} 
              alt={`${hoveredDesigner.name}'s portfolio`}
              class="w-full h-full object-cover object-top shadow-lg transition-all duration-300 relative z-10"
              loading="lazy"
              on:load={() => {
                if (loadingPlaceholder) loadingPlaceholder.style.display = 'none';
              }}
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-20">
              <h3 class="text-white text-xl font-medium">{hoveredDesigner.name}</h3>
              {#if hoveredDesigner.portfolioUrl}
                <a href={hoveredDesigner.portfolioUrl} target="_blank" rel="noopener noreferrer" 
                  class="text-blue-300 text-sm hover:text-blue-100 transition-colors inline-flex items-center gap-1">
                  Visit site
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
              {/if}
            </div>
          </div>
        {:else}
          <div class="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-500">
            <h3 class="text-white text-4xl font-bold tracking-wider">{hoveredDesigner.name.toUpperCase()}</h3>
          </div>
        {/if}
      {:else}
        <div class="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient-slow transition-all duration-500">
          <div class="flex items-center justify-center h-full">
            <h3 class="text-white text-2xl font-light">Hover on a designer to see their portfolio</h3>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .animate-gradient-slow {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
  }

  @keyframes gradient {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
</style>
