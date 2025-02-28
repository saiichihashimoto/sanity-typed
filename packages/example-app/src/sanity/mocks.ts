import { base, en } from "@faker-js/faker";
import config from "sanity.config";

import { sanityConfigToFaker, sanityDocumentsFaker } from "@sanity-typed/faker";

export const getMockDataset = async () => {
  const sanityFaker = sanityConfigToFaker(config, {
    faker: { locale: [en, base] },
  });
  /**
   *  typeof sanityFaker === {
   *    [type in keyof SanityValues]: () => SanityValues[type];
   *  }
   */

  const documentsFaker = sanityDocumentsFaker(config, sanityFaker);
  /**
   *  typeof documentsFaker === () => SanityValues[keyof SanityValues][]
   */

  return documentsFaker();
};
