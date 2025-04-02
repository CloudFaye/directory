import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { put, list, del } from '@vercel/blob';

/**
 * GET handler to retrieve available screenshots
 */
export const GET: RequestHandler = async () => {
  try {
    // List all stored screenshots
    const { blobs } = await list();
    
    return json({
      success: true,
      screenshots: blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to fetch screenshots' }, { status: 500 });
  }
};

/**
 * POST handler to request a new screenshot
 */
export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    const { url, filename } = await request.json();
    
    // Check if this screenshot already exists
    const { blobs } = await list({
      prefix: `screenshots/${filename}`
    });
    
    if (blobs && blobs.length > 0) {
      // Return existing screenshot URL
      return json({
        success: true,
        screenshotUrl: blobs[0].url
      });
    }
    
    // Call the worker endpoint
    const workerResponse = await fetch('/api/screenshots/worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, filename })
    });
    
    const workerData = await workerResponse.json();
    
    return json(workerData);
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

/**
 * Queue function placeholder - in production this would:
 * 1. Connect to a serverless function or worker
 * 2. Generate screenshot using Puppeteer
 * 3. Upload to Vercel Blob
 * 4. Update status in database
 */
async function queueScreenshotGeneration(url: string, filename: string, token: string) {
  // In a real implementation, this would trigger a background job
  
  // This would be done in a separate worker/serverless function
  // uploadScreenshot(url, filename, token);
} 