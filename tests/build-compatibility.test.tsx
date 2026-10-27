import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);

test("Gatsby detects downloaded images using the patched file-type API", async () => {
  const { fetchRemoteFile } = require("gatsby-core-utils");
  const directory = await mkdtemp(
    path.join(tmpdir(), "kinderlicht-download-test-"),
  );
  const buffer = await readFile("src/images/quadratic.png");
  const server = createServer((_request, response) => {
    response.setHeader("Content-Type", "application/octet-stream");
    response.end(buffer);
  });
  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const file = await fetchRemoteFile({
      url: `http://127.0.0.1:${address.port}/image`,
      directory,
    });
    assert.equal(path.extname(file), ".png");
    assert.deepEqual(await readFile(file), buffer);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(directory, { recursive: true, force: true });
  }
});

test("Gatsby detects image buffers using the patched file-type API", async () => {
  const createFileNodeFromBuffer = require("gatsby-source-filesystem/create-file-node-from-buffer");
  const directory = await mkdtemp(
    path.join(tmpdir(), "kinderlicht-file-test-"),
  );
  const values = new Map();
  try {
    const buffer = await readFile("src/images/quadratic.png");
    const node = await createFileNodeFromBuffer({
      buffer,
      cache: {
        directory,
        get: async (key: string) => values.get(key),
        set: async (key: string, value: unknown) => values.set(key, value),
      },
      createNode: () => {},
      createNodeId: (value: string) => value,
    });
    assert.equal(node.extension, "png");
    assert.deepEqual(await readFile(node.absolutePath), buffer);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("patched image processing produces PNG, WebP, and AVIF", async () => {
  const sharp = require("sharp");
  for (const format of ["png", "webp", "avif"]) {
    const result = await sharp("src/images/quadratic.png")
      .resize(32, 32)
      .toFormat(format)
      .toBuffer();
    const metadata = await sharp(result).metadata();
    assert.equal(metadata.width, 32);
    assert.equal(metadata.height, 32);
    assert.ok(result.byteLength > 0);
  }
});

test("image query strings retain correct decoding and malformed-input handling", () => {
  const queryString = require("query-string");
  assert.deepEqual(
    { ...queryString.parse("width=640&caption=Kinder%20%26%20Familien") },
    { width: "640", caption: "Kinder & Familien" },
  );
  assert.equal(queryString.parse("caption=%E0%A4%A").caption, "%E0%A4%A");
});

test("updated GraphQL utilities reject prototype pollution", () => {
  const { mergeDeep } = require("@graphql-tools/utils");
  const result = mergeDeep([
    { title: "Kinderlicht" },
    JSON.parse('{"__proto__":{"polluted":true},"safe":true}'),
  ]);
  assert.equal(result.title, "Kinderlicht");
  assert.equal(result.safe, true);
  assert.equal(result.polluted, undefined);
  assert.equal(
    Object.prototype.hasOwnProperty.call(Object.prototype, "polluted"),
    false,
  );
});
