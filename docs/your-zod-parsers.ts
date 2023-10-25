import { sanityConfigToZods } from "@sanity-typed/zod";

import config from "./sanity.config";
import type { SanityValues } from "./sanity.config";

/** Zod Parsers for all your types! */
export const sanityZods = sanityConfigToZods(config);
/**
 * typeof sanityZods === {
 *   product: ZodType<...>;
 *    // ... parsers for all your types!
 * }
 */

/** Parsed Document! */
const product = sanityZods.product.parse(getInputFromWherever);
/**
 *  typeof product === SanityValues['product'] === {
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
 *  }
 */
