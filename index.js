module.exports = function(bundler) {
  bundler.addAssetType("md", require.resolve("./MarkdownAsset.js"));
  // bundler.addPackager("markdown", require.resolve("./MarkdownPackager.js"));
};
