import type { z as Z } from "zod";

const zods = {
  // TODO aliasedType
  // TODO array
  // TODO block
  // TODO crossDatasetReference
  // TODO document
  // TODO file
  // TODO image
  // TODO object
  // TODO reference
  boolean: (z: typeof Z) => z.boolean(),
  date: (z: typeof Z) => z.string(),
  datetime: (z: typeof Z) => z.string(),
  email: (z: typeof Z) => z.string(),
  number: (z: typeof Z) => z.number(),
  string: (z: typeof Z) => z.string(),
  text: (z: typeof Z) => z.string(),
  url: (z: typeof Z) => z.string(),
  geopoint: (z: typeof Z) =>
    z.object({
      _type: z.literal("geopoint"),
      lat: z.number(),
      lng: z.number(),
      alt: z.number().optional(),
    }),
  slug: (z: typeof Z) =>
    z.object({ _type: z.literal("slug"), current: z.string() }),
};

export const sanityZod =
  (z: typeof Z) =>
  <TType extends keyof typeof zods>({ type }: { type: TType }) =>
    zods[type](z) as unknown as ReturnType<(typeof zods)[TType]>;
