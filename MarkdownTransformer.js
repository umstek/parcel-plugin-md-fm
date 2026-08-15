/**
 * Parcel v2 transformer for Markdown files with YAML front-matter.
 *
 * Each `.md` / `.mdown` / `.markdown` file is turned into a JavaScript module
 * that exports the result of `gray-matter`:
 *
 *   module.exports = { content, data, isEmpty, excerpt }
 *
 * - `content`: the markdown body without the front-matter block
 * - `data`: the parsed front-matter object
 * - `isEmpty`: true when the file had no (or an empty) front-matter block
 * - `excerpt`: the excerpt, when gray-matter produces one
 *
 * Unlike the parcel v1 plugin, the raw source buffer (`orig`) is no longer
 * serialized into the output.
 */

const { Transformer } = require("@parcel/plugin");
const matter = require("gray-matter");

/**
 * Convert markdown source with front-matter into a CommonJS module.
 * Exposed for unit tests.
 *
 * @param {string} source
 * @returns {string}
 */
function markdownToModule(source) {
  // Drop `orig` (the raw Buffer of the whole file); every other gray-matter
  // field is JSON-serializable and kept as-is.
  const { orig: _orig, ...result } = matter(source);
  return `module.exports = ${JSON.stringify(result)};`;
}

const transformer = new Transformer({
  async transform({ asset }) {
    asset.type = "js";
    asset.setCode(markdownToModule(await asset.getCode()));
    return [asset];
  },
});

transformer.markdownToModule = markdownToModule;

module.exports = transformer;
