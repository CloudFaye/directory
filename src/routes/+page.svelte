<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import DesignersList from '$lib/components/DesignersList.svelte';
  import { loadAllDesigners, setCategory, setService, searchTerm, filteredDesigners } from '$lib/stores/designers';

  // Reset filters and load all designers on homepage
  $effect(() => {
    // Only reset if we're on the homepage
    if ($page.url.pathname === '/') {
      setCategory(null);
      setService(null);
      searchTerm.set('');
      loadAllDesigners();
    }
  });

  // The sidebar component will handle URL state synchronization and filter resetting
  // We just need to display the list of designers
</script>

<div class="container mx-auto p-4  gap-6">
  <Sidebar />
  
  <div class="col-span-full md:col-span-7 lg:col-span-9 md:ml-[280px]">
    <DesignersList />
  </div>
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
