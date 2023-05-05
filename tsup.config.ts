import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "tsup";

const getLocalDeps = async (
  packagePath: string,
  done: Set<string> = new Set()
): Promise<string[]> => {
  if (done.has(packagePath)) {
    return [];
  }

  // eslint-disable-next-line fp/no-unused-expression -- Being mutable on purpose
  done.add(packagePath);

  const { dependencies = {}, devDependencies = {} } = JSON.parse(
    await readFile(packagePath, {
      encoding: "utf8",
    })
  ) as {
    dependencies?: { [dependency: string]: string };
    devDependencies?: { [devDependencies: string]: string };
  };

  const localDependencies = Object.keys({
    ...dependencies,
    ...devDependencies,
  })
    .filter((dep) => dep.startsWith("@sanity-typed/"))
    .map((dep) => dep.replace("@sanity-typed/", ""));

  return [
    ...new Set([
      ...localDependencies.map((dep) => `../${dep}/src`),
      ...(
        await Promise.all(
          localDependencies.map(async (dep) =>
            getLocalDeps(
              resolve(process.cwd(), "..", dep, "package.json"),
              done
            )
          )
        )
      ).flat(),
    ]),
  ];
};

export default defineConfig(
  async ({
    // HACK If the cli options are defined, tsup refuses to let me override them. So I'm using `--no-dts` so I can define `--watch`
    dts,
  }) => ({
    entry: ["src/index.ts"],
    dts: true,
    skipNodeModulesBundle: true,
    watch:
      dts === false
        ? [".", ...(await getLocalDeps(resolve(process.cwd(), "package.json")))]
        : false,
  })
);
