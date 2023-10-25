// import { createClient } from "@sanity-typed/client";
import { createClient } from "@sanity-typed/client-mock";

import type { SanityValues } from "./sanity.config";

// const client = createClient({
const client = createClient<SanityValues>({
  dataset: [
    {
      _createdAt: "2011-12-15T03:57:59.213Z",
      _id: "9bd9d8d6-9a67-44e0-af46-7cc8796ed151",
      _rev: "1mPXM8RRYtNNswMG7IDA8x",
      _type: "product",
      _updatedAt: "2029-01-01T06:23:59.079Z",
      productName: "Deduco tyrannus v",
      tags: [
        {
          _key: "4d8edf97d9df21feee3472a6",
          _type: "tag",
          label: "Cuppedi",
          value: "Defleo bis min",
        },
        {
          _key: "fec59aa5d372ee63b4e8ec02",
          _type: "tag",
          label: "Communis molestiae a",
          value: "Solitud",
        },
        {
          _key: "a0096f276a2f6d9e14fccd5b",
          _type: "tag",
          label: "Speculum alo v",
        },
        {
          _key: "c803ec5fa6f95ac8ddce4dee",
          _type: "tag",
          label: "Aliquid",
          value: "Turba c",
        },
      ],
    },
    // ...
  ],
})({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

const data = await client.fetch('*[_type=="product"]{productName,tags}');
/**
 *  typeof data === [
 *    {
 *      productName: "Deduco tyrannus v",
 *      tags: [
 *        {
 *          _key: "4d8edf97d9df21feee3472a6",
 *          _type: "tag",
 *          label: "Cuppedi",
 *          value: "Defleo bis min",
 *        },
 *        {
 *          _key: "fec59aa5d372ee63b4e8ec02",
 *          _type: "tag",
 *          label: "Communis molestiae a",
 *          value: "Solitud",
 *        },
 *        {
 *          _key: "a0096f276a2f6d9e14fccd5b",
 *          _type: "tag",
 *          label: "Speculum alo v",
 *        },
 *        {
 *          _key: "c803ec5fa6f95ac8ddce4dee",
 *          _type: "tag",
 *          label: "Aliquid",
 *          value: "Turba c",
 *        },
 *      ],
 *    },
 *  ]
 */
