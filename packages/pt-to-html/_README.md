# @portabletext-typed/to-html

[![NPM Downloads](https://img.shields.io/npm/dw/@portabletext-typed/to-html?style=flat&logo=npm)](https://www.npmjs.com/package/@portabletext-typed/to-html)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@portabletext-typed/to-html?style=flat)](https://www.npmjs.com/package/@portabletext-typed/to-html?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[@portabletext/to-html](https://github.com/portabletext/to-html) with typed arguments

@[:page_toc](## Page Contents)

## Install

```bash
npm install @portabletext/to-html @portabletext-typed/to-html
```

## Usage

After using [@sanity-typed/types](../types) and [@sanity-typed/client](../client) and you have typed blocks, use `toHTML` from this library as you would from [`@portabletext/to-html`](https://github.com/portabletext/to-html) to get fully typed arguments!

@[typescript](../example-studio/schemas/post.ts)
@[typescript](../example-app/src/pages/with-portabletext-to-html.tsx)

## Breaking Changes

### 2 to 3

#### Typescript version from 5.7.2 <= x <= 5.7.3

The supported Typescript version is now 5.7.2 <= x <= 5.7.3. Older versions are no longer supported and newer versions will be added as we validate them.

### 1 to 2

#### Typescript version from 5.4.2 <= x <= 5.6.3

The supported Typescript version is now 5.4.2 <= x <= 5.6.3. Older versions are no longer supported and newer versions will be added as we validate them.
