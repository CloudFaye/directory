<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import DesignersList from '$lib/components/DesignersList.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import { loadAllDesigners, setSearchTerm, dataLoaded, searchTerm } from '$lib/stores/designers';

  // Flag to track if a search has been performed
  let searchPerformed = $state(false);
  
  // React to URL parameter changes and load data
  $effect(() => {
    // Check for URL search query
    const searchQuery = $page.url.searchParams.get('q');
    
    // Only update if search term has changed
    if (searchQuery !== null && searchQuery !== $searchTerm) {
      setSearchTerm(searchQuery);
      searchPerformed = true;
    }
    
    // Load data if not already loaded
    if (!$dataLoaded) {
      loadAllDesigners();
    }
  });
  
  // Also track searchTerm for showing results
  $effect(() => {
    if ($searchTerm) {
      searchPerformed = true;
    }
  });
</script>

<div class="md:ml-[280px]">
  <div class="container mx-auto p-4">
    <Sidebar />
    
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">Search Designers</h1>
      <SearchBar />
    </div>
    
    {#if searchPerformed}
      <DesignersList />
    {/if}
  </div>
</div>

<style>
  /* Add any page-specific styles here */
</style> 