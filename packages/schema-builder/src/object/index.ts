import type { ObjectDefinition } from "sanity";
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
  Preview,
} from "../field";
import { createType } from "../types";
import type { SanityTypeDef, TupleOfLength, TypedValues } from "../types";

export const object = <
  Names extends string,
  Zods extends z.ZodTypeAny,
  ResolvedValues,
  Optionals extends boolean,
  FieldsArray extends TupleOfLength<
    FieldOptions<Names, Zods, ResolvedValues, Optionals>,
    1
  >,
  Zod extends z.ZodObject<FieldsZodObject<FieldsArray>>,
  ZodResolved extends z.ZodObject<FieldsZodResolvedObject<FieldsArray>>,
  ParsedValue = z.output<Zod>,
  ResolvedValue = z.output<ZodResolved>,
  // eslint-disable-next-line @typescript-eslint/ban-types -- All other values assume keys
  Select extends { [key: string]: string } = {}
>({
  fields,
  preview: previewDef,
  mock = fieldsMock(fields),
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, z.input<Zod>>,
  zodResolved = (zod) =>
    zod as unknown as z.ZodType<ResolvedValue, any, z.input<Zod>>,
  ...def
}: Merge<
  SanityTypeDef<
    Merge<ObjectDefinition, TypedValues<z.input<Zod>>>,
    z.input<Zod>,
    ParsedValue,
    ResolvedValue,
    z.output<Zod>,
    z.output<ZodResolved>
  >,
  {
    fields: FieldsArray;
    preview?: Preview<z.input<Zod>, Select>;
  }
>) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      ...fieldsSchema(fields, previewDef),
      type: "object",
    }),
    zod: zodFn(z.object(fieldsZodObject(fields)) as Zod),
    zodResolved: zodResolved(
      z.object(fieldsZodResolvedObject(fields)) as unknown as z.ZodType<
        z.output<ZodResolved>,
        any,
        z.input<Zod>
      >
    ),
  });
