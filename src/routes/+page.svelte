<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchDesigners } from '$lib/api';

  interface Designer {
    name: string;
    category: string;
    services?: string[];
  }
  
  let designers = $state<Designer[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  async function loadDesigners() {
    loading = true;
    error = null;
    
    const result = await fetchDesigners();
    
    designers = result.data;
    error = result.error;
    loading = false;
  }

  onMount(() => {
    loadDesigners();
  });
</script>

<div class="container mx-auto p-4">
  
  {#if loading}
    <div class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
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
    <p class="text-gray-600">No designers found</p>
  {:else}
    <ul class="space-y-4">
      {#each designers as designer}
        <li class="border-b pb-3">
          <h2 class="font-semibold">{designer.name}</h2>
          <p class="text-gray-600">{designer.category}</p>
          
          {#if designer.services && designer.services.length}
            <div class="mt-1 flex flex-wrap gap-1">
              {#each designer.services as service}
                <span class="text-xs px-2 py-0.5 bg-gray-100 rounded">{service}</span>
              {/each}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
