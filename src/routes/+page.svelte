<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchDesigners, networkStatus } from '$lib/api';
  import { registerServiceWorker } from '$lib/serviceWorker';

  interface Designer {
    name: string;
    category: string;
    services?: string[];
    portfolio?: string;
  }
  
  let designers = $state<Designer[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let dataSource = $state<string | null>(null);
  let lastUpdated = $state<string | null>(null);

  async function loadDesigners() {
    loading = true;
    error = null;
    
    const result = await fetchDesigners();
    
    designers = result.data;
    error = result.error;
    dataSource = result.source;
    lastUpdated = result.timestamp ? new Date(result.timestamp).toLocaleString() : null;
    loading = false;
  }

  onMount(() => {
    registerServiceWorker();
    loadDesigners();
  });
</script>

<div class="container mx-auto p-4">
  <header class="mb-6">
    <h1 class="text-3xl font-bold">Designers Directory</h1>
    
    <div class="flex items-center mt-2 text-sm">
      <span class="mr-2">Status:</span>
      {#if $networkStatus.online}
        <span class="text-green-600 flex items-center">
          <span class="h-2 w-2 bg-green-600 rounded-full mr-1"></span>
          Online
        </span>
      {:else}
        <span class="text-amber-600 flex items-center">
          <span class="h-2 w-2 bg-amber-600 rounded-full mr-1"></span>
          Offline
        </span>
      {/if}
      
      {#if dataSource === 'cache' && lastUpdated}
        <span class="ml-4 text-gray-500">Using cached data from {lastUpdated}</span>
      {/if}
    </div>
  </header>
  
  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Error: {error}</p>
      <button 
        class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        on:click={loadDesigners}>Try Again</button>
    </div>
  {:else if designers.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-600">No designers found</p>
      <button 
        class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        on:click={loadDesigners}>Refresh</button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each designers as designer}
        <div class="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold">{designer.name}</h2>
          <p class="text-gray-600">{designer.category}</p>
          
          {#if designer.services && designer.services.length}
            <div class="mt-2">
              <p class="font-medium">Services:</p>
              <div class="flex flex-wrap gap-1 mt-1">
                {#each designer.services as service}
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service}</span>
                {/each}
              </div>
            </div>
          {/if}
          
          {#if designer.portfolio}
            <a 
              href={designer.portfolio} 
              target="_blank" 
              rel="noopener noreferrer"
              class="mt-3 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
              View Portfolio
            </a>
          {/if}
        </div>
      {/each}
    </div>
    
    <div class="mt-8 flex justify-center">
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        on:click={loadDesigners}>Refresh Data</button>
    </div>
  {/if}
</div>
