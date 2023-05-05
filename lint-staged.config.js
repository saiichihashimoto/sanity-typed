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
  "{.eslint*,package.json}": () => [`${eslintCmd} .`],
  "{.prettier*,package.json}": () => [`${prettierCmd} .`],
  "package.json": () => [
    ...(process.env.NO_FIX ? [] : ["manypkg fix"]),
    // `manypkg fix` doesn't fail
    "manypkg check",
  ],
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
