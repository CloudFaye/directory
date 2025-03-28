import { fetchDesigners } from '../api/api';

export async function getNotionPages() {
	try {
		const data = await fetchDesigners();

		// Return data in the same format as before to maintain compatibility
		return {
			pages: data.pages.map((page) => ({
				name: page.name || 'untitled',
				portfolio: page.portfolio || '',
				category: page.category || 'Uncategorized',
				services: page.services || []
			}))
		};
	} catch (error) {
		console.error('Error in getNotionPages:', error);
		throw error;
	}
}
