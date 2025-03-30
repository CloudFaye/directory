import type { Handle } from '@sveltejs/kit';

// SvelteKit hook to add CORS headers for local API handling
export const handle: Handle = async ({ event, resolve }) => {
  // Process the response
  const response = await resolve(event);

  // Add CORS headers to all responses
  if (event.request.method === 'OPTIONS') {
    // Handle preflight requests
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Add CORS headers to regular responses
  response.headers.append('Access-Control-Allow-Origin', '*');
  
  return response;
}; 