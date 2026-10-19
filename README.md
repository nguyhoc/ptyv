# Birthday Memory Website

## Run locally

Requires Node.js 18 or newer.

```sh
npm ci
npm start
```

Open http://localhost:3000. The main page is `/`, the other birthday page is
`/birthday`, and `/api/health` is the health-check endpoint.

## Deploy to Render

This repository includes a `render.yaml` Blueprint for a Node web service.

1. Push this repository to GitHub.
2. In Render, create a new **Blueprint** and select the GitHub repository.
3. Review the service settings from `render.yaml` and deploy.

Render installs the locked dependencies with `npm ci`, starts the app with
`npm start`, and checks `/api/health`. No environment variables are required;
the server uses Render's `PORT` automatically.

## Push to GitHub

From the repository directory:

```sh
git add .
git commit -m "Set up app for Render deployment"
git push origin main
```

Review the photos, video, music, and personalized message in `public/` and
`src/data/content.json` before making the GitHub repository public. These files
are included in the repository and served by the deployed website.
