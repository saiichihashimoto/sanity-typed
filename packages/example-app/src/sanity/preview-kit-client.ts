import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity/preview-kit/client";
import { createClient } from "@sanity-typed/preview-kit";

/** Small change using createClient */
// export const client = createClient({
export const client = createClient<SanityValues>()({
  // ...base config options
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",

  // ...@sanity/preview-kit/client options
  studioUrl: "/studio",
  encodeSourceMap: "auto",
});

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
/**
 *  typeof makeTypedQuery === () => Promise<{
 *    _id: string;
 *    productName: string;
 *    tags: {
 *      _key: string;
 *      _type: "tag";
 *      label?: string;
 *      value?: string;
 *    }[] | null;
 *  }[]>
 */
