/* eslint-disable id-length -- x & y are sanity's hotspot fields */
import type { Faker } from "@faker-js/faker";
import type { ImageCrop, ImageDefinition, ImageHotspot } from "sanity";
import type { Merge } from "type-fest";
import { z } from "zod";

import {
  fieldsMock,
  fieldsSchema,
  fieldsZodObject,
  fieldsZodResolvedObject,
} from "../field";
import type {
  FieldOptions,
  FieldsZodObject,
  FieldsZodResolvedObject,
} from "../field";
import { referenceZod } from "../reference";
import type { SanityReference } from "../reference";
import { createType } from "../types";
import type { SanityNamedTypeDef, TupleOfLength, TypedValues } from "../types";

export type SanityImage<Hotspot extends boolean> = Hotspot extends false
  ? {
      _type: "image";
      asset: SanityReference;
    }
  : {
      _type: "image";
      asset: SanityReference;
      crop?: ImageCrop;
      hotspot?: ImageHotspot;
    };

type ExtraZodFields<Hotspot extends boolean> = Hotspot extends false
  ? {
      _type: z.ZodLiteral<"image">;
      asset: ReturnType<typeof referenceZod<false>>;
    }
  : {
      _type: z.ZodLiteral<"image">;
      asset: ReturnType<typeof referenceZod<false>>;
      crop: z.ZodOptional<
        z.ZodObject<{
          _type: z.ZodOptional<z.ZodLiteral<"sanity.imageCrop">>;
          bottom: z.ZodNumber;
          left: z.ZodNumber;
          right: z.ZodNumber;
          top: z.ZodNumber;
        }>
      >;
      hotspot: z.ZodOptional<
        z.ZodObject<{
          _type: z.ZodOptional<z.ZodLiteral<"sanity.imageHotspot">>;
          height: z.ZodNumber;
          width: z.ZodNumber;
          x: z.ZodNumber;
          y: z.ZodNumber;
        }>
      >;
    };

const extraZodFields = <Hotspot extends boolean>(
  hotspot: Hotspot | undefined
) =>
  ({
    _type: z.literal("image"),
    asset: referenceZod(false),
    ...(!hotspot
      ? {}
      : {
          crop: z
            .object({
              _type: z.literal("sanity.imageCrop").optional(),
              bottom: z.number(),
              left: z.number(),
              right: z.number(),
              top: z.number(),
            })
            .optional(),
          hotspot: z
            .object({
              _type: z.literal("sanity.imageHotspot").optional(),
              height: z.number(),
              width: z.number(),
              x: z.number(),
              y: z.number(),
            })
            .optional(),
        }),
  } as unknown as ExtraZodFields<Hotspot>);

const zeroToOne = (faker: Faker) =>
  faker.number.float({
    min: 0,
    max: 1,
    precision: 1 / 10 ** 15,
  });

export const image = <
  Names extends string,
  Zods extends z.ZodTypeAny,
  ResolvedValues,
  Optionals extends boolean,
  Zod extends z.ZodObject<
    Merge<
      FieldsZodObject<// eslint-disable-next-line @typescript-eslint/no-use-before-define -- Defaulted types need to be at the bottom
      FieldsArray>,
      ExtraZodFields<// eslint-disable-next-line @typescript-eslint/no-use-before-define -- Defaulted types need to be at the bottom
      Hotspot>
    >
  >,
  ZodResolved extends z.ZodObject<
    Merge<
      FieldsZodResolvedObject<// eslint-disable-next-line @typescript-eslint/no-use-before-define -- Defaulted types need to be at the bottom
      FieldsArray>,
      ExtraZodFields<// eslint-disable-next-line @typescript-eslint/no-use-before-define -- Defaulted types need to be at the bottom
      Hotspot>
    >
  >,
  FieldsArray extends TupleOfLength<
    FieldOptions<Names, Zods, ResolvedValues, Optionals>,
    1
  > = [never, ...never],
  Hotspot extends boolean = false,
  ParsedValue = z.output<Zod>,
  ResolvedValue = z.output<ZodResolved>
>({
  hotspot,
  fields,
  mock = (faker, path) =>
    ({
      ...(fields && fieldsMock(fields)(faker, path)),
      _type: "image",
      asset: {
        _type: "reference",
        _ref: `image-${faker.string.alphanumeric(24)}-${faker.number.int({
          min: 900,
          max: 3000,
        })}x${faker.number.int({
          min: 900,
          max: 3000,
        })}-${faker.helpers.arrayElement([
          "bmp",
          "gif",
          "jpeg",
          "jpg",
          "png",
          "svg",
          "tif",
          "tiff",
        ])}`,
      },
      ...(!hotspot
        ? {}
        : {
            crop: {
              top: zeroToOne(faker),
              bottom: zeroToOne(faker),
              left: zeroToOne(faker),
              right: zeroToOne(faker),
            },
            hotspot: {
              x: zeroToOne(faker),
              y: zeroToOne(faker),
              height: zeroToOne(faker),
              width: zeroToOne(faker),
            },
          }),
    } as unknown as z.input<Zod>),
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, z.input<Zod>>,
  zodResolved = (zod) =>
    zod as unknown as z.ZodType<ResolvedValue, any, z.input<Zod>>,
  options,
  ...def
}: Merge<
  Omit<
    SanityNamedTypeDef<
      Merge<ImageDefinition, TypedValues<z.input<Zod>>>,
      z.input<Zod>,
      ParsedValue,
      ResolvedValue,
      z.output<Zod>,
      z.output<ZodResolved>
    >,
    // "title" and "description" actually show up in the UI
    "name" | "preview"
  >,
  {
    fields?: FieldsArray;
    hotspot?: Hotspot;
  }
> = {}) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      ...(fields && fieldsSchema(fields)),
      options: { ...options, hotspot: Boolean(hotspot) },
      type: "image",
    }),
    zod: zodFn(
      z.object({
        ...(fields && fieldsZodObject(fields)),
        ...extraZodFields(hotspot),
      }) as unknown as Zod
    ),
    zodResolved: zodResolved(
      z.object({
        ...(fields && fieldsZodResolvedObject(fields)),
        ...extraZodFields(hotspot),
      }) as unknown as z.ZodType<z.output<ZodResolved>, any, z.input<Zod>>
    ),
  });
