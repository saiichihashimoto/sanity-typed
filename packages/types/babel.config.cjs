/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { modules: "commonjs", targets: { node: "current" } },
    ],
  ],
};
