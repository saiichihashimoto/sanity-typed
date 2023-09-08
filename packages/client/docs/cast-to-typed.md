## Typing an untyped client (and vice versa)

Sometimes, you'll have a preconfigured client from a separate library (notably, [`next-sanity`](https://github.com/sanity-io/next-sanity)) that you will still want typed results from. A `castToTyped` function is provided to do just that.

```typescript
import { createClient } from "next-sanity";

import { castToTyped } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.schema";

const client = createClient({
  // ...
});

// Same function signature as the typed `createClient`
const typedClient = castToTyped<SanityValues>()(client);

// Also, if you need the config in the client (eg. for queries using $param),
// you can provide the same config again to include it in the types.

// const typedClient = castToTyped<SanityValues>()(client, {
//   ...same contents from createClient
// });

const data = await typedClient.fetch("*");
/**
 *  typeof data === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "product";
 *    _updatedAt: string;
 *    productName?: string;
 *    tags?: {
 *      _key: string;
 *      label?: string;
 *      value?: string;
 *    }[];
 *  }[]
 */
```

Similarly, if you have a typed client that you want to untype (presumably to export from a library for general consumption), the opposite exists as well:

```typescript
import { castFromTyped, createClient } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.schema";

const client = createClient<SanityValues>()({
  // ...
});

export const typedClient = client;

export const untypedClient = castFromTyped(client);

export default untypedClient;
```

Neither of these functions (nor the `createClient` function) have any runtime implications; they pass through the initial client unaltered.
