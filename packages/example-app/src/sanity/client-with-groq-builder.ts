import type { SanityValues } from "sanity.config";

import { createClient } from "@sanity-typed/client";

export const client = createClient<SanityValues>({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  /** No need for createGroqBuilder, `q` is already typed! */
  await client.fetch((q) =>
    q.star
      .filterByType("product")
      .project({ _id: true, productName: true, tags: true })
  );
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
