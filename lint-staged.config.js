const path = require("path");

const eslintCmd = `cross-env TIMING=1 eslint --quiet --ext .js,.jsx,.ts,.tsx --fix`;
const prettierCmd = `prettier --ignore-unknown --write`;

// TODO globally run commands should `git add .` BEFORE command brings back stash https://github.com/okonet/lint-staged/issues/1253

/**
 * @type {import('lint-staged').Config}
 */
const config = {
  "*.{gif,jpeg,jpg,png,svg}": ["imagemin-lint-staged"],
  "*.{js,jsx,ts,tsx}": [eslintCmd],
  "*": [prettierCmd],
  "{.eslint*,package.json}": () => [`${eslintCmd} .`, "git add ."],
  "{.prettier*,package.json}": () => [`${prettierCmd} .`, "git add ."],
  "{package-lock.json,package.json}": () => [
    "npm install",
    "git add package-lock.json",
  ],
  "package.json": () => [
    "manypkg fix",
    "manypkg check",
    "git add **/package.json",
  ],
  "{_README.md,README.md}": (filenames) =>
    filenames.flatMap((filename) => [
      `bundle exec markdown_helper include ${path.resolve(
        path.dirname(filename),
        "_README.md"
      )} ${path.resolve(path.dirname(filename), "README.md")}`,
      `git add ${path.resolve(path.dirname(filename), "README.md")}`,
    ]),
  "{.env*,.gitattributes}": (files) =>
    files.map((file) => `sort -o ${file} ${file}`),
};

module.exports = config;
