const { Asset } = require("parcel-bundler");
const fm = require("front-matter");

class MarkdownAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = "js";
  }
  parse(markdownWithFrontmatter) {
    const { attributes: frontmatter, body: markdown } = fm(
      markdownWithFrontmatter
    );
    const md = { frontmatter, markdown };
    this.code = `${JSON.stringify(md)}`;
  }
  generate() {
    const js = `module.exports = ${this.code}`;
    return { js };
  }
}

module.exports = MarkdownAsset;
