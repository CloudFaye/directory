import type { PageServerLoad } from '../routes/$types';
import { fetchDesigners } from '$lib/api/api';
import type { PublicPageData } from '$lib/server/types';

export const publicLoad = (async () => {
	const data = await fetchDesigners();

	// Create a sanitized version of the data
	const publicData = data.pages;

	return {
		publicData,
		metaData: {
			totalPages: data.pages.length,
			categories: [...new Set(data.pages.map((p) => p.category))],
			services: [...new Set(data.pages.flatMap((p) => p.services))]
		}
	};
}) satisfies PageServerLoad;
