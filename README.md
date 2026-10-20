# Tulip Letter Garden

A standalone Vietnamese mini-site featuring an interactive 3D tulip bouquet,
floating cat stickers, background music, and an editable personal letter. The
homepage is served from `public/wed2/`; this project has its own name, page, and
experience rather than reusing the older birthday-memory page.

## Run locally

Requires Node.js 18 or newer. From the project folder, run these commands in
PowerShell or a terminal:

```powershell
npm ci
npm start
```

Open <http://localhost:3000>. The `/birthday` path is an alias for the same
homepage. The `/api/health` endpoint can be used to confirm the server is up.

To restart automatically after server-side changes, run `npm run dev`.

## Customize

- Change the page title and letter layout in `public/wed2/index.html`.
- Adjust the interactive bouquet and letter text in `public/wed2/script.js`.
- Update colors and layout in `public/wed2/style.css`.
- Replace the images, video, and music under `public/` with your own files.

## Deploy to Render

This repository includes a `render.yaml` Blueprint. Create a new Blueprint in
Render using this repository. Render installs dependencies with `npm ci`,
starts the site with `npm start`, and checks `/api/health`. The server uses
Render's `PORT` environment variable automatically.
