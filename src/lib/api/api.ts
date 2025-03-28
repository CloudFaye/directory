import type { APIData } from '$lib/server/types';
import { json } from '@sveltejs/kit';

const API_URL = import.meta.env.DEV
	? 'http://localhost:3000'
	: 'https://two34-designers-backend.onrender.com';

interface APIResponse {
	pages: APIData[];
}

export async function fetchDesigners(): Promise<APIResponse> {
	try {
		const response = await fetch(`${API_URL}/api/creatives`, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();
		console.log('API Response:', data);

		if (!data || !Array.isArray(data.pages)) {
			throw new Error('Invalid API response format');
		}

		return data;
	} catch (error) {
		console.error('Error fetching designers:', error);
		throw error;
	}
}

export async function GET() {
	const data = await fetchDesigners();

	// Remove any sensitive information before sending
	const sanitizedData = data.pages.map((page) => ({
		name: page.name,
		category: page.category,
		services: page.services,
		portfolio: page.portfolio.startsWith('https://') ? page.portfolio : null
	}));

	return json(
		{ pages: sanitizedData },
		{
			headers: {
				'Cache-Control': 'max-age=0, s-maxage=3600',
				'X-Frame-Options': 'DENY'
			}
		}
	);
}
