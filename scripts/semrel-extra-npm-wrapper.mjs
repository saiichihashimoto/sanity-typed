/**
 * ESM wrapper that provides @semrel-extra/npm behavior (verifyConditions memo +
 * path remapping) while loading @semantic-release/npm via import() to avoid
 * ERR_REQUIRE_ASYNC_MODULE when used with semantic-release 25 / @semantic-release/npm 13.
 */
import path from "node:path";
import readPkg from "read-pkg";

const castArray = (v) => (Array.isArray(v) ? v : [v]);

const npmPluginModule = await import("@semantic-release/npm");
const plugin = npmPluginModule.default ?? npmPluginModule;

async function getPkg(pluginConfig, context) {
  const { cwd } = context;
  const pkgRoot = pluginConfig?.pkgRoot;
  const dir = pkgRoot ? path.resolve(cwd, String(pkgRoot)) : cwd;
  return readPkg({ cwd: dir });
}

let memo;

async function verifyConditionsHooked(pluginConfig, context) {
  if (memo) {
    return memo;
  }

  if (context.options.publish) {
    const publishConfig =
      castArray(context.options.publish).find(
        (config) =>
          config.path === "@semrel-extra/npm"
          || (config.path
            && String(config.path).includes("semrel-extra-npm-wrapper"))
      ) || {};
    publishConfig.path = "@semantic-release/npm";
  }

  const _result = plugin.verifyConditions(pluginConfig, context);
  const pkg = await getPkg(pluginConfig, context);

  if (pluginConfig.npmPublish !== false && pkg.private !== true) {
    memo = _result;
  }

  return _result;
}

verifyConditionsHooked._reset = () => {
  memo = undefined;
};

export default { ...plugin, verifyConditions: verifyConditionsHooked };
