<script lang="ts">
    import type { PageData } from './$types';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();
    
    const formData = $state({
        name: '',
        email: '',
        portfolio: '',
        creativeCategory: '',
        creativeServices: '',
        shortBio: ''
    });
    
    const formStatus = $state({
        submitting: false,
        success: false,
        error: false,
        message: ''
    });
    
    async function submitApplication() {
        formStatus.submitting = true;
        formStatus.success = false;
        formStatus.error = false;
        
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.type === 'success') {
                formStatus.success = true;
                formStatus.message = result.message;
                // Reset form
                formData.name = '';
                formData.email = '';
                formData.portfolio = '';
                formData.creativeCategory = '';
                formData.creativeServices = '';
                formData.shortBio = '';
            } else {
                formStatus.error = true;
                formStatus.message = result.message || 'Failed to submit application';
            }
        } catch (error) {
            formStatus.error = true;
            formStatus.message = 'An unexpected error occurred. Please try again.';
            console.error('Form submission error:', error);
        } finally {
            formStatus.submitting = false;
        }
    }
</script>

<div class="md:ml-[280px]">
  <div class="container mx-auto p-4">
    <Sidebar />
    
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">Apply to Join Our Designer Community</h1>
      
      {#if formStatus.success}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>{formStatus.message}</p>
        </div>
      {/if}
      
      {#if formStatus.error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{formStatus.message}</p>
        </div>
      {/if}
      
      <form 
        class="bg-white shadow-md rounded-lg p-6 max-w-3xl"
        on:submit|preventDefault={submitApplication}
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-1">
            <label for="name" class="block text-gray-700 font-medium mb-2">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your full name"
            />
          </div>
          
          <div class="col-span-1">
            <label for="email" class="block text-gray-700 font-medium mb-2">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your email address"
            />
          </div>
          
          <div class="col-span-1 md:col-span-2">
            <label for="portfolio" class="block text-gray-700 font-medium mb-2">
              Portfolio URL <span class="text-red-500">*</span>
            </label>
            <input
              id="portfolio"
              type="url"
              bind:value={formData.portfolio}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://yourportfolio.com"
            />
          </div>
          
          <div class="col-span-1">
            <label for="creativeCategory" class="block text-gray-700 font-medium mb-2">
              Creative Category <span class="text-red-500">*</span>
            </label>
            <select
              id="creativeCategory"
              bind:value={formData.creativeCategory}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled selected>Select your category</option>
              {#each data.creativeCategories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          
          <div class="col-span-1">
            <label for="creativeServices" class="block text-gray-700 font-medium mb-2">
              Creative Services <span class="text-red-500">*</span>
            </label>
            <input
              id="creativeServices"
              type="text"
              bind:value={formData.creativeServices}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Logo Design, Web Design, UI/UX, etc. (comma separated)"
            />
          </div>
          
          <div class="col-span-1 md:col-span-2">
            <label for="shortBio" class="block text-gray-700 font-medium mb-2">
              Short Bio (Optional)
            </label>
            <textarea
              id="shortBio"
              bind:value={formData.shortBio}
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us a bit about yourself and your design experience..."
            ></textarea>
          </div>
        </div>
        
        <div class="mt-6">
          <button
            type="submit"
            class="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={formStatus.submitting}
          >
            {formStatus.submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  /* Add any page-specific styles here */
</style>