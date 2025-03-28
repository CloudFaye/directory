// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare namespace NodeJS {
	interface ProcessEnv {
		NOTION_API_KEY: string;
		NOTION_DATABASE_ID: string;
	}
}

export {};
