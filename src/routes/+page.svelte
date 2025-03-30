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
    <div class="text-red-700 py-2">
      <p>Error: {error}</p>
      <button class="text-blue-500 underline" on:click={loadDesigners}>Try Again</button>
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
