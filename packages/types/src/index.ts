import type { PortableTextBlock } from "@portabletext/types";
import type {
  ArrayDefinition as ArrayDefinitionNative,
  ArrayOfEntry,
  BlockDefinition as BlockDefinitionNative,
  BooleanDefinition,
  CrossDatasetReferenceDefinition,
  DateDefinition,
  DatetimeDefinition,
  DocumentDefinition,
  FileDefinition,
  GeopointDefinition,
  ImageDefinition,
  InitialValueProperty,
  NumberDefinition,
  ObjectDefinition,
  ReferenceDefinition,
  RuleDef,
  SlugDefinition,
  StringDefinition,
  TextDefinition,
  UrlDefinition,
  ValidationBuilder,
} from "@sanity/types";
import type { Merge } from "type-fest";

import type {TupleOfLength} from "./utils";

type TypedValueRule<Value> = RuleDef<TypedValueRule<Value>, Value>;

type DefinitionWithValue<
  TValue,
  Rule extends RuleDef<Rule, TValue> = TypedValueRule<TValue>
> = {
  initialValue?: InitialValueProperty<any, TValue>;
  validation?: ValidationBuilder<Rule, TValue>;
};

export type InferValue<T> = T extends DefinitionWithValue<infer Value, any>
  ? Value
  : unknown;

type BlockRule = RuleDef<BlockRule, PortableTextBlock>;

type BlockDefinition = Merge<
  BlockDefinitionNative,
  DefinitionWithValue<PortableTextBlock, BlockRule>
>;

type ArrayRule<TArrayValue extends any[]> = RuleDef<
  ArrayRule<TArrayValue>,
  TArrayValue
>;

type ArrayDefinition<
  MemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>,
  ArrayValue = InferValue<MemberDefinitions[number]>
> = Merge<
  ArrayDefinitionNative,
  DefinitionWithValue<ArrayValue[], ArrayRule<ArrayValue[]>> & {
    of: MemberDefinitions;
  }
>;

type Definition<
  MemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> =
  | ArrayDefinition<MemberDefinitions>
  | BlockDefinition
  | BooleanDefinition
  | CrossDatasetReferenceDefinition
  | DateDefinition
  | DatetimeDefinition
  | DocumentDefinition
  | FileDefinition
  | GeopointDefinition
  | ImageDefinition
  | NumberDefinition
  | ObjectDefinition
  | ReferenceDefinition
  | SlugDefinition
  | StringDefinition
  | TextDefinition
  | UrlDefinition;

type ArrayMemberDefinition = {
  [TType in Definition<any>["type"]]: ArrayOfEntry<
    Extract<Definition<any>, { type: TType }>
  >;
}[Exclude<Definition<any>["type"], "array">];

export const defineArrayMember = <TType extends ArrayMemberDefinition["type"]>(
  arrayOfSchema: Extract<ArrayMemberDefinition, { type: TType }>
) => arrayOfSchema;

export const defineField = <
  TType extends Definition<any>["type"],
  MemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
>(
  arrayOfSchema: Extract<Definition<MemberDefinitions>, { type: TType }>
) => arrayOfSchema;
