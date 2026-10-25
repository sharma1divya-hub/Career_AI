# CareerAI — AI Career Strategy Planner

CareerAI reads a resume and builds a personal career strategy: it extracts skills, flags gaps, ranks role matches, compares careers, runs what-if scenarios and creates a 16-task action plan and a downloadable career report.

**Live demo:** https://sharma1divya-hub.github.io/Carrer-AI

Built by Divya Sharma (B25M030254) — MBA, Ajeenkya DY Patil University — for the Student AI Project Showcase (Strategic Management).

## Features
- Resume upload (PDF, Word .docx, .txt) or paste text — processed entirely in the browser
- Career dashboard with readiness score and plan progress
- Resume analysis: skills by area and a resume-strength check
- 12 career roles ranked by weighted skill match, with indicative Indian salary ranges
- Strategy builder, side-by-side career comparison and what-if skill scenarios
- 16-task, 16-week action plan with saved progress
- AI career report you can download or save as PDF

## Tech
Plain HTML, CSS and JavaScript — no build step, no server, no API key. PDF and Word files are read with pdf.js and mammoth.js from cdnjs.

## Project structure
```
index.html        App shell and sidebar
css/style.css     Styles (responsive, print-friendly)
js/data.js        Skills dictionary, roles, learning suggestions
js/engine.js      Resume parsing, role scoring, what-if and plan logic
js/app.js         Views and interactions
.nojekyll         Tells GitHub Pages to serve files as-is
```

## Deploy on GitHub Pages
1. Open the repository `Carrer-AI` on GitHub (or create it, Public).
2. **Add file → Upload files**, drag in everything from this folder (keep the `css` and `js` folders), then **Commit changes**.
3. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)` → **Save**.
4. After 1–2 minutes the app is live at `https://<username>.github.io/Carrer-AI`.
