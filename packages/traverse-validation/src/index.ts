import type { UnionToIntersection } from "type-fest";

import type { IntrinsicTypeName } from "@sanity-typed/types";
import type {
  ArrayMemberDefinition,
  FieldDefinition,
  GetOriginalRule,
  TypeDefinition,
} from "@sanity-typed/types/src/internal";

type SchemaTypeDefinition<TType extends string> =
  | ArrayMemberDefinition<TType, any, any, any, any, any, any, any, any>
  | FieldDefinition<TType, any, any, any, any, any, any, any, any>
  | TypeDefinition<TType, any, any, any, any, any, any, any>;

export const traverseValidation = <
  TSchemaType extends SchemaTypeDefinition<any>
>({
  validation,
}: TSchemaType) => {
  /* eslint-disable fp/no-let,fp/no-mutation,fp/no-unused-expression -- mutation */
  let value: {
    [key in keyof UnionToIntersection<
      GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
    >]?: any[][];
  } = {};

  const rule = {
    custom: (...args: any[]) => {
      value = { ...value, custom: [...(value.custom ?? []), args] };
      return rule;
    },
    email: () => {
      value = { ...value, email: [...(value.email ?? []), []] };
      return rule;
    },
    error: (...args: any[]) => {
      value = { ...value, error: [...(value.error ?? []), args] };
      return rule;
    },
    greaterThan: (...args: any[]) => {
      value = { ...value, greaterThan: [...(value.greaterThan ?? []), args] };
      return rule;
    },
    integer: () => {
      value = { ...value, integer: [...(value.integer ?? []), []] };
      return rule;
    },
    length: (...args: any[]) => {
      value = { ...value, length: [...(value.length ?? []), args] };
      return rule;
    },
    lessThan: (...args: any[]) => {
      value = { ...value, lessThan: [...(value.lessThan ?? []), args] };
      return rule;
    },
    lowercase: () => {
      value = { ...value, lowercase: [...(value.lowercase ?? []), []] };
      return rule;
    },
    max: (...args: any[]) => {
      value = { ...value, max: [...(value.max ?? []), args] };
      return rule;
    },
    min: (...args: any[]) => {
      value = { ...value, min: [...(value.min ?? []), args] };
      return rule;
    },
    negative: () => {
      value = { ...value, negative: [...(value.negative ?? []), []] };
      return rule;
    },
    positive: () => {
      value = { ...value, positive: [...(value.positive ?? []), []] };
      return rule;
    },
    precision: (...args: any[]) => {
      value = { ...value, precision: [...(value.precision ?? []), args] };
      return rule;
    },
    regex: (...args: any[]) => {
      value = { ...value, regex: [...(value.regex ?? []), args] };
      return rule;
    },
    required: () => {
      value = { ...value, required: [...(value.required ?? []), []] };
      return rule;
    },
    unique: () => {
      value = { ...value, unique: [...(value.unique ?? []), []] };
      return rule;
    },
    uppercase: () => {
      value = { ...value, uppercase: [...(value.uppercase ?? []), []] };
      return rule;
    },
    uri: (...args: any[]) => {
      value = { ...value, uri: [...(value.uri ?? []), args] };
      return rule;
    },
    // TODO Handle rule arrays, especially with warnings
    warning: (...args: any[]) => {
      value = { ...value, warning: [...(value.warning ?? []), args] };
      return rule;
    },
    valueOfField: () => ({
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/336
      path: "",
      type: Symbol("TODO"),
    }),
  } as unknown as UnionToIntersection<
    GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
  >;

  validation?.(
    // @ts-expect-error -- TODO Honestly, idk
    rule
  );

  /* eslint-enable fp/no-let,fp/no-mutation,fp/no-unused-expression */

  return value as {
    [key in keyof GetOriginalRule<TSchemaType>]?: Parameters<
      GetOriginalRule<TSchemaType>[key]
    >[];
  };
};
