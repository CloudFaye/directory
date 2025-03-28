<script lang="ts">
	import type { PageData } from './$types';
	const { data } = $props<{ data: PageData }>();
	const creatives = $derived(data.pages);
	let hoveredIndex = -1;
	import Creative from '$lib/components/Creative.svelte';
</script>

<div class="w-full fixed z-10 h-10 bg-neutral-200 p-2">filters component</div>
<div class="w-full mt-10 min-h-screen grid grid-cols-3 relative">
	<div class="col-span-2 h-screen overflow-y-auto overflow-x-hidden">
		<div class="masonry-container p-4 creative" class:has-hovered-item={hoveredIndex !== -1}>
			{#each creatives as creative, i}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="masonry-item transform transition-all duration-300"
					onmouseenter={() => (hoveredIndex = i)}
					onmouseleave={() => (hoveredIndex = -1)}
					class:is-hovered={hoveredIndex === i}
				>
					<Creative {...creative} />
				</div>
			{/each}
		</div>
	</div>

	<div class="image-container fixed right-16 top-20 w-1/3 h-[350px]">
		<div class="bg-gray-200 w-full h-full">
			<img class="w-full h-full rounded-lg object-cover" src="" alt="" />
		</div>
	</div>
</div>

<style>
	.masonry-container {
		column-count: 3;
		column-gap: 1rem;
		transition: opacity 0.3s ease;
	}

	.masonry-item {
		display: inline-block;
		width: 100%;
		margin-bottom: 1rem;
		cursor: pointer;
		transition: linear 100ms;
	}

	.has-hovered-item .masonry-item {
		opacity: 0.5;
	}

	.has-hovered-item .masonry-item.is-hovered {
		opacity: 1;
		transform: scale(1.02);
	}

	.creative > * {
		visibility: visible;
	}

	.creative:hover > * {
		opacity: 0.6;
	}

	.creative > *:hover {
		opacity: 1;
	}

	@media (max-width: 1024px) {
		.masonry-container {
			column-count: 2;
		}
	}

	@media (max-width: 640px) {
		.masonry-container {
			column-count: 1;
		}
	}

	.overflow-y-auto {
		scroll-behavior: smooth;
	}
</style>
