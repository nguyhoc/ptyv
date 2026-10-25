# Tulip Letter Garden

A Vietnamese birthday website featuring an interactive 3D tulip bouquet,
floating cat stickers, background music, and a personal birthday page. The
homepage uses `public/wed3/`; the previous homepage remains available at
`/wed2`, while `/birthday` continues to serve the birthday greeting page.

## Run locally

Requires Node.js 18 or newer. From the project folder, run these commands in
PowerShell or a terminal:

```powershell
npm ci
npm start
```

Open <http://localhost:3000>. On the homepage, drag the tulip bouquet to rotate
it or click it to open the birthday greeting with a soft page transition. The
`/api/health` endpoint can be used to confirm the server is up.

To restart automatically after server-side changes, run `npm run dev`.

## Customize

- Change the homepage in `public/wed3/index.html`.
- Adjust the interactive bouquet and homepage behavior in `public/wed3/script.js`.
- Update homepage colors and layout in `public/wed3/style.css`.
- The previous homepage is retained under `public/wed2/`.
- Replace the images, video, and music under `public/` with your own files.

## Deploy to Render

This repository includes a `render.yaml` Blueprint. Create a new Blueprint in
Render using this repository. Render installs dependencies with `npm ci`,
starts the site with `npm start`, and checks `/api/health`. The server uses
Render's `PORT` environment variable automatically.
