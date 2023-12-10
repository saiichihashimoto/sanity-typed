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
  | ArrayMemberDefinition<
      TType,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  | FieldDefinition<
      TType,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  | TypeDefinition<TType, any, any, any, any, any, any, any, any, any, any>;

type ArgsObject = {
  [key in keyof UnionToIntersection<
    GetOriginalRule<SchemaTypeDefinition<IntrinsicTypeName>>
  >]?: any[][];
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
      custom: (...args: any[]) =>
        Rule({ ...value, custom: [...(value.custom ?? []), args] }),
      email: (...args: any[]) =>
        Rule({ ...value, email: [...(value.email ?? []), args] }),
      greaterThan: (...args: any[]) =>
        Rule({ ...value, greaterThan: [...(value.greaterThan ?? []), args] }),
      integer: (...args: any[]) =>
        Rule({ ...value, integer: [...(value.integer ?? []), args] }),
      length: (...args: any[]) =>
        Rule({ ...value, length: [...(value.length ?? []), args] }),
      lessThan: (...args: any[]) =>
        Rule({ ...value, lessThan: [...(value.lessThan ?? []), args] }),
      lowercase: (...args: any[]) =>
        Rule({ ...value, lowercase: [...(value.lowercase ?? []), args] }),
      max: (...args: any[]) =>
        Rule({ ...value, max: [...(value.max ?? []), args] }),
      min: (...args: any[]) =>
        Rule({ ...value, min: [...(value.min ?? []), args] }),
      negative: (...args: any[]) =>
        Rule({ ...value, negative: [...(value.negative ?? []), args] }),
      optional: () =>
        // Looks like the only rule that actually overwrites another one
        Rule({ ...omit("required", value) }),
      positive: (...args: any[]) =>
        Rule({ ...value, positive: [...(value.positive ?? []), args] }),
      precision: (...args: any[]) =>
        Rule({ ...value, precision: [...(value.precision ?? []), args] }),
      regex: (...args: any[]) =>
        Rule({ ...value, regex: [...(value.regex ?? []), args] }),
      required: (...args: any[]) =>
        Rule({ ...value, required: [...(value.required ?? []), args] }),
      unique: (...args: any[]) =>
        Rule({ ...value, unique: [...(value.unique ?? []), args] }),
      uppercase: (...args: any[]) =>
        Rule({ ...value, uppercase: [...(value.uppercase ?? []), args] }),
      uri: (...args: any[]) =>
        Rule({ ...value, uri: [...(value.uri ?? []), args] }),
      valueOfField: () => ({
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

  return (
    !rule
      ? {}
      : (Array.isArray(rule) ? rule : [rule])
          .map(({ value }) => value)
          .reduce((acc, current) => ({ ...acc, ...current }))
  ) as {
    [key in keyof GetOriginalRule<TSchemaType>]?: Parameters<
      GetOriginalRule<TSchemaType>[key]
    >[];
  };
};
