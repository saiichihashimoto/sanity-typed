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
  // https://sanity-io-land.slack.com/archives/C9Z7RC3V1/p1695660296907819?thread_ts=1695522767.850489&cid=C9Z7RC3V1
  // Only the last invocation of any method matters, so we can just overwrite the value each time
  /* eslint-disable fp/no-let,fp/no-mutation,fp/no-unused-expression -- mutation */
  let value: {
    [key in keyof UnionToIntersection<
      GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
    >]?: any[];
  } = {};

  const rule = {
    custom: (...args: any[]) => {
      value = { ...value, custom: args };
      return rule;
    },
    email: (...args: any[]) => {
      value = { ...value, email: args };
      return rule;
    },
    error: (...args: any[]) => {
      value = { ...value, error: args };
      return rule;
    },
    greaterThan: (...args: any[]) => {
      value = { ...value, greaterThan: args };
      return rule;
    },
    integer: (...args: any[]) => {
      value = { ...value, integer: args };
      return rule;
    },
    length: (...args: any[]) => {
      value = { ...value, length: args };
      return rule;
    },
    lessThan: (...args: any[]) => {
      value = { ...value, lessThan: args };
      return rule;
    },
    lowercase: (...args: any[]) => {
      value = { ...value, lowercase: args };
      return rule;
    },
    max: (...args: any[]) => {
      value = { ...value, max: args };
      return rule;
    },
    min: (...args: any[]) => {
      value = { ...value, min: args };
      return rule;
    },
    negative: (...args: any[]) => {
      value = { ...value, negative: args };
      return rule;
    },
    positive: (...args: any[]) => {
      value = { ...value, positive: args };
      return rule;
    },
    precision: (...args: any[]) => {
      value = { ...value, precision: args };
      return rule;
    },
    regex: (...args: any[]) => {
      value = { ...value, regex: args };
      return rule;
    },
    required: (...args: any[]) => {
      value = { ...value, required: args };
      return rule;
    },
    unique: (...args: any[]) => {
      value = { ...value, unique: args };
      return rule;
    },
    uppercase: (...args: any[]) => {
      value = { ...value, uppercase: args };
      return rule;
    },
    uri: (...args: any[]) => {
      value = { ...value, uri: args };
      return rule;
    },
    // TODO Handle rule arrays, especially with warnings
    warning: (...args: any[]) => {
      value = { ...value, warning: args };
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
    // @ts-expect-error -- This type is technically impossible, mainly because custom is conflicting across everything
    rule
  );

  /* eslint-enable fp/no-let,fp/no-mutation,fp/no-unused-expression */

  return value as {
    [key in keyof GetOriginalRule<TSchemaType>]?: Parameters<
      GetOriginalRule<TSchemaType>[key]
    >;
  };
};
