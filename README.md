<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby Minimal TypeScript Starter
</h1>

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal TypeScript starter.

    ```shell
    # create a new Gatsby site using the minimal TypeScript starter
    npm init gatsby -- -ts
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

## 🚀 Quick start (Netlify)

Deploy this starter with one click on [Netlify](https://app.netlify.com/signup):

[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-minimal-ts)

## Development and security checks

Use Node.js 22 (`nvm install` once, then `nvm use`) and install with `npm ci`. Run `npm run typecheck`,
`npm test`, `npm audit`, and `npm run build` before publishing dependency updates.
The test suite uses a temporary server on `127.0.0.1` to check image downloads.

Gatsby is kept on version 5 with React 18. The dependency overrides select patched
versions of libraries that Gatsby or its plugins still pin to older releases.
Parcel's compiler, cache, and plugins must stay on the same release. Image
processing uses Sharp 0.35, while file detection uses file-type 21.

`npm ci` automatically applies the three patches in `patches/`. They adapt
Gatsby's buffer/download helpers to file-type's renamed methods and adapt
query-string to decode-uri-component's ES module export. Installation fails if a
patch cannot be applied. Review these patches when upgrading their owning
packages; do not remove the overrides without checking the audit and tests.

The development server binds to `127.0.0.1`. Do not expose it to untrusted networks;
Gatsby's [development-server advisory](https://github.com/gatsbyjs/gatsby/security/advisories/GHSA-58f7-w355-p5h3)
has no upstream patch and does not affect the static production build.

Dependabot checks npm packages and GitHub Actions weekly. Pull requests run the
type checks, regression tests, and production build with read-only repository
permissions. Deployment permissions are limited to the deployment job. Action
versions are pinned to commit IDs and can be updated by Dependabot.

## JHV Slide Pipeline

The JHV slideshow tooling is now split into two clear steps:

1. Collect metadata (data retrieval + normalization)
2. Generate slides (rendering only)

### 1) Collect metadata

Run:

```shell
python3 scripts/collect_jhv_metadata.py --api-key "<CAMPAI_API_KEY>"
```

Optional:

```shell
python3 scripts/collect_jhv_metadata.py \
  --api-key "<CAMPAI_API_KEY>" \
  --reference-date 2026-12-31 \
  --output scripts/out/jhv-metadata-2026.json
```

### 2) Generate slides from metadata

Run:

```shell
python3 scripts/generate_jhv_slides.py \
  --metadata scripts/out/jhv-metadata-2026.json
```

Optional custom slides:

```shell
python3 scripts/generate_jhv_slides.py \
  --metadata scripts/out/jhv-metadata-2026.json \
  --custom-slides scripts/custom_slides.example.json
```

Optional PDF export (all slides in one PDF file):

```shell
python3 scripts/generate_jhv_slides.py \
  --metadata scripts/out/jhv-metadata-2026.json \
  --pdf-output /tmp/jhv-rueckblick-2026.pdf
```

If PDF dependencies are missing, install them once:

```shell
python3 -m pip install reportlab cairosvg
```

Or let the script install them automatically during export:

```shell
python3 scripts/generate_jhv_slides.py \
  --metadata scripts/out/jhv-metadata-2026.json \
  --pdf-output /tmp/jhv-rueckblick-2026.pdf \
  --install-pdf-deps
```

Force the Vereinsorgane voting slide even in odd years (for testing):

```shell
python3 scripts/generate_jhv_slides.py \
  --metadata scripts/out/jhv-metadata-2026.json \
  --force-voting-slide
```

### Files and responsibilities

- `scripts/collect_jhv_metadata.py`: Fetches Campai members and derives yearly metadata from blog content.
- `scripts/generate_jhv_slides.py`: Renders HTML deck from metadata and can export a multi-page PDF.
- `scripts/templates/slide_deck.html.tpl`: HTML shell template.
- `scripts/templates/slide_deck.css`: Deck styling.
- `scripts/templates/slide_deck.js`: Slide navigation/animation behavior.
