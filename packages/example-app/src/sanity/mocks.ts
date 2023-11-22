import { base, en } from "@faker-js/faker";
import config from "sanity.config";

import { sanityConfigToFaker } from "@sanity-typed/faker";

export const getMockDataset = () => {
  const sanityFaker = sanityConfigToFaker(config, {
    faker: { locale: [en, base] },
  });
  /**
   *  typeof sanityFaker === {
   *    [type in keyof SanityValues]: () => SanityValues[type];
   *  }
   */

  return [
    sanityFaker.product(),
    sanityFaker.product(),
    sanityFaker.product(),
    sanityFaker.product(),
    sanityFaker.product(),
  ];
};
