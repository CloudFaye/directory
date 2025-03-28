import type { PageServerLoad } from '../../routes/$types';
import { getNotionPages } from '$lib/server/query';

interface CreativePage {
	name: string;
	category: string;
	//services: string[];
	portfolio: string;
}

export let sanitizedPages: CreativePage[] = [];

// Create an initialization promise that we can await
export const initPromise = (async () => {
	try {
		const data = await getNotionPages();

		if (!data || !data.pages) {
			console.error('No pages found in Notion data');
			return;
		}

		sanitizedPages = data.pages.map((page) => ({
			name: page?.name,
			category: page?.category,
			services: page?.services || [],
			portfolio: page?.portfolio
		}));

		console.log('Pages loaded:', sanitizedPages.length);
	} catch (e) {
		console.error('Error loading pages:', e);
	}
})();
