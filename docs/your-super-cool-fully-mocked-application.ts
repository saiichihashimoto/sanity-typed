import { base, en } from "@faker-js/faker";

import { createClient } from "@sanity-typed/client";
import { createClient as createClientMock } from "@sanity-typed/client-mock";
import { sanityConfigToFaker } from "@sanity-typed/faker";

import { config } from "./sanity.config";
import type { SanityValues } from "./sanity.config";

const createMockClient = () => {
  const sanityFaker = sanityConfigToFaker(config, {
    faker: { locale: [en, base] },
  });

  return createClientMock<SanityValues>({
    dataset: [
      sanityFaker.product(),
      sanityFaker.product(),
      sanityFaker.product(),
      sanityFaker.product(),
      sanityFaker.product(),
    ],
  });
};

const client = (
  process.env.DETECT_PRODUCTION_SOMEHOW
    ? createClient<SanityValues>()
    : createMockClient()
)({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

const data = await client.fetch('*[_type=="product"]{productName,tags}');
