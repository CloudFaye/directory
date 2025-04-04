<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import DesignersList from '$lib/components/DesignersList.svelte';
  import { activeCategory, filteredDesigners, loadAllDesigners, setCategory } from '$lib/stores/designers';

  // Get category from URL parameter
  const categoryParam = $page.params.category;
  
  // Load designers and apply filter when page loads
  $effect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
      loadAllDesigners();
    }
  });
</script>

<div class="md:ml-[280px]">
  <div class="container mx-auto p-4">
    <Sidebar />
    <DesignersList />
  </div>
</div>

<style>
  /* Add any page-specific styles here */
</style> 