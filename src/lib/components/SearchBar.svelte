<script lang="ts">
  import { pushState, replaceState } from '$app/navigation';
  import { searchTerm, setSearchTerm } from '$lib/stores/designers';
  import { page } from '$app/stores';
  
  let currentSearch = '';
  
  // Initialize search from URL if available
  $effect(() => {
    const searchQuery = $page.url.searchParams.get('q');
    if (searchQuery) {
      currentSearch = searchQuery;
    }
  });
  
  // Also keep search field in sync with store
  $effect(() => {
    if ($searchTerm && $searchTerm !== currentSearch) {
      currentSearch = $searchTerm;
    }
  });
  
  function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (currentSearch.trim()) {
      // Set the search term in our store
      setSearchTerm(currentSearch.trim());
      
      // Construct the URL with the search query
      const url = `/search?q=${encodeURIComponent(currentSearch.trim())}`;
      const currentUrl = $page.url.pathname + $page.url.search;
      
      // Only update URL if it's different (to avoid duplicate history entries)
      if (currentUrl !== url) {
        // Use pushState instead of replaceState to maintain browser history
        // If we're already on the search page, use replaceState to prevent extra history entries
        if ($page.url.pathname === '/search') {
          replaceState(url, {});
        } else {
          pushState(url, {});
        }
      }
    }
  }
</script>

<div class="w-full max-w-md mx-auto">
  <form on:submit={handleSubmit} class="relative">
    <div class="flex items-center border rounded-lg overflow-hidden shadow-sm">
      <input
        type="text"
        bind:value={currentSearch}
        placeholder="Search designers..."
        class="w-full px-4 py-2 focus:outline-none"
      />
      <button 
        type="submit" 
        class="bg-indigo-600 text-white px-4 py-2 h-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </form>
</div> 