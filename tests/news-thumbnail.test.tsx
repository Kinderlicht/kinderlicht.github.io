import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import NewsThumbnail from "../src/components/news-thumbnail";
import type { IGatsbyImageData } from "gatsby-plugin-image";

const image: IGatsbyImageData = {
  layout: "constrained",
  width: 800,
  height: 1000,
  images: { fallback: { src: "/photo.jpg", srcSet: "/photo.jpg 800w", sizes: "800px" } },
};

test("news previews use the portal's frame and saved crop on Gatsby images", () => {
  const html = renderToStaticMarkup(
    <NewsThumbnail image={image} positionX={0} positionY={83.7} />,
  );
  assert.match(html, /aspect-ratio:16 \/ 9/);
  assert.match(html, /position:absolute;[^"<>]*inset:0;width:100%;height:100%/);
  assert.match(html, /object-fit:cover;object-position:0% 83.7%/);
});

test("older articles default to center and invalid coordinates cannot break the crop", () => {
  assert.match(renderToStaticMarkup(<NewsThumbnail image={image} />), /object-position:50% 50%/);
  assert.match(
    renderToStaticMarkup(<NewsThumbnail image={image} positionX={null} positionY={NaN} />),
    /object-position:50% 50%/,
  );
  assert.match(
    renderToStaticMarkup(<NewsThumbnail image={image} positionX={-1} positionY={101} />),
    /object-position:0% 100%/,
  );
});
