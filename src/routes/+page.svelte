<script lang="ts">
	import type { PageData } from './$types';
	import type { PublicPageData, APIData } from '$lib/server/types';
	import Creative from '$lib/components/Creative.svelte';
	

	const { data } = $props<{ data: PageData }>();
	let hoveredIndex = $state(-1);
	let designers = $derived(data.publicData);

</script>


<div class="w-full mt-10 min-h-screen grid grid-cols-3 relative">
	<div class="col-span-2 h-screen overflow-y-auto overflow-x-hidden">
		<div class="masonry-container p-4 creative" class:has-hovered-item={hoveredIndex !== -1}>
			{#each designers as designer, i}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="masonry-item transform transition-all duration-300"
					onmouseenter={() => (hoveredIndex = i)}
					onmouseleave={() => (hoveredIndex = -1)}
					class:is-hovered={hoveredIndex === i}
				>
					<Creative name={designer.name} category={designer.category} services={designer.services} />
				</div>
			{/each}
		</div>
	</div>
	
	<div class="col-span-1">
		<div class="sticky top-0 p-4">
			<h2 class="text-xl font-bold mb-4">Filters</h2>
			<p>Total Creatives: {designers.length}</p>
			<!-- Add filter components here if needed -->
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
		break-inside: avoid;
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
