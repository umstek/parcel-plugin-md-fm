import { describe, expect, it } from "vitest";
import transformer from "../MarkdownTransformer.js";

const { markdownToModule } = transformer;

function evaluateModule(source) {
  const moduleExports = {};
  const fn = new Function("module", "exports", markdownToModule(source));
  fn(moduleExports, moduleExports.exports);
  return moduleExports.exports;
}

describe("markdownToModule", () => {
  it("exports parsed front-matter data and the content body", () => {
    const result = evaluateModule(
      [
        "---",
        "title: Hello",
        "tags:",
        "  - a",
        "  - b",
        "---",
        "",
        "# Heading",
        "",
        "Body text.",
        "",
      ].join("\n"),
    );

    expect(result.data).toEqual({ title: "Hello", tags: ["a", "b"] });
    expect(result.content).toBe("\n# Heading\n\nBody text.\n");
    expect(result.isEmpty).toBe(false);
  });

  it("keeps working when there is no front-matter", () => {
    const result = evaluateModule("# Just markdown\n");

    expect(result.data).toEqual({});
    expect(result.content).toBe("# Just markdown\n");
    // gray-matter's isEmpty is only true for an *empty* front-matter block,
    // not for a file without one.
    expect(result.isEmpty).toBe(false);
  });

  it("marks an empty front-matter block as empty", () => {
    const result = evaluateModule("---\n---\n# Heading\n");

    expect(result.data).toEqual({});
    expect(result.isEmpty).toBe(true);
  });

  it("emits a CommonJS module", () => {
    const code = markdownToModule("---\ntitle: Hi\n---\nBody");
    expect(code.startsWith("module.exports = {")).toBe(true);
    expect(code.endsWith(";")).toBe(true);
  });

  it("does not serialize the raw source buffer (orig)", () => {
    const code = markdownToModule("---\ntitle: Hi\n---\nBody");
    expect(code).not.toContain("Buffer");
    expect(code).not.toContain('"orig"');
  });

  it("escapes quotes and backslashes in markdown safely into JavaScript", () => {
    const source =
      '---\ntitle: "Hi \\"there\\""\n---\nText with "quotes", \\backslash\\ and ``` code fences.\n';
    const result = evaluateModule(source);

    expect(result.data.title).toBe('Hi "there"');
    expect(result.content).toContain('"quotes"');
    expect(result.content).toContain("\\backslash\\");
    expect(result.content).toContain("``` code fences");
  });
});

describe("transformer plugin object", () => {
  it("is a parcel Transformer with a transform hook that emits a js asset", async () => {
    // Parcel reads plugin hooks from this well-known symbol (see
    // @parcel/plugin PluginAPI.js); use the same channel to drive the hook.
    const config = transformer[Symbol.for("parcel-plugin-config")];
    expect(typeof config.transform).toBe("function");

    const asset = {
      type: "md",
      code: undefined,
      async getCode() {
        return "---\ntitle: Hi\n---\nBody";
      },
      setCode(code) {
        this.code = code;
      },
    };

    const assets = await config.transform({ asset });
    expect(assets).toEqual([asset]);
    expect(asset.type).toBe("js");
    expect(asset.code).toBe(
      'module.exports = {"content":"Body","data":{"title":"Hi"},"isEmpty":false,"excerpt":""};',
    );
  });
});
