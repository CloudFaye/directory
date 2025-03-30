// Register service worker for PWA functionality
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Use relative path for compatibility with SvelteKit's base path config
      const registration = await navigator.serviceWorker.register('./service-worker.js');
      console.log('Service worker registered:', registration);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
} 