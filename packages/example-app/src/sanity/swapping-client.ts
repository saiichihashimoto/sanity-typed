import type { SanityValues } from "sanity.config";

import { createClient as createLiveClient } from "@sanity-typed/client";
import { createClient as createMockClient } from "@sanity-typed/client-mock";

import { getMockDataset } from "./mocks";

// @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/482
const createClient = process.env.VERCEL
  ? createLiveClient<SanityValues>()
  : createMockClient<SanityValues>({ dataset: getMockDataset() });

export const client = createClient({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
