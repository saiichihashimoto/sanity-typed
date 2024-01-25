import type { SanityValues } from "sanity.config";

import { createClient as createLiveClient } from "@sanity-typed/client";
import { createClient as createMockClient } from "@sanity-typed/client-mock";

import { getMockDataset } from "./mocks";

const config = {
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
};

export const client = process.env.VERCEL
  ? createLiveClient<SanityValues>(config)
  : createMockClient<SanityValues>({ ...config, documents: getMockDataset() });

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
