<script>
	import '../app.css';
	let { children } = $props();
</script>

<main class="p-8">
	{@render children()}
</main>
