# MagicBook Job Worker

Background job worker for handling long-running image generation tasks.

## Setup

1. Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

## Deployment (Contabo/VPS)

### Using Docker

1. Build and run with Docker Compose:

```bash
docker-compose up -d
```

2. View logs:

```bash
docker-compose logs -f
```

3. Stop:

```bash
docker-compose down
```

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Start with PM2 (recommended):

```bash
npm install -g pm2
pm2 start dist/index.js --name magicbook-worker
pm2 save
pm2 startup
```

## API Endpoints

### Health Check
```
GET /health
```

### Generate Character Reference
```
POST /jobs/character-reference
Authorization: Bearer YOUR_SECRET

{
  "bookId": "book-123",
  "childPhotoUrl": "https://...",
  "childName": "Ali",
  "childGender": "boy",
  "callbackUrl": "https://your-app.vercel.app/api/worker/callback"
}
```

### Generate Single Illustration
```
POST /jobs/illustration
Authorization: Bearer YOUR_SECRET

{
  "bookId": "book-123",
  "pageNumber": 1,
  "sceneDescription": "Ali in a magical forest...",
  "storyText": "Once upon a time...",
  "childPhotoUrl": "https://...",
  "childName": "Ali",
  "childGender": "boy",
  "characterReferenceUrl": "https://...",
  "pageType": "story-character",
  "callbackUrl": "https://your-app.vercel.app/api/worker/callback"
}
```

### Generate Full Book (Batch)
```
POST /jobs/batch
Authorization: Bearer YOUR_SECRET

{
  "bookId": "book-123",
  "childPhotoUrl": "https://...",
  "childName": "Ali",
  "childGender": "boy",
  "style": "ANIMATION_3D",
  "pages": [
    {
      "pageNumber": 0,
      "sceneDescription": "Cover scene...",
      "storyText": "Ali's Adventure",
      "pageType": "cover"
    },
    {
      "pageNumber": 1,
      "sceneDescription": "Scene 1...",
      "storyText": "Story text...",
      "pageType": "story-character"
    }
  ],
  "callbackUrl": "https://your-app.vercel.app/api/worker/callback"
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `NODE_ENV` | Environment (development/production) |
| `JOB_WORKER_SECRET` | API authentication secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | R2 public URL |
| `MAIN_APP_URL` | Main app URL (Vercel) |
| `MAIN_APP_SECRET` | Secret for callbacks to main app |
# job-worker.magicbook.uz
