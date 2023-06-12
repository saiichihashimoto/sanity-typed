import type { PortableTextBlock } from "@portabletext/types";
import type {
  ArrayDefinition as ArrayDefinitionNative,
  ArrayOfEntry,
  BlockDefinition as BlockDefinitionNative,
  BooleanDefinition,
  CrossDatasetReferenceDefinition,
  DateDefinition,
  DatetimeDefinition,
  DefineSchemaOptions,
  DocumentDefinition as DocumentDefinitionNative,
  EmailDefinition,
  FieldDefinitionBase,
  FileDefinition as FileDefinitionNative,
  FileValue as FileValueNative,
  GeopointDefinition,
  ImageDefinition as ImageDefinitionNative,
  ImageValue as ImageValueNative,
  InitialValueProperty,
  IntrinsicTypeName,
  MaybeAllowUnknownProps,
  NarrowPreview,
  NumberDefinition,
  ObjectDefinition as ObjectDefinitionNative,
  ReferenceDefinition,
  RuleDef,
  SanityDocument,
  SlugDefinition,
  StrictDefinition,
  StringDefinition,
  TextDefinition,
  TypeAliasDefinition,
  UrlDefinition,
  ValidationBuilder,
} from "@sanity/types";
import {
  defineArrayMember as defineArrayMemberNative,
  defineField as defineFieldNative,
  defineType as defineTypeNative,
} from "@sanity/types";
import type { Merge, RemoveIndexSignature, Simplify } from "type-fest";

import type { TupleOfLength } from "./utils";

type TypedValueRule<Value> = RuleDef<TypedValueRule<Value>, Value>;

type DefinitionWithValue<
  Value,
  Rule extends RuleDef<Rule, Value> = TypedValueRule<Value>
> = {
  initialValue?: InitialValueProperty<any, Value>;
  validation?: ValidationBuilder<Rule, Value>;
};

export type InferValue<Def> = Def extends DefinitionWithValue<infer Value, any>
  ? Value
  : unknown;

type BlockRule = RuleDef<BlockRule, PortableTextBlock>;

export type BlockDefinition = Merge<
  BlockDefinitionNative,
  DefinitionWithValue<PortableTextBlock, BlockRule>
>;

type ArrayRule<ArrayValue> = RuleDef<ArrayRule<ArrayValue>, ArrayValue>;

type ArrayValue<
  // TODO Type TMemberDefinitions to fit defineArrayMember exactly
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> = Simplify<
  InferValue<TMemberDefinitions[number]> extends { [key: string]: any }
    ? Simplify<InferValue<TMemberDefinitions[number]> & { _key: string }>
    : InferValue<TMemberDefinitions[number]>
>[];

export type ArrayDefinition<
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> = Merge<
  ArrayDefinitionNative,
  DefinitionWithValue<
    ArrayValue<TMemberDefinitions>,
    ArrayRule<ArrayValue<TMemberDefinitions>>
  > & {
    of: TMemberDefinitions;
  }
>;

type ObjectRule<ObjectValue> = RuleDef<ObjectRule<ObjectValue>, ObjectValue>;

type ObjectValue<
  // TODO Type TFieldDefinitions to fit defineField exactly
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = {
  [Name in TFieldDefinitions[number]["name"]]?: InferValue<
    Extract<TFieldDefinitions[number], { name: Name }>
  >;
};

export type ObjectDefinition<
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Merge<
  ObjectDefinitionNative,
  DefinitionWithValue<
    ObjectValue<TFieldDefinitions>,
    ObjectRule<ObjectValue<TFieldDefinitions>>
  > & {
    fields: TFieldDefinitions;
  }
>;

type DocumentRule<DocumentValue> = RuleDef<
  DocumentRule<DocumentValue>,
  DocumentValue
>;

type DocumentValue<
  // TODO Type TFieldDefinitions to fit defineField exactly
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Simplify<
  ObjectValue<TFieldDefinitions> & RemoveIndexSignature<SanityDocument>
>;

export type DocumentDefinition<
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Merge<
  DocumentDefinitionNative,
  DefinitionWithValue<
    DocumentValue<TFieldDefinitions>,
    DocumentRule<DocumentValue<TFieldDefinitions>>
  > & {
    fields: TFieldDefinitions;
  }
>;

type FileRule<FileValue> = RuleDef<FileRule<FileValue>, FileValue>;

type FileValue<
  // TODO Type TFieldDefinitions to fit defineField exactly
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Simplify<
  ObjectValue<TFieldDefinitions> & RemoveIndexSignature<FileValueNative>
>;

type FileDefinition<
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Merge<
  FileDefinitionNative,
  DefinitionWithValue<
    FileValue<TFieldDefinitions>,
    FileRule<FileValue<TFieldDefinitions>>
  > & {
    fields?: TFieldDefinitions;
  }
>;

type ImageRule<ImageValue> = RuleDef<ImageRule<ImageValue>, ImageValue>;

type ImageValue<
  // TODO Type TFieldDefinitions to fit defineField exactly
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Simplify<
  ObjectValue<TFieldDefinitions> & RemoveIndexSignature<ImageValueNative>
>;

type ImageDefinition<
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Merge<
  ImageDefinitionNative,
  DefinitionWithValue<
    ImageValue<TFieldDefinitions>,
    ImageRule<ImageValue<TFieldDefinitions>>
  > & {
    fields?: TFieldDefinitions;
  }
>;

type IntrinsicDefinitions<
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> = {
  array: ArrayDefinition<TMemberDefinitions>;
  block: BlockDefinition;
  boolean: BooleanDefinition;
  crossDatasetReference: CrossDatasetReferenceDefinition;
  date: DateDefinition;
  datetime: DatetimeDefinition;
  document: DocumentDefinition<TFieldDefinitions>;
  email: EmailDefinition;
  file: FileDefinition<TFieldDefinitions>;
  geopoint: GeopointDefinition;
  image: ImageDefinition<TFieldDefinitions>;
  number: NumberDefinition;
  object: ObjectDefinition<TFieldDefinitions>;
  reference: ReferenceDefinition;
  slug: SlugDefinition;
  string: StringDefinition;
  text: TextDefinition;
  url: UrlDefinition;
};

type IntrinsicBase<
  TName extends string,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> = {
  [K in keyof IntrinsicDefinitions<
    TFieldDefinitions,
    TMemberDefinitions
  >]: Omit<
    IntrinsicDefinitions<TFieldDefinitions, TMemberDefinitions>[K] & {
      name: TName;
    },
    "preview"
  >;
}[keyof IntrinsicDefinitions<TFieldDefinitions, TMemberDefinitions>];

type DefineSchemaBase<
  TType extends IntrinsicTypeName,
  TName extends string,
  TAlias extends IntrinsicTypeName | undefined,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
> = TType extends IntrinsicTypeName
  ? Extract<
      IntrinsicBase<TName, TFieldDefinitions, TMemberDefinitions>,
      { type: TType }
    >
  : TypeAliasDefinition<TType, TAlias>;

export const defineField = <
  TType extends IntrinsicTypeName,
  TName extends string,
  TSelect extends { [key: string]: string } | undefined,
  TPrepareValue extends { [key in keyof TSelect]: any } | undefined,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
>(
  schemaField: DefineSchemaBase<
    TType,
    TName,
    TAlias,
    TFieldDefinitions,
    TMemberDefinitions
  > &
    FieldDefinitionBase &
    MaybeAllowUnknownProps<TStrict> &
    NarrowPreview<TType, TAlias, TSelect, TPrepareValue>,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) => defineFieldNative(schemaField as any, defineOptions) as typeof schemaField;

export const defineType = <
  TType extends IntrinsicTypeName,
  TName extends string,
  TSelect extends { [key: string]: string } | undefined,
  TPrepareValue extends { [key in keyof TSelect]: any } | undefined,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionWithValue<any, any>, 1>
>(
  schemaDefinition: DefineSchemaBase<
    TType,
    TName,
    TAlias,
    TFieldDefinitions,
    TMemberDefinitions
  > &
    MaybeAllowUnknownProps<TStrict> &
    NarrowPreview<TType, TAlias, TSelect, TPrepareValue>,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineTypeNative(
    schemaDefinition as any,
    defineOptions
  ) as typeof schemaDefinition;

type IntrinsicArrayOfBase<
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = {
  [K in keyof IntrinsicDefinitions<TFieldDefinitions, any>]: Omit<
    ArrayOfEntry<IntrinsicDefinitions<TFieldDefinitions, any>[K]>,
    "preview"
  >;
}[keyof IntrinsicDefinitions<TFieldDefinitions, any>];

type DefineArrayMemberBase<
  TType extends IntrinsicTypeName,
  TAlias extends IntrinsicTypeName | undefined,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = TType extends IntrinsicTypeName
  ? Extract<IntrinsicArrayOfBase<TFieldDefinitions>, { type: TType }>
  : ArrayOfEntry<TypeAliasDefinition<string, TAlias>>;

export const defineArrayMember = <
  TType extends IntrinsicTypeName,
  TName extends string,
  TSelect extends { [key: string]: string } | undefined,
  TPrepareValue extends { [key in keyof TSelect]: any } | undefined,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
>(
  arrayOfSchema: DefineArrayMemberBase<TType, TAlias, TFieldDefinitions> &
    MaybeAllowUnknownProps<TStrict> &
    NarrowPreview<TType, TAlias, TSelect, TPrepareValue> & {
      name?: TName;
    },
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineArrayMemberNative(
    arrayOfSchema as any,
    defineOptions
  ) as typeof arrayOfSchema;
