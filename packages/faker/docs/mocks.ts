import { base, en } from "@faker-js/faker";

import { sanityConfigToFaker } from "@sanity-typed/faker";

import { config } from "./sanity.schema";

const sanityFaker = _sanityConfigToFaker(config, {
  faker: { locale: [en, base] },
});

const mock = sanityFaker.product();
/**
 *  mock === {
 *    _createdAt: "2011-12-15T03:57:59.213Z",
 *    _id: "9bd9d8d6-9a67-44e0-af46-7cc8796ed151",
 *    _rev: "1mPXM8RRYtNNswMG7IDA8x",
 *    _type: "product",
 *    _updatedAt: "2029-01-01T06:23:59.079Z",
 *    productName: "Deduco tyrannus v",
 *    tags: [
 *      {
 *        _key: "4d8edf97d9df21feee3472a6",
 *        _type: "tag",
 *        label: "Cuppedi",
 *        value: "Defleo bis min"
 *      },
 *      {
 *        _key: "fec59aa5d372ee63b4e8ec02",
 *        _type: "tag",
 *        label: "Communis molestiae a",
 *        value: "Solitud"
 *      },
 *      {
 *        _key: "a0096f276a2f6d9e14fccd5b",
 *        _type: "tag",
 *        label: "Speculum alo v"
 *      },
 *      {
 *        _key: "c803ec5fa6f95ac8ddce4dee",
 *        _type: "tag",
 *        label: "Aliquid",
 *        value: "Turba c"
 *      }
 *    ]
 *  }
 */
