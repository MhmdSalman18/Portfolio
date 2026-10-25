# Muhammed Salman — Android Developer Portfolio

Static HTML, CSS, and JavaScript portfolio with Android ecosystem artwork, scroll parallax, project case studies, experience, and skills.

## Preview

Serve the repository root with any static HTTP server, for example `python -m http.server 8080`, and open `http://localhost:8080`.

## Update content

- `content.js`: profile, email, GitHub, LinkedIn, and resume link.
- `projects.js`: project case studies.
- `index.html`: sections and project marketing artwork.
- `styles.css`, `experience.css`, `posters.css`, `theme.css`: layout, motion, posters, and theme.
- `images/RESUME.pdf`: current resume.

All asset paths are relative, supporting GitHub Pages under `/Portfolio/`. Original project images, `dp.png`, and the old `css/style.css` are retained. The prior page remains recoverable in Git history.

## Publishing

This redesign is prepared on a separate branch. Review it before merging into `main`. If GitHub Pages already publishes the root of `main`, merging updates the existing site. Otherwise enable Pages in repository Settings, selecting the intended branch and root folder.

Motion follows the system reduced-motion preference and can be toggled on the page. The contact action opens email; no form submissions or analytics are collected.
