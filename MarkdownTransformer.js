/**
 * Parcel v2 transformer for Markdown files with YAML front-matter.
 *
 * Each `.md` / `.mdown` / `.markdown` file is turned into a JavaScript module
 * that default-exports the result of `gray-matter`:
 *
 *   module.exports = { content, data, excerpt }
 *
 * - `content`: the markdown body without the front-matter block
 * - `data`: the parsed front-matter object
 * - `excerpt`: the excerpt, when gray-matter produces one
 *
 * Unlike the parcel v1 plugin, the raw source buffer (`orig`) is no longer
 * serialized into the output.
 */

const { Transformer } = require("@parcel/plugin");
const matter = require("gray-matter");

module.exports = new Transformer({
  async transform({ asset }) {
    const source = await asset.getCode();
    // Drop `orig` (the raw Buffer of the whole file); everything else is
    // JSON-serializable and kept as-is.
    const { orig, ...result } = matter(source);

    asset.type = "js";
    asset.setCode(`module.exports = ${JSON.stringify(result)};`);

    return [asset];
  },
});
