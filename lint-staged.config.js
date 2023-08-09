const path = require("path");

const eslintCmd = `cross-env TIMING=1 eslint --quiet --ext .js,.jsx,.ts,.tsx ${
  process.env.NO_FIX ? "" : "--fix"
}`;
const prettierCmd = `prettier --ignore-unknown ${
  process.env.NO_FIX ? "--check" : "--write"
}`;

// TODO NO_FIX should also not `git add` https://github.com/okonet/lint-staged/issues/1262
// TODO globally run commands should `git add .` BEFORE command brings back stash https://github.com/okonet/lint-staged/issues/1253

/**
 * @type {import('lint-staged').Config}
 */
const config = {
  "*.{gif,jpeg,jpg,png,svg}": ["imagemin-lint-staged"],
  "*.{js,jsx,ts,tsx}": [eslintCmd],
  "*.*": [prettierCmd],
  "{.eslint*,package.json}": () => [
    `${eslintCmd} .`,
    ...(process.env.NO_FIX ? [] : ["git add ."]),
  ],
  "{.prettier*,package.json}": () => [
    `${prettierCmd} .`,
    ...(process.env.NO_FIX ? [] : ["git add ."]),
  ],
  "package.json": () => [
    ...(process.env.NO_FIX ? [] : ["manypkg fix"]),
    "manypkg check",
    ...(process.env.NO_FIX ? [] : ["git add **/package.json"]),
  ],
  "{_README.md,README.md}": (filenames) =>
    process.env.NO_FIX
      ? []
      : filenames.flatMap((filename) => [
          `markdown_helper include ${path.resolve(
            path.dirname(filename),
            "_README.md"
          )} ${path.resolve(path.dirname(filename), "README.md")}`,
          `git add ${path.resolve(path.dirname(filename), "README.md")}`,
        ]),
  ...(process.env.NO_FIX
    ? {}
    : {
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
      }),
};

module.exports = config;
