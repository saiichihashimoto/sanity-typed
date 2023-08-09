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
      `markdown_helper include ${path.resolve(
        path.dirname(filename),
        "_README.md"
      )} ${path.resolve(path.dirname(filename), "README.md")}`,
      `git add ${path.resolve(path.dirname(filename), "README.md")}`,
    ]),
  "{.env*,.gitattributes}": (files) =>
    files.map((file) => `sort -o ${file} ${file}`),
  "Brewfile": (files) =>
    files.map((file) =>
      [
        `cat ${file}`,
        `awk 'BEGIN{FS=OFS=" "}
                /^tap/  {print 1 "\t" $0; next}
                /^brew/ {print 2 "\t" $0; next}
                /^cask/ {print 3 "\t" $0; next}
                /^mas/  {print 4 "\t" $0; next}
                        {print 9 "\t" $0}'`,
        "sort -u",
        `awk 'BEGIN{FS="\t";OFS=""}{$1=""; print $0}'`,
        "sed '/^ *$/d'",
        `sponge ${file}`,
      ].join(" | ")
    ),
};

module.exports = config;
