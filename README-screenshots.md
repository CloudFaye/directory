# Portfolio Screenshot System

This system automatically captures and stores screenshots of designer portfolio websites using Puppeteer and Vercel Blob Storage.

## Overview

The screenshot system includes:

1. **Client-side Screenshot Service**: Manages requesting, caching, and displaying screenshots
2. **Server-side API Endpoints**: Handle screenshot generation and storage
3. **Vercel Blob Storage**: Stores screenshots for efficient retrieval

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and add your Vercel Blob token:

```bash
cp .env.example .env
```

Then edit the `.env` file to add:
- `VERCEL_BLOB_READ_WRITE_TOKEN`: Your Vercel Blob Storage token

### 3. Deploy to Vercel

The system is designed to work with Vercel's serverless functions and Blob Storage.

```bash
vercel deploy
```

## How It Works

1. **On Initial Load**: The system scans all designer portfolio URLs and queues them for screenshot generation
2. **Screenshot Generation**: Puppeteer captures 1300px wide screenshots of each URL
3. **Storage**: Screenshots are stored in Vercel Blob Storage with URL-based filenames
4. **Display**: When a user hovers on a designer, their screenshot is displayed from the Blob Storage

The system includes:
- Caching to avoid re-taking screenshots
- Error handling with retries
- Efficient queuing to limit concurrent requests

## Configuration Options

The screenshot behavior can be adjusted in `src/lib/services/screenshot.ts`:

- `MAX_PARALLEL_REQUESTS`: Number of concurrent screenshot requests (default: 3)
- `MAX_RETRIES`: Number of times to retry failed screenshots (default: 2)

## Fallback Behavior

If a screenshot is not yet available in Blob Storage, the system falls back to using thum.io as a temporary placeholder.

## Development Notes

For local development, the system simulates the screenshot storage process. In production, screenshots are processed by serverless functions and stored in Vercel Blob Storage. 