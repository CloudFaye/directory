import type { APIData } from '$lib/server/types';
const API_URL = 'https://two34-designers-backend.onrender.com';

interface APIResponse {
	pages: APIData[];
}

/**
 * Fetch designer list from render backend API
 */
export async function fetchDesigners(): Promise<APIResponse> {
	try {
		const response = await fetch(`${API_URL}/api/creatives`, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`API error: ${response.status}: ${error}`);
		}

		const data = await response.json();

		if (!data || !Array.isArray(data.pages)) {
			throw new Error('Invalid API response');
		}
		return data;
	} catch (error) {
		console.error('Error fetching from backend API:', error);
		throw error;
	}
}
