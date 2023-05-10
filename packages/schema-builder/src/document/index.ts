import type { Faker } from "@faker-js/faker";
import { keyBy } from "lodash/fp";
import type {
  DocumentDefinition,
  SanityDocument as SanityDocumentOriginal,
} from "sanity";
import type { Merge, RemoveIndexSignature } from "type-fest";
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
  Preview,
} from "../field";
import { createType } from "../types";
import type {
  SanityNamedTypeDef,
  SanityType,
  TupleOfLength,
  TypedValues,
} from "../types";

type SanityDocumentDefinition<Value> = Merge<
  DocumentDefinition,
  TypedValues<Value>
>;

export type DocumentType<
  DocumentName extends string,
  Value,
  ParsedValue,
  ResolvedValue
> = SanityType<
  Merge<SanityDocumentDefinition<Value>, { name: DocumentName }>,
  Value,
  ParsedValue,
  ResolvedValue
> & {
  getMockById: (id: string) => Value | undefined;
  getNthMock: (faker: Faker, n: number) => Value;
  name: DocumentName;
};

export type SanityDocument<DocumentName extends string = string> = Merge<
  RemoveIndexSignature<SanityDocumentOriginal>,
  {
    _type: DocumentName;
  }
>;

export type ParsedSanityDocument<DocumentName extends string = string> = Merge<
  SanityDocument<DocumentName>,
  {
    _createdAt: Date;
    _updatedAt: Date;
  }
>;

interface ExtraZodFields<DocumentName extends string> {
  _createdAt: z.ZodType<Date, any, string>;
  _id: z.ZodString;
  _rev: z.ZodString;
  _type: z.ZodLiteral<DocumentName>;
  _updatedAt: z.ZodType<Date, any, string>;
}

const extraZodFields = <DocumentNames extends string>(name: DocumentNames) => ({
  _createdAt: z.string().transform((date) => new Date(date)),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal(name),
  _updatedAt: z.string().transform((date) => new Date(date)),
});

export const document = <
  DocumentName extends string,
  Names extends string,
  Zods extends z.ZodTypeAny,
  ResolvedValues,
  Optionals extends boolean,
  FieldsArray extends TupleOfLength<
    FieldOptions<Names, Zods, ResolvedValues, Optionals>,
    1
  >,
  Zod extends z.ZodObject<
    Merge<FieldsZodObject<FieldsArray>, ExtraZodFields<DocumentName>>
  >,
  ZodResolved extends z.ZodObject<
    Merge<FieldsZodResolvedObject<FieldsArray>, ExtraZodFields<DocumentName>>
  >,
  ParsedValue = z.output<Zod>,
  ResolvedValue = z.output<ZodResolved>,
  // eslint-disable-next-line @typescript-eslint/ban-types -- All other values assume keys
  Select extends { [key: string]: string } = {}
>({
  name,
  fields,
  preview: previewDef,
  mock = (faker) => {
    const createdAt = faker.date
      .between("2021-06-03T03:24:55.395Z", "2022-06-04T18:50:36.539Z")
      .toISOString();

    return {
      ...fieldsMock(fields)(faker, name),
      _id: faker.datatype.uuid(),
      _createdAt: createdAt,
      _rev: faker.datatype.string(23),
      _type: name,
      _updatedAt: faker.date
        .between(createdAt, "2022-06-05T18:50:36.539Z")
        .toISOString(),
    } as unknown as z.input<Zod>;
  },
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, z.input<Zod>>,
  zodResolved = (zod) =>
    zod as unknown as z.ZodType<ResolvedValue, any, z.input<Zod>>,
  ...def
}: Merge<
  SanityNamedTypeDef<
    SanityDocumentDefinition<z.input<Zod>>,
    z.input<Zod>,
    ParsedValue,
    ResolvedValue,
    z.output<Zod>,
    z.output<ZodResolved>
  >,
  {
    fields: FieldsArray;
    name: DocumentName;
    preview?: Preview<z.input<Zod>, Select>;
  }
>): DocumentType<DocumentName, z.input<Zod>, ParsedValue, ResolvedValue> => {
  /* eslint-disable fp/no-let -- Need side effects */
  let counter = 0;
  let mocks: z.input<Zod>[] = [];
  let mocksById: { [key: string]: z.input<Zod> } = {};
  /* eslint-enable fp/no-let */

  const getNthMock = (faker: Faker, index: number) => {
    const newMocks = Array.from({
      length: Math.max(0, index + 1 - mocks.length),
    })
      .fill("test")
      .map(() => mock(faker, ""));

    if (newMocks.length > 0) {
      /* eslint-disable fp/no-mutation -- Need side effects */
      mocks = [...mocks, ...newMocks];
      mocksById = {
        ...mocksById,
        ...keyBy(
          (doc) =>
            // eslint-disable-next-line no-underscore-dangle -- Sanity uses _id
            (doc as { _id: string })._id,
          newMocks
        ),
      };
      /* eslint-enable fp/no-mutation */
    }

    return mocks[index]!;
  };

  // @ts-expect-error -- FIXME fieldsSchema type doesn't work in document, but works in other object-like schemas
  return {
    getMockById: (id: string) => mocksById[id],
    getNthMock,
    name,
    ...createType({
      mock: (faker) => {
        // eslint-disable-next-line fp/no-mutation -- Need side effects
        counter += 1;

        return getNthMock(faker, counter);
      },
      schema: () => ({
        ...def,
        ...fieldsSchema(fields, previewDef),
        name,
        type: "document",
      }),
      zod: zodFn(
        z.object({
          ...fieldsZodObject(fields),
          ...extraZodFields(name),
        }) as unknown as Zod
      ),
      zodResolved: zodResolved(
        z.object({
          ...fieldsZodResolvedObject(fields),
          ...extraZodFields(name),
        }) as unknown as z.ZodType<z.output<ZodResolved>, any, z.input<Zod>>
      ),
    }),
  };
};
