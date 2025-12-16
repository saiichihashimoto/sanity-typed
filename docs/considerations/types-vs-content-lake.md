### Types match config but not actual documents

As your sanity driven application grows over time, your config is likely to change. Keep in mind that you can only derive types of your current config, while documents in your Sanity Content Lake will have shapes from older configs. This can be a problem when adding new fields or changing the type of old fields, as the types won't can clash with the old documents.

Ultimately, there's nothing that can automatically solve this; we can't derive types from a no longer existing config. This is a consideration with or without types: your application needs to handle all existing documents. Be sure to make changes in a backwards compatible manner (ie, make new fields optional, don't change the type of old fields, etc).

Another solution would be to keep old configs around, just to derive their types:

```typescript
const config = defineConfig({
  schema: { types: [foo] },
  plugins: [myPlugin()],
});

const oldConfig = defineConfig({
  schema: { types: [oldFoo] },
  plugins: [myPlugin()],
});

type SanityValues =
  | InferSchemaValues<typeof config>
  | InferSchemaValues<typeof oldConfig>;
```

This can get unwieldy although, if you're diligent about data migrations of your old documents to your new types, you may be able to deprecate old configs and remove them from your codebase.
