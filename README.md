# Digital Mirror

Digital Mirror is a live, generative portrait that turns motion, light and the brief gestures
of a viewer into flowing, squiggly lines — a fragile mirror where the body becomes a
topography of noise and light. The piece is built with p5.js and runs entirely in the
browser using a webcam feed; no server component is required.

## Artist statement

Digital Mirror explores the space between representation and suggestion. Rather than
rendering a faithful likeness, the work fragments the sitter into rhythm and texture.
Lines become memory: they accumulate, jitter and breathe in response to movement,
ambient light and the viewer's proximity. The resulting image is both intimate and
anonymous — familiar gestures recomposed into an abstracted presence.

The work invites slow attention. In exhibition, it asks viewers to stand, move, and
watch their own outline dissolve into a field of lines. The piece values small
imperfections: noise, latency and the grain of the camera become collaborators,
not bugs.

## Files
- `art.js` — main p5.js sketch (webcam capture, drawing, UI controls).
- `style.css` — visual styling for the canvas, controllers, and CTA.
- `index.html` — entry point that loads p5.js and the sketch.

## Controls & Usage
1. Open `index.html` in a modern browser (Chrome, Edge or Firefox).
2. Allow webcam access when prompted.
3. Top-right controllers let you adjust:
    - Line Density — spacing between horizontal lines (lower = denser);
    - Organic Distortion — noise amplitude applied to lines;
    - Stroke Weight — thickness of drawn lines;
    - Color presets and custom stroke/background pickers.
4. Click the top-right minimize control to collapse the UI to a single CTA pill.

## Hosting / GitHub
- To publish: create a GitHub repository, add it as `origin`, then `git push -u origin main`.
- I can add a GitHub Actions workflow to auto-deploy to GitHub Pages if you'd like.

## Privacy
- This app uses the webcam stream locally in the browser. No image/video data is
   uploaded or stored by the app; do not commit saved captures or large media files.

## Credits
- Artist: Tejj
- Built with p5.js

---

If you'd like, I can also produce a short exhibition README for a hanging label (50–80 words) or add an automated deployment workflow to the repo.
