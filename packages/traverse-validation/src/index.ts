import { omit } from "lodash/fp";
import type { UnionToIntersection } from "type-fest";

import type { IntrinsicTypeName } from "@sanity-typed/types";
import type {
  ArrayMemberDefinition,
  FieldDefinition,
  GetOriginalRule,
  TypeDefinition,
} from "@sanity-typed/types/src/internal";
import type { MaybeArray } from "@sanity-typed/utils";

type SchemaTypeDefinition<TType extends string> =
  | ArrayMemberDefinition<TType, any, any, any, any, any, any, any, any>
  | FieldDefinition<TType, any, any, any, any, any, any, any, any>
  | TypeDefinition<TType, any, any, any, any, any, any, any>;

type ArgsObject = {
  [key in keyof UnionToIntersection<
    GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
  >]?: any[];
};

export const traverseValidation = <
  TSchemaType extends SchemaTypeDefinition<any>
>({
  validation,
}: TSchemaType) => {
  // https://sanity-io-land.slack.com/archives/C9Z7RC3V1/p1695660296907819?thread_ts=1695522767.850489&cid=C9Z7RC3V1
  const Rule = (value: ArgsObject) => {
    const rule = {
      value,
      error: () => rule,
      warning: () => Rule({}),
      custom: (...args: any[]) => Rule({ ...value, custom: args }),
      email: (...args: any[]) => Rule({ ...value, email: args }),
      greaterThan: (...args: any[]) => Rule({ ...value, greaterThan: args }),
      lessThan: (...args: any[]) => Rule({ ...value, lessThan: args }),
      regex: (...args: any[]) => Rule({ ...value, regex: args }),
      required: (...args: any[]) => Rule({ ...value, required: args }),
      unique: (...args: any[]) => Rule({ ...value, unique: args }),
      uri: (...args: any[]) => Rule({ ...value, uri: args }),
      integer: (...args: any[]) =>
        Rule({
          ...omit(["precision"], value),
          integer: args,
        }),
      precision: (...args: any[]) =>
        Rule({
          ...omit(["integer"], value),
          precision: args,
        }),
      max: (...args: any[]) => Rule({ ...value, max: args }),
      min: (...args: any[]) => Rule({ ...value, min: args }),
      length: (...args: any[]) =>
        Rule({
          ...value,
          min: args,
          max: args,
        }),
      lowercase: (...args: any[]) =>
        Rule({
          ...omit(["uppercase"], value),
          lowercase: args,
        }),
      uppercase: (...args: any[]) =>
        Rule({
          ...omit(["lowercase"], value),
          uppercase: args,
        }),
      negative: (...args: any[]) =>
        Rule({
          ...omit(["positive"], value),
          negative: args,
        }),
      positive: (...args: any[]) =>
        Rule({
          ...omit(["negative"], value),
          positive: args,
        }),
      valueOfField: () => ({
        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/336
        path: "",
        type: Symbol("TODO"),
      }),
    } as unknown as UnionToIntersection<
      GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
    > & {
      value: ArgsObject;
    };

    return rule;
  };

  const rule = validation?.(
    // @ts-expect-error -- This type is technically impossible, mainly because custom is conflicting across everything
    Rule({})
  ) as unknown as
    | MaybeArray<
        UnionToIntersection<
          GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
        > & {
          value: ArgsObject;
        }
      >
    | undefined;

  return !rule
    ? {}
    : (Array.isArray(rule) ? rule : [rule])
        .map(({ value }) => value)
        .reduce((acc, current) => ({ ...acc, ...current }));
};
