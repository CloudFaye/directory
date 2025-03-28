import type { PageServerLoad } from './$types';
import { sanitizedPages, initPromise } from '$lib/server/santizedpages';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	try {
		// Wait for the initialization to complete
		await initPromise;

		if (sanitizedPages.length === 0) {
			throw error(500, 'No pages loaded after initialization');
		}

		return {
			pages: sanitizedPages
		};
	} catch (e) {
		console.error('Error in page load:', e);
		throw error(500, 'Failed to load creatives data');
	}
}) satisfies PageServerLoad;
