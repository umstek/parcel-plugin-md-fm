const { Asset } = require("parcel-bundler");
const matter = require("gray-matter");

class MarkdownAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    // We export the result as JavaScript
    this.type = "js";
  }

  async parse(fullText) {
    const md = matter(fullText);
    this.code = `${JSON.stringify(md)}`;
  }

  async generate() {
    const js = `module.exports = ${this.code}`;
    return { js };
  }
}

module.exports = MarkdownAsset;
