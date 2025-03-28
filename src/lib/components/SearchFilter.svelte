<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    // Set up props using Svelte 5 runes
    const { initialSearch = '', categories = [] } = $props<{
        initialSearch?: string;
        categories: string[];
    }>();
    
    // Set up state
    let searchInput = $state(initialSearch);
    let selectedCategory = $state<string | null>(null);
    let debounceTimer = $state<NodeJS.Timeout | null>(null);
    
    // Set up event dispatcher
    const dispatch = createEventDispatcher<{
        search: { query: string, category: string | null };
    }>();
    
    // Watch for changes and debounce
    $effect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(() => {
            dispatch('search', { 
                query: searchInput, 
                category: selectedCategory 
            });
        }, 300);
        
        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
        };
    });
    
    // Handle category selection
    function handleCategorySelect(category: string | null) {
        if (selectedCategory === category) {
            selectedCategory = null;
        } else {
            selectedCategory = category;
        }
    }
</script>

<div class="search-filters bg-white p-4 rounded-lg shadow-sm mb-6">
    <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow relative">
            <input 
                type="text"
                bind:value={searchInput}
                placeholder="Search creatives..."
                class="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
                class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            
            {#if searchInput}
                <button 
                    class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    on:click={() => searchInput = ''}
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            {/if}
        </div>
    </div>
    
    {#if categories.length > 0}
        <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div class="flex flex-wrap gap-2">
                {#each categories as category}
                    <button 
                        class="px-3 py-1 rounded-full text-sm {selectedCategory === category 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}"
                        on:click={() => handleCategorySelect(category)}
                    >
                        {category}
                    </button>
                {/each}
                
                {#if selectedCategory}
                    <button 
                        class="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                        on:click={() => handleCategorySelect(null)}
                    >
                        Clear
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                {/if}
            </div>
        </div>
    {/if}
</div> 