<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import DesignersList from '$lib/components/DesignersList.svelte';
  import { activeService, filteredDesigners, loadAllDesigners, setService } from '$lib/stores/designers';

  // Get service from URL parameter
  const serviceParam = $page.params.service;
  
  // Load designers and apply filter when page loads
  $effect(() => {
    if (serviceParam) {
      setService(serviceParam);
      loadAllDesigners();
    }
  });
</script>

<div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
  <Sidebar />
  
  <div class="col-span-full md:col-span-7 lg:col-span-9 md:ml-[280px]">
    <DesignersList />
  </div>
</div>

<style>
  /* Add any page-specific styles here */
</style> 