declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		VERCEL_BLOB_READ_WRITE_TOKEN: string;
	}
}

export {};
