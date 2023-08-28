# @sanity-typed/groq-js

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq-js?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq-js)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq-js?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq-js?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Typed [GROQ-JS](https://github.com/sanity-io/groq-js) Results, all inferred, no query changes!

@[:page_toc](## Page Contents)

## Install

```bash
npm install groq-js @sanity-typed/groq-js
```

## Usage

Use `parse` and `evaluate` exactly as you would from [`groq-js`](https://github.com/sanity-io/groq-js). Then, use the results with the typescript types!

```typescript
// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";

const input = '*[_type == "user"]{name}';

const tree = parse(input);
/**
 *  typeof tree === {
 *    type: "Projection";
 *    base: {
 *      type: "Filter";
 *      base: {
 *        type: "Everything";
 *      };
 *      expr: {
 *        type: "OpCall";
 *        op: "==";
 *        left: {
 *          name: "_type";
 *          type: "AccessAttribute";
 *        };
 *        right: {
 *          type: "Value";
 *          value: "user";
 *        };
 *      };
 *    };
 *    expr: {
 *      type: "Object";
 *      attributes: [{
 *        type: "ObjectAttributeValue";
 *        name: "name";
 *        value: {
 *          type: "AccessAttribute";
 *          name: "name";
 *        };
 *      }];
 *    };
 *  }
 */

const dataset = [
  { _type: "user", name: "Michael" },
  { _type: "company", name: "Bluth Company" },
] as const;

const value = await evaluate(tree, { dataset });

const result = await value.get();
/**
 *  typeof result === {
 *    name: "Michael";
 *  }[]
 */
```
