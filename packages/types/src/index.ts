import type { PortableTextBlock } from "@portabletext/types";
import type {
  ArrayDefinition as ArrayDefinitionNative,
  ArrayOfEntry,
  BlockDefinition as BlockDefinitionNative,
  BooleanDefinition,
  CrossDatasetReferenceDefinition,
  DateDefinition,
  DatetimeDefinition,
  DocumentDefinition as DocumentDefinitionNative,
  FileDefinition,
  GeopointDefinition,
  ImageDefinition,
  InitialValueProperty,
  NumberDefinition,
  ObjectDefinition as ObjectDefinitionNative,
  ReferenceDefinition,
  RuleDef,
  SanityDocument,
  SlugDefinition,
  StringDefinition,
  TextDefinition,
  UrlDefinition,
  ValidationBuilder,
} from "@sanity/types";
import type { Merge, RemoveIndexSignature, Simplify } from "type-fest";

import type { TupleOfLength } from "./utils";

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

type ArrayRule<TArrayValue> = RuleDef<ArrayRule<TArrayValue>, TArrayValue>;

type ArrayDefinition<
  MemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>,
  ArrayValue = InferValue<MemberDefinitions[number]>[]
> = Merge<
  ArrayDefinitionNative,
  DefinitionWithValue<ArrayValue, ArrayRule<ArrayValue>> & {
    of: MemberDefinitions;
  }
>;

type ObjectRule<TObjectValue> = RuleDef<ObjectRule<TObjectValue>, TObjectValue>;

type ObjectDefinition<
  FieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  ObjectValue = {
    [Name in FieldDefinitions[number]["name"]]: InferValue<
      Extract<FieldDefinitions[number], { name: Name }>
    >;
  }
> = Merge<
  ObjectDefinitionNative,
  DefinitionWithValue<ObjectValue, ObjectRule<ObjectValue>> & {
    fields: FieldDefinitions;
  }
>;

type DocumentRule<TDocumentValue> = RuleDef<
  DocumentRule<TDocumentValue>,
  TDocumentValue
>;

type DocumentDefinition<
  FieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  DocumentValue = Simplify<
    RemoveIndexSignature<SanityDocument> & {
      [Name in FieldDefinitions[number]["name"]]: InferValue<
        Extract<FieldDefinitions[number], { name: Name }>
      >;
    }
  >
> = Merge<
  DocumentDefinitionNative,
  DefinitionWithValue<DocumentValue, DocumentRule<DocumentValue>> & {
    fields: FieldDefinitions;
  }
>;

type Definition<
  Name extends string,
  FieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  MemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> =
  | (ArrayDefinition<MemberDefinitions> & { name: Name })
  | (BlockDefinition & { name: Name })
  | (BooleanDefinition & { name: Name })
  | (CrossDatasetReferenceDefinition & { name: Name })
  | (DateDefinition & { name: Name })
  | (DatetimeDefinition & { name: Name })
  | (DocumentDefinition<FieldDefinitions> & { name: Name })
  | (FileDefinition & { name: Name })
  | (GeopointDefinition & { name: Name })
  | (ImageDefinition & { name: Name })
  | (NumberDefinition & { name: Name })
  | (ObjectDefinition<FieldDefinitions> & { name: Name })
  | (ReferenceDefinition & { name: Name })
  | (SlugDefinition & { name: Name })
  | (StringDefinition & { name: Name })
  | (TextDefinition & { name: Name })
  | (UrlDefinition & { name: Name });

type ArrayMemberDefinition<
  FieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = {
  [TType in Definition<any, FieldDefinitions, any>["type"]]: ArrayOfEntry<
    Extract<Definition<any, FieldDefinitions, any>, { type: TType }>
  >;
}[Exclude<Definition<any, FieldDefinitions, any>["type"], "array">];

export const defineArrayMember = <
  TType extends ArrayMemberDefinition<any>["type"],
  FieldDefinitions extends TupleOfLength<{ name: string }, 1>
>(
  arrayOfSchema: Extract<
    ArrayMemberDefinition<FieldDefinitions>,
    { type: TType }
  >
) => arrayOfSchema;

export const defineField = <
  TType extends Definition<any, any, any>["type"],
  Name extends string,
  FieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  MemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
>(
  schemaField: Extract<
    Definition<Name, FieldDefinitions, MemberDefinitions>,
    { type: TType }
  >
) => schemaField;
