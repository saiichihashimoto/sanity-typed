// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.config";

/** Small change using createClient */
// const client = createClient({
const client = createClient<SanityValues>()({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Typescript type from GROQ queries! */
const data = await client.fetch('*[_type=="product"]{productName,tags}');
/**
 *  typeof data === {
 *    productName: string | null;
 *    tags: {
 *      _key: string;
 *      label?: string;
 *      value?: string;
 *    }[] | null;
 *  }[]
 */
