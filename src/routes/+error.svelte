<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
    <h1 class="text-6xl font-bold text-gray-900">{$page.status}</h1>
    <p class="mt-4 text-xl text-gray-600">{$page.error?.message || 'Page not found'}</p>
    
    <a href="/" class="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Go back home
    </a>
</div> 