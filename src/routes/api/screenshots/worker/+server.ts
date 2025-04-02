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
    
    if (!url) {
      return json({ success: false, error: 'URL is required' }, { status: 400 });
    }
    
    // Launch puppeteer
    const browser = await puppeteer.launch({ headless: true });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set the viewport
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1
    });
    
    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Take a screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    });
    
    // Upload to Vercel Blob
    const blob = await put(`screenshots/${filename}`, new Blob([screenshot]), {
      contentType: 'image/png',
      access: 'public'
    });
    
    // Close the browser
    await browser.close();
    
    return json({
      success: true,
      screenshotUrl: blob.url
    });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 