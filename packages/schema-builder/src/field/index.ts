import type { Faker } from "@faker-js/faker";
import { flow, fromPairs } from "lodash/fp";
import type {
  FieldDefinition,
  PrepareViewOptions,
  PreviewConfig,
  PreviewValue,
} from "sanity";
import type { Merge } from "type-fest";
import { z } from "zod";

import type {
  InferResolvedValue,
  InferValue,
  NamedSchemaFields,
  SanityType,
  TupleOfLength,
} from "../types";

export type FieldOptions<
  Name extends string,
  Zod extends z.ZodTypeAny,
  ResolvedValue,
  Optional extends boolean
> = Pick<FieldDefinition, "description" | "fieldset" | "group" | "title"> & {
  name: Name;
  optional?: Optional;
  type: SanityType<
    Omit<FieldDefinition<any>, NamedSchemaFields>,
    z.input<Zod>,
    z.output<Zod>,
    ResolvedValue
  >;
};

type ZodOptional<
  T extends z.ZodTypeAny,
  Optional extends boolean
> = Optional extends true ? z.ZodOptional<T> : T;

export type FieldsZodObject<
  FieldsArray extends TupleOfLength<
    FieldOptions<any, z.ZodTypeAny, any, any>,
    1
  >
> = {
  [Name in FieldsArray[number]["name"]]: ZodOptional<
    Extract<FieldsArray[number], { name: Name }>["type"]["zod"],
    Extract<FieldsArray[number], { name: Name }>["optional"]
  >;
};

export const fieldsZodObject = <
  FieldsArray extends TupleOfLength<
    FieldOptions<any, z.ZodTypeAny, any, any>,
    1
  >
>(
  fields: FieldsArray
) =>
  fromPairs(
    fields.map(({ name, optional, type: { zod } }) => [
      name,
      optional ? z.optional(zod) : zod,
    ])
  ) as FieldsZodObject<FieldsArray>;

export type FieldsZodResolvedObject<
  FieldsArray extends TupleOfLength<
    FieldOptions<any, z.ZodTypeAny, any, any>,
    1
  >
> = {
  [Name in FieldsArray[number]["name"]]: ZodOptional<
    z.ZodType<
      InferResolvedValue<Extract<FieldsArray[number], { name: Name }>["type"]>,
      any,
      InferValue<Extract<FieldsArray[number], { name: Name }>["type"]>
    >,
    Extract<FieldsArray[number], { name: Name }>["optional"]
  >;
};

export const fieldsZodResolvedObject = <
  FieldsArray extends TupleOfLength<
    FieldOptions<any, z.ZodTypeAny, any, any>,
    1
  >
>(
  fields: FieldsArray
) =>
  fromPairs(
    fields.map(({ name, optional, type: { zodResolved } }) => [
      name,
      optional ? z.optional(zodResolved) : zodResolved,
    ])
  ) as FieldsZodResolvedObject<FieldsArray>;

export const fieldsMock =
  <
    Names extends string,
    FieldsArray extends TupleOfLength<
      FieldOptions<Names, z.ZodTypeAny, any, any>,
      1
    >
  >(
    fields: FieldsArray
  ) =>
  (faker: Faker, path = "") =>
    fromPairs(
      fields.map(({ name, type: { mock } }) => [
        name,
        mock(faker, `${path}.${name}`),
      ])
    ) as z.input<z.ZodObject<FieldsZodObject<FieldsArray>>>;

export type Preview<
  Value extends { [key: string]: unknown },
  Select extends NonNullable<PreviewConfig["select"]>
> =
  | {
      prepare: (
        object: Merge<
          Value,
          {
            [field in keyof Select]: unknown;
          }
        >,
        viewOptions?: PrepareViewOptions
      ) => PreviewValue;
      select?: Select;
    }
  | {
      select: PreviewValue;
    };

export const fieldsSchema = <
  Names extends string,
  FieldsArray extends TupleOfLength<
    FieldOptions<Names, z.ZodTypeAny, any, any>,
    1
  >,
  Value extends { [key: string]: unknown },
  Select extends NonNullable<PreviewConfig["select"]>
>(
  fields: FieldsArray,
  previewDef?: Preview<Value, Select> | undefined
) => ({
  fields: fields.map(({ name, type, optional, ...props }) => {
    const schema = type.schema();

    const { validation } = schema;

    return {
      ...schema,
      ...props,
      name,
      validation: flow(
        (rule) => (optional ? rule : rule.required()),
        (rule) => validation?.(rule) ?? rule
      ),
    };
  }),
  preview: !previewDef
    ? undefined
    : !("prepare" in previewDef)
    ? (previewDef as PreviewConfig)
    : {
        ...(previewDef as Pick<PreviewConfig, "prepare">),
        select: {
          ...fromPairs(fields.map(({ name }) => [name, name])),
          ...previewDef.select,
        },
      },
});

// TODO sharedFields needs documentation
export const sharedFields = <
  Names extends string,
  Zods extends z.ZodTypeAny,
  ResolvedValues,
  Optionals extends boolean,
  FieldsArray extends TupleOfLength<
    FieldOptions<Names, Zods, ResolvedValues, Optionals>,
    1
  >
>(
  fields: FieldsArray
) => fields;
