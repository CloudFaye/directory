<script>
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import '../app.css';
	import { navigating } from '$app/stores';
	
	let { children } = $props();
	
	// Configure Speed Insights with options to play nicely with SvelteKit
	injectSpeedInsights({
		debug: false, // Disable debug mode in production
	});
</script>

<main class="p-8 ">
	{@render children()}
	
</main>




