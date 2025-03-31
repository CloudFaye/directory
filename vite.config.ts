import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	server: {
		proxy: {
			'/api': {
				target: 'https://two34-designers-backend.onrender.com',
				changeOrigin: true,
				rewrite: (path) => path
			}
		}
	}
});
