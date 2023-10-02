import { defineConfig, defineField, defineType } from "@sanity-typed/types";
import { enableZod, sanityConfigToZods } from "@sanity-typed/zod";

export const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    defineField({
      name: "productName",
      type: "string",
      title: "Product name",
      validation: (Rule) =>
        Rule.custom(
          () => "fail for no reason, but only in sanity studio"
        ).custom(
          enableZod((value) => "fail for no reason, but also in zod parser")
        ),
    }),
    // ...
  ],
});

// Everything else the same as before...
const config = defineConfig({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  schema: {
    types: [
      product,
      // ...
    ],
  },
});

const zods = sanityConfigToZods(config);

expect(() =>
  zods.product.parse({
    productName: "foo",
    /* ... */
  })
).toThrow("fail for no reason, but also in zod parser");
