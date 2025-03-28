<script lang="ts">
	const { name, category, services } = $props();
</script>

<div class="flex text-nowrap px-0.5 fit flex-col gap-1">
	<h1 class="font-bold name">{name}</h1>
	<p class="text-[12px] uppercase text-neutral-600 category">{category}</p>
	<div class="flex flex-wrap gap-1">
		{#each services as service}
			<span class="text-[14px] service">
				{service}
			</span>
		{/each}
	</div>
</div>

<style>
	.category {
		text-transform: uppercase;
		font-size: 0.75rem;
	}

	.name {
		font-size: 1.25rem;
		font-weight: 700;
	}
	.service {
		font-size: 0.875rem;

		text-transform: uppercase;

		border-radius: 0.375rem;
	}
</style>
