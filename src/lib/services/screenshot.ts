/**
 * Screenshot service to manage portfolio screenshots
 */

interface ScreenshotQueueItem {
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  token?: string;
  screenshotUrl?: string;
  retries: number;
  filename: string;
  callback?: (screenshotUrl: string) => void;
}

interface ScreenshotResponse {
  success: boolean;
  message?: string;
  screenshotUrl?: string;
  token?: string;
  error?: string;
}

// Cache for screenshot URLs
const screenshotCache = new Map<string, string>();

// Queue for pending screenshots
const screenshotQueue: ScreenshotQueueItem[] = [];

// Maximum parallel requests
const MAX_PARALLEL_REQUESTS = 3;

// Maximum retries
const MAX_RETRIES = 2;

// Flag to track if processing is in progress
let isProcessing = false;

/**
 * Encode a string to base64
 */
function safeEncode(str: string): string {
  // Use Buffer in Node.js environment, btoa in browser
  return typeof window !== 'undefined' 
    ? window.btoa(str) 
    : Buffer.from(str).toString('base64');
}

/**
 * Request a screenshot for a URL
 * @param url The URL to take a screenshot of
 * @returns Promise that resolves to the screenshot URL
 */
export async function getScreenshot(url: string): Promise<string | null> {
  try {
    // Check cache first
    if (screenshotCache.has(url)) {
      return screenshotCache.get(url) || null;
    }
    
    // Add to queue if not already in queue
    if (!screenshotQueue.some(item => item.url === url)) {
      screenshotQueue.push({
        url,
        status: 'pending',
        retries: 0,
        filename: ''
      });
      
      // Start processing queue if not already processing
      processNextScreenshot();
    }
    
    // Return null initially, UI will show placeholder
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Process the screenshot queue
 */
async function processNextScreenshot() {
  if (screenshotQueue.length === 0 || isProcessing) {
    return;
  }
  
  isProcessing = true;
  const nextItem = screenshotQueue.shift();
  
  if (!nextItem) {
    isProcessing = false;
    return;
  }
  
  try {
    // Encode URL for filename
    const encodedUrl = safeEncode(nextItem.url).replace(/\//g, '_').replace(/\+/g, '-');
    const filename = `${encodedUrl}.png`;
    
    // Request screenshot directly from worker
    const response = await fetch('/api/screenshots/worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: nextItem.url,
        filename: filename
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    
    // Screenshot should be available immediately from worker
    if (data.screenshotUrl) {
      nextItem.status = 'completed';
      nextItem.screenshotUrl = data.screenshotUrl;
      screenshotCache.set(nextItem.url, data.screenshotUrl);
      if (nextItem.callback) {
        nextItem.callback(data.screenshotUrl);
      }
    } else {
      throw new Error('No screenshot URL received from worker');
    }
  } catch (error) {
    nextItem.status = 'failed';
    
    // Retry if under max retries
    if (nextItem.retries < MAX_RETRIES) {
      nextItem.retries++;
      nextItem.status = 'pending';
      setTimeout(processNextScreenshot, 1000 * nextItem.retries); // Exponential backoff
    }
  } finally {
    isProcessing = false;
    
    // Process next item
    if (screenshotQueue.length > 0) {
      setTimeout(processNextScreenshot, 500);
    }
  }
}

/**
 * Simulate polling for completion
 * In a real implementation, this would poll an API endpoint
 */
async function simulatePollForCompletion(item: ScreenshotQueueItem): Promise<void> {
  // This is a simplified version for demonstration
  // In production, you would poll a status endpoint
  
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate a completed screenshot
      const mockScreenshotUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(item.url)}`;
      
      item.status = 'completed';
      item.screenshotUrl = mockScreenshotUrl;
      screenshotCache.set(item.url, mockScreenshotUrl);
      
      resolve();
    }, 2000);
  });
}

/**
 * Clear the screenshot cache for testing
 */
export function clearScreenshotCache() {
  screenshotCache.clear();
} 