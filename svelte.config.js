import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html' 
    }),
    prerender: {
      entries: [] 
    }
  },
  preprocess: vitePreprocess()
};

export default config;
