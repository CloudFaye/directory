import { fetchDesigners } from '../api/api';
import type { APIData } from './types';

export async function getNotionPages() {
	try {
		console.log('Fetching designers...');
		const data = await fetchDesigners();

		const processedPages = data.pages.map(
			(page): APIData => ({
				name: page.name || 'untitled',
				portfolio: page.portfolio || '',
				category: page.category || 'Uncategorized',
				services: page.services || []
			})
		);

		console.log(`Processed ${processedPages.length} pages`);

		return {
			pages: processedPages
		};
	} catch (error) {
		console.error('Error in getNotionPages:', error);
		throw error;
	}
}
