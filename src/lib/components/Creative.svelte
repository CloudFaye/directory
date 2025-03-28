<script lang="ts">
	const { name, category, services } = $props();
</script>

<div class="flex text-nowrap px-0.5 fit flex-col gap-1">
	<h1 class="font-bold">{name}</h1>
	<p class="text-[12px] uppercase text-neutral-600">{category}</p>
	{#if services && services.length > 0}
		<div class="flex flex-wrap gap-1">
			{#each services as service}
				<span class="text-[14px]">
					[{service.name}]
				</span>
			{/each}
		</div>
	{/if}
</div>
