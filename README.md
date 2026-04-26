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

### Files and responsibilities

- `scripts/collect_jhv_metadata.py`: Fetches Campai members and derives yearly metadata from blog content.
- `scripts/generate_jhv_slides.py`: Renders HTML deck from metadata.
- `scripts/templates/slide_deck.html.tpl`: HTML shell template.
- `scripts/templates/slide_deck.css`: Deck styling.
- `scripts/templates/slide_deck.js`: Slide navigation/animation behavior.
