import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import puppeteer from 'puppeteer';

/**
 * POST handler to generate a screenshot using Puppeteer
 * This should be called from a background job/worker in production
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { url, filename } = await request.json();
    
    if (!url || !filename) {
      return json({ success: false, error: 'URL and filename are required' }, { status: 400 });
    }
    
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set viewport size (Macbook-like dimensions)
      await page.setViewport({
        width: 1300,
        height: 800,
        deviceScaleFactor: 2
      });
      
      // Navigate to the URL with timeout
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Take screenshot
      const screenshot = await page.screenshot({ 
        type: 'png',
        fullPage: false
      });
      
      // Upload to Vercel Blob
      const blob = await put(filename, new Blob([screenshot]), {
        access: 'public'
      });
      
      return json({
        success: true,
        screenshotUrl: blob.url
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating screenshot:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 