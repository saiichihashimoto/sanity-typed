// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

// See the API for this in https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/types
import type { SanityValues } from "./sanity.schema";

/** Small change using createClient https://www.sanity.io/docs/config-api-reference#dd1dc18716de */
// const client = createClient({
const client = createClient<SanityValues>()({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Typescript type from GROQ queries! */
const data = await client.fetch('*[_type=="product"]');
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
