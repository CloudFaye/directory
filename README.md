# 234Creatives

A directory of Nigerian creative professionals built with SvelteKit and Notion.

## Features

- 🚀 Built with SvelteKit and Svelte 5 runes
- 📊 Notion database integration for content management
- 🔍 Search and filter by category
- 📱 Responsive design
- 🔄 Load more pagination

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/234creatives.git
   cd 234creatives
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your Notion API key and database ID

4. Set up your Notion database:
   - Create a new Notion database with the following properties:
     - Name (title)
     - Bio (rich text)
     - Portfolio (url)
     - Category (select)
   - Create a Notion integration at https://www.notion.so/my-integrations
   - Share your database with the integration

5. Start the development server:
   ```bash
   bun run dev
   ```

## Deployment

This project is set up to deploy to Netlify. Just connect your repository and make sure to set the environment variables in the Netlify dashboard.

## Technology Stack

- SvelteKit
- Svelte 5 with runes for state management
- TypeScript
- Tailwind CSS
- Notion API

## License

MIT
