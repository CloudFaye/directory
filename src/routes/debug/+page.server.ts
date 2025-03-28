import type { PageServerLoad } from '../$types';
import { fetchDesigners } from '$lib/api/api';
import type { PublicPageData } from '$lib/server/types';

export const load = (async () => {
	const data = await fetchDesigners();

	// Create a sanitized version of the data
	const publicData: PublicPageData = {
		name: data.pages[0].name,
		totalPages: data.pages.length,
		categories: [...new Set(data.pages.map((p) => p.category))],
		services: [...new Set(data.pages.flatMap((p) => p.services))]
	};

	return {
		publicData
	};
}) satisfies PageServerLoad;
