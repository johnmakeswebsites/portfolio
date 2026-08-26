# portfolio

Personal site. Static HTML, no build step — what is in the repo is what ships,
minus the masters (see below).

## Layout

```
index.html            home page (styles are inline; the portrait is a data URI)
projects/*.html       one page per project, sharing assets/css/project.css
assets/               everything the site actually loads
  css/project.css     styles for the project pages
  img/logos/          client marks, full colour, trimmed to their bounding box
  img/work/           photography and mockups
source/               full-resolution masters — versioned, never linked
sitemap.xml           list the project pages here when one is added
.github/workflows/pages.yml   deploys `main` to GitHub Pages on push
```

## Asset conventions

- Web assets live under `assets/`, named in kebab-case after the project they
  belong to (`assets/img/logos/john-makes-songs.png`), so a file's owner is
  readable from its path.
- Everything under `assets/` is referenced by a page. Nothing is kept there
  "just in case" — retired art is deleted, and the master stays in `source/`.
- `source/` is the archive of originals: untrimmed logos, mockup exports, the
  portrait. The deploy workflow strips it from the published artifact, so it
  costs nothing to keep but is not served.
- Cutting a new web asset from a master: trim to the bounding box, cap the long
  edge around 1600px, save optimised into the matching `assets/img/` folder.

Previous iteration is preserved on the `archive/v1-2026-08-24` branch.
