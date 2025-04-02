<script lang='ts'>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { 
    categories, 
    services, 
    loading, 
    activeCategory, 
    activeService,
    loadAllDesigners,
    dataLoaded,
    setCategory,
    setService
  } from '$lib/stores/designers';

  // Synchronize URL state with store state when component mounts or URL changes
  $effect(() => {
    // Only load data if not already loaded
    if (!$dataLoaded) {
      loadAllDesigners();
    }
    
    // If URL has parameters, update stores to match
    const urlCategory = $page.params.category;
    const urlService = $page.params.service;
    
    if (urlCategory && (!$activeCategory || $activeCategory !== urlCategory)) {
      setCategory(urlCategory);
    } else if (urlService && (!$activeService || $activeService !== urlService)) {
      setService(urlService);
    } else if ($page.url.pathname === '/' && ($activeCategory || $activeService)) {
      // Reset filters when on homepage
      setCategory(null);
      setService(null);
    }
  });

  // Track if category or service sections should be open
  let isCategoryOpen = $derived($activeCategory !== null || $page.url.pathname.startsWith('/category/'));
  let isServiceOpen = $derived($activeService !== null || $page.url.pathname.startsWith('/service/'));

  // Control for details elements
  let categoryDetails: HTMLDetailsElement;
  let serviceDetails: HTMLDetailsElement;
  
  // Keep summaries open based on active filters
  $effect(() => {
    if ($activeCategory) {
      if (categoryDetails) categoryDetails.open = true;
    }
    
    if ($activeService) {
      if (serviceDetails) serviceDetails.open = true;
    }
  });

  // Determine if an item is active
  function isActiveCategory(category: string): boolean {
    return $activeCategory === category;
  }

  function isActiveService(service: string): boolean {
    return $activeService === service;
  }
</script>

<sidebar id="menu" class="lg:w-[280px] fixed left-0 top-0 h-full bg-slate-200 border-r border-gray-200 p-4 flex flex-col gap-4 justify-between overflow-y-auto">
  <div id="togglehamburger" class="md:hidden cursor-pointer">
    <!-- Hamburger icon for mobile -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </div>

  <nav id="commands">
    <div id="logo" class="mb-6">
      <a href="/" class="text-lg font-bold no-underline">
        234designers<br>.list
      </a>
    </div>

    <details class="mb-4" id="categories" bind:this={categoryDetails} open={isCategoryOpen}>
      <summary class="cursor-pointer font-medium py-2">By category</summary>
      {#if $loading && !$dataLoaded && $categories.length === 0}
        <div class="pl-4 mt-2 text-sm text-gray-500">Loading categories...</div>
      {:else}
        <ul class="pl-4 mt-2 space-y-2 bg-white rounded p-2">
          {#each $categories as category}
            <li>
              <a 
                href="/category/{category}" 
                aria-label="{category}" 
                class:font-bold={isActiveCategory(category)}
                class:opacity-50={$activeCategory && !isActiveCategory(category)}
              >
                {category}
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </details>

    <details class="mb-4" bind:this={serviceDetails} open={isServiceOpen}>
      <summary class="cursor-pointer font-medium py-2">By service</summary>
      {#if $loading && !$dataLoaded && $services.length === 0}
        <div class="pl-4 mt-2 text-sm text-gray-500">Loading services...</div>
      {:else}
        <ul class="pl-4 mt-2 space-y-2 bg-white rounded p-2">
          {#each $services as service}
            <li>
              <a 
                href="/service/{service}" 
                aria-label="{service}" 
                class:font-bold={isActiveService(service)}
                class:opacity-50={$activeService && !isActiveService(service)}
              >
                {service}
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </details>

    <div class="flex flex-col">
      <a href="/apply" id="apply" class="py-2 font-medium">Apply</a>
      <a href="/promote" id="promote" class="py-2 font-medium">Publish your projects</a>
      <a href="/search" id="search" class="py-2 font-medium">Search</a>
    </div>
  </nav>

  <div class="mt-6 border-t pt-4">
    <h1 class="text-lg font-medium">List of design professionals from Nigeria</h1>
    <p class="mt-2 text-sm text-gray-600">
      234designers.list collects 474 freelancers, studios, and junior designers  
      registered based on the professional categories and the services offered. order by name.
    </p>
    <p class="mt-4 text-sm">
      <a href="mailto:contact@torinodesign.info">contact@torinodesign.info</a> — 
      <a href="https://www.instagram.com/torinodesign.info/" target="_blank" rel="noopener">Instagram</a>
    </p>
  </div>
</sidebar>

<style>
  /* Add styles to match the design */
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  a:hover {
    text-decoration: underline;
  }

  summary {
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '+';
    float: right;
  }

  details[open] summary::after {
    content: '-';
  }
  
  /* Prevent details from auto-closing on click */
  details summary:focus {
    outline: none;
  }
</style>