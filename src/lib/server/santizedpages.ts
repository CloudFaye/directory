import { getNotionPages } from './query';
import type { APIData } from './types';

export let sanitizedPages: APIData[] = [];

async function initialize() {
	try {
		console.log('Starting initialization...');
		const response = await getNotionPages();

		if (!response.pages || !Array.isArray(response.pages)) {
			throw new Error('Invalid pages data');
		}

		sanitizedPages = response.pages;
		console.log('Successfully loaded pages:', sanitizedPages.length);
		return sanitizedPages;
	} catch (error) {
		console.error('Initialization failed:', error);
		throw error;
	}
}

export const initPromise = initialize();
