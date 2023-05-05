import type {
  ReferenceDefinition,
  ReferenceValue,
  WeakReference,
} from "sanity";
import type { Merge } from "type-fest";
import { z } from "zod";

import type { DocumentType } from "../document";
import { createType } from "../types";
import type {
  InferResolvedValue,
  InferValue,
  SanityTypeDef,
  TupleOfLength,
  TypedValues,
} from "../types";

export type SanityReference<Weak extends boolean = false> = Omit<
  Weak extends false ? Omit<ReferenceValue, "_weak"> : WeakReference,
  "_type"
> & {
  _type: "reference";
};

export const referenceZod = <Weak extends boolean>(weak: Weak | undefined) =>
  z.object({
    _key: z.string().optional(),
    _ref: z.string(),
    _strengthenOnPublish: z
      .object({
        template: z
          .object({
            id: z.string(),
            params: z
              .object({})
              .catchall(z.union([z.string(), z.number(), z.boolean()])),
          })
          .optional(),
        type: z.string(),
        weak: z.boolean().optional(),
      })
      .optional(),
    _type: z.literal("reference"),
    _weak: weak ? z.literal(true) : z.boolean().optional(),
  }) as z.ZodType<SanityReference<Weak>, any, SanityReference<Weak>>;

export const reference = <
  DocumentName extends string,
  ResolvedDocumentValue,
  DocumentTypes extends TupleOfLength<
    DocumentType<DocumentName, any, any, ResolvedDocumentValue>,
    1
  >,
  Weak extends boolean = false,
  ParsedValue = SanityReference<Weak>,
  ResolvedValue =
    | InferResolvedValue<DocumentTypes[number]>
    | (Weak extends false ? never : null)
>({
  weak,
  to: documents,
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, SanityReference<Weak>>,
  zodResolved = (zod) =>
    zod.transform(
      ({ _ref }) =>
        (documents
          .map(({ getMockById, resolve }) => {
            const mock = getMockById(_ref) as
              | InferValue<DocumentTypes[number]>
              | undefined;

            return !mock
              ? null
              : (resolve(mock) as InferResolvedValue<DocumentTypes[number]>);
          })
          .find(Boolean) ?? null) as ResolvedValue
    ),
  ...defRaw
}: Merge<
  SanityTypeDef<
    Merge<ReferenceDefinition, TypedValues<SanityReference<Weak>>>,
    SanityReference<Weak>,
    ParsedValue,
    ResolvedValue
  >,
  {
    to: DocumentTypes;
    weak?: Weak;
  }
>) => {
  // eslint-disable-next-line fp/no-let -- Need side effects
  let counter = 0;

  const {
    mock = (faker) => {
      // eslint-disable-next-line fp/no-mutation -- Need side effects
      counter += 1;

      const { _id: ref } = faker.helpers.arrayElement(
        documents.map(
          ({ getNthMock }) =>
            getNthMock(faker, counter) as unknown as { _id: string }
        )
      );
      const isBrokenRef = faker.datatype.boolean();
      const brokenRef = faker.datatype.uuid();

      const mock: SanityReference = {
        _ref: weak && isBrokenRef ? brokenRef : ref,
        _type: "reference",
      };

      return (
        !weak
          ? mock
          : {
              ...mock,
              _weak: true,
            }
      ) as SanityReference<Weak>;
    },
    ...def
  } = defRaw;

  return createType({
    mock,
    schema: () => ({
      ...def,
      weak,
      type: "reference",
      to: documents.map(({ name: type }) => ({ type })),
    }),
    zod: zodFn(referenceZod(weak)),
    zodResolved: zodResolved(referenceZod(weak)),
  });
};
