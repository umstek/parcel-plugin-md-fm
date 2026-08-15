/**
 * Gold-standard integration test: run a real `parcel build` (the actual CLI)
 * in the fixture consumer project wired up exactly like the README describes
 * (.parcelrc with a transformers entry), then execute the produced bundle in
 * node and assert on the front-matter that was parsed at build time.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

const fixtureDir = resolve(dirname(fileURLToPath(import.meta.url)), "fixture");
const distDir = join(fixtureDir, "dist");
const parcelBin = require.resolve("parcel/lib/bin.js");

function run(command, args, opts = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...opts });
  if (result.error) {
    throw new Error(`failed to run ${command}: ${result.error.message}`);
  }
  return result;
}

let buildOutput = null;

beforeAll(() => {
  const build = run(
    process.execPath,
    [
      parcelBin,
      "build",
      "src/index.js",
      "--dist-dir",
      "dist",
      "--no-cache",
      "--no-optimize",
      "--no-autoinstall",
    ],
    { cwd: fixtureDir },
  );

  if (build.status !== 0) {
    throw new Error(`parcel build failed:\n${build.stdout}\n${build.stderr}`);
  }

  const runResult = run(process.execPath, [join(distDir, "index.js")], { cwd: fixtureDir });
  if (runResult.status !== 0) {
    throw new Error(`running the bundle failed:\n${runResult.stdout}\n${runResult.stderr}`);
  }
  buildOutput = JSON.parse(runResult.stdout);
}, 240_000);

describe("real parcel build (fixture consumer)", () => {
  it("produces a bundle on disk containing the transformed markdown", () => {
    expect(existsSync(join(distDir, "index.js"))).toBe(true);
    const code = readFileSync(join(distDir, "index.js"), "utf8");
    expect(code).toContain('"content"');
    expect(code).toContain('"data"');
    expect(code).toContain("Integration Post");
  });

  it("transforms .md with named imports (content + data)", () => {
    const { post } = buildOutput;
    expect(post.data).toEqual({
      title: "Integration Post",
      tags: ["parcel", "markdown"],
      draft: false,
    });
    expect(post.content).toContain("# Post");
    expect(post.content).toContain("Hello from **markdown** with front-matter.");
  });

  it("transforms .mdown via default import", () => {
    expect(buildOutput.notes.data).toEqual({ title: "Notes" });
    expect(buildOutput.notes.content).toContain("Some notes in an .mdown file.");
    expect(buildOutput.notes.isEmpty).toBe(false);
  });

  it("transforms .markdown via default import", () => {
    expect(buildOutput.readme.data).toEqual({ title: "Readme", author: "umstek" });
    expect(buildOutput.readme.content).toContain("Readme body in a .markdown file.");
  });

  it("handles markdown without front-matter", () => {
    expect(buildOutput.plain.data).toEqual({});
    // gray-matter reports isEmpty only for an empty front-matter block.
    expect(buildOutput.plain.isEmpty).toBe(false);
    expect(buildOutput.plain.content).toContain("No front-matter here at all.");
  });
});
