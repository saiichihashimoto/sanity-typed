import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity-typed/client";
import { createClient } from "@sanity-typed/client-mock";

// export const client = createClient({
export const client = createClient<SanityValues>({
  // This can be an array, a promise, or a function returning the array
  documents: [
    {
      _createdAt: "2011-12-15T03:57:59.213Z",
      _id: "id",
      _rev: "rev",
      _type: "product",
      _updatedAt: "2029-01-01T06:23:59.079Z",
      productName: "Mock Product",
      tags: [
        {
          _key: "key",
          _type: "tag",
          label: "Mock Tag Label",
          value: "Mock Tag Value",
        },
      ],
    },
    // ...
  ],

  // ...@sanity/client options
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
/**
 *  makeTypedQuery() === Promise<[{
 *    _id: "id",
 *    productName: "Mock Product",
 *    tags: [
 *      {
 *        _key: "key",
 *        _type: "tag",
 *        label: "Mock Tag Label",
 *        value: "Mock Tag Value",
 *      },
 *    ],
 *  }]>
 */
