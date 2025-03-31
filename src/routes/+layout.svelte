<script>
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import '../app.css';
	let { children } = $props();
	injectSpeedInsights();
</script>

<main class="p-8">
	{@render children()}
	
</main>




