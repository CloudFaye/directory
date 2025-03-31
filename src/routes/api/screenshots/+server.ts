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
    console.error('Error fetching screenshots:', error);
    return json({ success: false, error: 'Failed to fetch screenshots' }, { status: 500 });
  }
};

/**
 * POST handler to request a new screenshot
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { url, force = false } = await request.json();
    
    if (!url) {
      return json({ success: false, error: 'URL is required' }, { status: 400 });
    }
    
    // Encode URL for use as filename
    const encodedUrl = Buffer.from(url).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
    const filename = `${encodedUrl}.png`;
    
    // Check if screenshot already exists
    const { blobs } = await list({ prefix: filename });
    
    // If screenshot exists and no force update requested, return existing URL
    if (blobs.length > 0 && !force) {
      return json({ 
        success: true, 
        message: 'Screenshot already exists',
        screenshotUrl: blobs[0].url
      });
    }
    
    // Return a token for client to poll status
    const token = crypto.randomUUID();
    
    // Queue screenshot generation (this would connect to a worker in production)
    queueScreenshotGeneration(url, filename, token);
    
    return json({ 
      success: true, 
      message: 'Screenshot generation queued',
      token
    });
  } catch (error) {
    console.error('Error processing screenshot request:', error);
    return json({ success: false, error: 'Failed to process request' }, { status: 500 });
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
  console.log(`Screenshot generation queued for ${url} with token ${token}`);
  
  // This would be done in a separate worker/serverless function
  // uploadScreenshot(url, filename, token);
} 