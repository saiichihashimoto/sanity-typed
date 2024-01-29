### Typescript Errors in IDEs

Often you'll run into an issue where you get typescript errors in your IDE but, when building workspace (either you studio or app using types), there are no errors. This only occurs because your IDE is using a different version of typescript than the one in your workspace. A few debugging steps:

#### VSCode

- The [`JavaScript and TypeScript Nightly` extension (identifier `ms-vscode.vscode-typescript-next`)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) creates issues here by design. It will always attempt to use the newest version of typescript instead of your workspace's version. I ended up uninstalling it.
- [Check that VSCode is actually using your workspace's version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_compiler-versus-language-service) even if you've [defined the workspace version in `.vscode/settings.json`](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript). Use `TypeScript: Select TypeScript Version` to explictly pick the workspace version.
- Open any typescript file and you can [see which version is being used in the status bar](https://code.visualstudio.com/docs/typescript/typescript-compiling#_compiler-versus-language-service). Please check this (and provide a screenshot confirming this) before creating an issue. Spending hours debugging your issue ony to find that you're not using your workspace's version is very frustrating.
