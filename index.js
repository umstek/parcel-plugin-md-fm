module.exports = function(bundler) {
  // Works with or without the dot e.g.: .md
  bundler.addAssetType("md", require.resolve("./MarkdownAsset.js"));
  bundler.addAssetType("mdown", require.resolve("./MarkdownAsset.js"));
  bundler.addAssetType("markdown", require.resolve("./MarkdownAsset.js"));
  // bundler.addPackager("markdown", require.resolve("./MarkdownPackager.js"));
};
