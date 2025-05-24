const path = require("path");

const eslintCmd = `cross-env TIMING=1 NODE_OPTIONS="--max-old-space-size=8192" eslint --cache --cache-strategy content --ext .js,.jsx,.ts,.tsx --fix`;
const prettierCmd = `prettier --ignore-unknown --write --cache`;

const runAll = Boolean(process.env.RUN_ALL);

// TODO globally run commands should `git add .` BEFORE command brings back stash https://github.com/okonet/lint-staged/issues/1253
// Until that issue is resolved, we'll always --no-stash and just stash/unstash and add everything on our own

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{gif,jpeg,jpg,png,svg}": ["imagemin-lint-staged"],
  "_README.md": (filenames) =>
    filenames.flatMap((filename) => [
      `bundle exec markdown_helper include --pristine ${filename} ${path.resolve(
        path.dirname(filename),
        path.basename(filename).slice(1)
      )}`,
      `git add ${path.resolve(
        path.dirname(filename),
        path.basename(filename).slice(1)
      )}`,
    ]),
  "{.env*,.gitattributes}": (files) =>
    files.map((file) => `sort -o ${file} ${file}`),
  ...(runAll
    ? { "*": () => [`${prettierCmd} .`, `${eslintCmd} .`] }
    : {
        "*.{js,jsx,ts,tsx}": [eslintCmd],
        "*": [prettierCmd],
        "{.eslint*,package.json}": () => [`${eslintCmd} .`, "git add ."],
        "{.prettier*,package.json}": () => [`${prettierCmd} .`, "git add ."],
      }),
};

module.exports = config;
