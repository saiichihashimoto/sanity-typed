import type { z as Z } from "zod";

const zods = {
  boolean: (z: typeof Z) => z.boolean(),
  crossDatasetReference: (z: typeof Z) =>
    z.object({
      _dataset: z.string(),
      _projectId: z.string(),
      _ref: z.string(),
      _type: z.literal("crossDatasetReference"),
      _weak: z.optional(z.boolean()),
    }),
  date: (z: typeof Z) => z.string(),
  datetime: (z: typeof Z) => z.string(),
  email: (z: typeof Z) => z.string(),
  geopoint: (z: typeof Z) =>
    z.object({
      _type: z.literal("geopoint"),
      alt: z.optional(z.number()),
      lat: z.number(),
      lng: z.number(),
    }),
  number: (z: typeof Z) => z.number(),
  reference: (z: typeof Z) =>
    z.object({
      _ref: z.string(),
      _weak: z.optional(z.boolean()),
      _strengthenOnPublish: z.optional(
        z.object({
          type: z.string(),
          weak: z.optional(z.boolean()),
          template: z.optional(
            z.object({
              id: z.string(),
              params: z.record(z.union([z.string(), z.number(), z.boolean()])),
            })
          ),
        })
      ),
    }),
  slug: (z: typeof Z) =>
    z.object({
      _type: z.literal("slug"),
      current: z.string(),
    }),
  string: (z: typeof Z) => z.string(),
  text: (z: typeof Z) => z.string(),
  url: (z: typeof Z) => z.string(),
  // TODO array
  block: (z: typeof Z) =>
    z.object({
      _type: z.literal("block"),
      level: z.optional(z.number()),
      listItem: z.optional(z.string()),
      style: z.optional(z.string()),
      children: z.array(
        z.object({
          _key: z.optional(z.string()),
          _type: z.literal("span"),
          marks: z.optional(z.array(z.string())),
          text: z.string(),
        })
      ),
      markDefs: z.optional(
        z.array(
          z.object({
            _key: z.string(),
            _type: z.string(),
          })
        )
      ),
    }),
  // TODO object
  // TODO document
  // TODO file
  // TODO image
  // TODO aliasedType
};

export const sanityZod = <TType extends keyof typeof zods>(
  z: typeof Z,
  { type }: { type: TType }
) => zods[type](z) as unknown as ReturnType<(typeof zods)[TType]>;
