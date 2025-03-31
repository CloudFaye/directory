/**
 * Screenshot service to manage portfolio screenshots
 */

interface ScreenshotQueueItem {
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  token?: string;
  screenshotUrl?: string;
  retries: number;
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
        retries: 0
      });
      
      // Start processing queue if not already processing
      processQueue();
    }
    
    // Return null initially, UI will show placeholder
    return null;
  } catch (error) {
    console.error('Error requesting screenshot:', error);
    return null;
  }
}

/**
 * Process the screenshot queue
 */
async function processQueue() {
  // Count active requests
  const activeRequests = screenshotQueue.filter(
    item => item.status === 'processing'
  ).length;
  
  // If already at max parallel requests, do nothing
  if (activeRequests >= MAX_PARALLEL_REQUESTS) {
    return;
  }
  
  // Get next pending item
  const nextItem = screenshotQueue.find(item => item.status === 'pending');
  
  if (!nextItem) {
    return; // No pending items
  }
  
  // Mark as processing
  nextItem.status = 'processing';
  
  try {
    // Request screenshot
    const response = await fetch('/api/screenshots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: nextItem.url })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data: ScreenshotResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    
    // If screenshot already exists
    if (data.screenshotUrl) {
      nextItem.status = 'completed';
      nextItem.screenshotUrl = data.screenshotUrl;
      screenshotCache.set(nextItem.url, data.screenshotUrl);
    } 
    // If screenshot generation queued
    else if (data.token) {
      nextItem.token = data.token;
      // In a real implementation, you would poll for completion
      // For now, we'll just mark as completed after a delay
      await simulatePollForCompletion(nextItem);
    }
  } catch (error) {
    console.error(`Error processing screenshot for ${nextItem.url}:`, error);
    nextItem.status = 'failed';
    
    // Retry if under max retries
    if (nextItem.retries < MAX_RETRIES) {
      nextItem.retries++;
      nextItem.status = 'pending';
      setTimeout(processQueue, 1000 * nextItem.retries); // Exponential backoff
    }
  }
  
  // Continue processing queue
  processQueue();
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