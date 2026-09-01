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
  img/john-caviness.jpg   1200x630 share image, referenced by the home page og:image
source/               full-resolution masters — versioned, never linked
.github/workflows/pages.yml   deploys `main` to GitHub Pages on push
```

## Visibility

The site is unlisted: every page carries `<meta name="robots" content="noindex,
nofollow">`, and there is no `sitemap.xml`. `robots.txt` deliberately allows
crawling — a crawler must fetch a page to read its `noindex`, so disallowing
would suppress the tag and leave the URLs eligible for a bare listing. Adding a
page means adding the `noindex` tag to it. To launch publicly, drop the tags
from every page and restore a sitemap.

Note that unlisted is not private: the repo is public for GitHub Pages to serve
it for free, and anyone with a URL can read the site. Well-behaved crawlers
honour `noindex`; nothing forces the rest to.

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
