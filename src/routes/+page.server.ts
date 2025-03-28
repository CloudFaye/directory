import type { PageServerLoad } from './$types';
import { fetchDesigners } from '$lib/api/api';

export async function load() {
	const data = await fetchDesigners();
	return {
		pages: data.pages
	};
}
