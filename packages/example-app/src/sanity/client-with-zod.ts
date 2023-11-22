import config from "sanity.config";
import type { SanityValues } from "sanity.config";

import { createClient } from "@sanity-typed/client";
import { sanityConfigToZods } from "@sanity-typed/zod";

export const client = createClient<SanityValues>()({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Zod Parsers for all your types! */
const sanityZods = sanityConfigToZods(config);
/**
 * typeof sanityZods === {
 *   [type in keyof SanityValues]: ZodType<SanityValues[type]>;
 * }
 */

export const makeTypedQuery = async () => {
  const results = await client.fetch('*[_type=="product"]');

  return results.map((result) => sanityZods.product.parse(result));
};
/**
 *  typeof makeTypedQuery === () => Promise<{
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
 *  }[]>
 */
