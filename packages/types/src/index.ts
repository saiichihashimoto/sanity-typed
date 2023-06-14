import type { PortableTextBlock } from "@portabletext/types";
import type {
  ArrayDefinition as ArrayDefinitionNative,
  ArrayOfEntry,
  BlockDefinition as BlockDefinitionNative,
  BooleanDefinition as BooleanDefinitionNative,
  CrossDatasetReferenceDefinition,
  DateDefinition as DateDefinitionNative,
  DatetimeDefinition as DatetimeDefinitionNative,
  DefineSchemaOptions,
  DocumentDefinition as DocumentDefinitionNative,
  EmailDefinition as EmailDefinitionNative,
  FieldDefinitionBase,
  FileDefinition as FileDefinitionNative,
  FileValue as FileValueNative,
  GeopointDefinition as GeopointDefinitionNative,
  GeopointValue,
  ImageDefinition as ImageDefinitionNative,
  ImageValue as ImageValueNative,
  IntrinsicTypeName,
  MaybeAllowUnknownProps,
  NarrowPreview,
  NumberDefinition as NumberDefinitionNative,
  ObjectDefinition as ObjectDefinitionNative,
  ReferenceDefinition as ReferenceDefinitionNative,
  ReferenceValue,
  RuleDef,
  SanityDocument,
  SlugDefinition as SlugDefinitionNative,
  SlugValue,
  StrictDefinition,
  StringDefinition as StringDefinitionNative,
  TextDefinition as TextDefinitionNative,
  TypeAliasDefinition,
  UrlDefinition as UrlDefinitionNative,
} from "sanity";
import {
  defineArrayMember as defineArrayMemberNative,
  defineField as defineFieldNative,
  defineType as defineTypeNative,
} from "sanity";
import type { Merge, RemoveIndexSignature, Simplify } from "type-fest";

import type { TupleOfLength } from "./utils";

declare const requiredSymbol: unique symbol;

type WithRequired<
  TRequired extends boolean,
  Rule extends RuleDef<Rule, any>
> = Merge<
  Rule,
  {
    required: () => WithRequired<true, Rule>;
    [requiredSymbol]: TRequired;
  }
>;

type WithValue<Value> = RuleDef<WithValue<Value>, Value>;

type ValidationBuilder<
  TRequired extends boolean,
  Value,
  Rule extends RuleDef<Rule, Value>
> = (
  rule: WithRequired<false, Rule>
) =>
  | WithRequired<TRequired | false, Rule>
  | WithRequired<TRequired | false, Rule>[];

type DefinitionBase<
  TRequired extends boolean,
  Value,
  Rule extends RuleDef<Rule, Value> = RuleDef<WithValue<Value>, Value>
> = {
  validation?: ValidationBuilder<TRequired, Value, Rule>;
};

export type InferValue<Def> = Def extends DefinitionBase<any, infer Value, any>
  ? Value
  : unknown;

export type BlockDefinition<TRequired extends boolean> = Merge<
  BlockDefinitionNative,
  DefinitionBase<TRequired, PortableTextBlock>
>;

export type BooleanDefinition<TRequired extends boolean> = Merge<
  BooleanDefinitionNative,
  DefinitionBase<TRequired, boolean>
>;

export type DateDefinition<TRequired extends boolean> = Merge<
  DateDefinitionNative,
  DefinitionBase<TRequired, string>
>;

export type DatetimeDefinition<TRequired extends boolean> = Merge<
  DatetimeDefinitionNative,
  DefinitionBase<TRequired, string>
>;

export type EmailDefinition<TRequired extends boolean> = Merge<
  EmailDefinitionNative,
  DefinitionBase<TRequired, string>
>;

export type GeopointDefinition<TRequired extends boolean> = Merge<
  GeopointDefinitionNative,
  DefinitionBase<TRequired, Omit<GeopointValue, "_type">>
>;

export type NumberDefinition<TRequired extends boolean> = Merge<
  NumberDefinitionNative,
  DefinitionBase<TRequired, number>
>;

export type ReferenceDefinition<TRequired extends boolean> = Merge<
  ReferenceDefinitionNative,
  DefinitionBase<TRequired, Omit<ReferenceValue, "_type">>
>;

export type SlugDefinition<TRequired extends boolean> = Merge<
  SlugDefinitionNative,
  DefinitionBase<TRequired, Omit<SlugValue, "_type">>
>;

export type StringDefinition<TRequired extends boolean> = Merge<
  StringDefinitionNative,
  DefinitionBase<TRequired, string>
>;

export type TextDefinition<TRequired extends boolean> = Merge<
  TextDefinitionNative,
  DefinitionBase<TRequired, string>
>;

export type UrlDefinition<TRequired extends boolean> = Merge<
  UrlDefinitionNative,
  DefinitionBase<TRequired, string>
>;

type ArrayValue<
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>
> = Simplify<
  InferValue<TMemberDefinitions[number]> extends { [key: string]: any }
    ? Simplify<InferValue<TMemberDefinitions[number]> & { _key: string }>
    : InferValue<TMemberDefinitions[number]>
>[];

export type ArrayDefinition<
  TRequired extends boolean,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>
> = Merge<
  ArrayDefinitionNative,
  DefinitionBase<TRequired, ArrayValue<TMemberDefinitions>> & {
    of: TMemberDefinitions;
  }
>;

type ObjectValue<TFieldDefinitions extends { name: string }[]> = Simplify<
  {
    [Name in Extract<
      TFieldDefinitions[number],
      { [requiredSymbol]?: false }
    >["name"]]?: InferValue<Extract<TFieldDefinitions[number], { name: Name }>>;
  } & {
    [Name in Extract<
      TFieldDefinitions[number],
      { [requiredSymbol]?: true }
    >["name"]]: InferValue<Extract<TFieldDefinitions[number], { name: Name }>>;
  }
>;

export type ObjectDefinition<
  TRequired extends boolean,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Merge<
  ObjectDefinitionNative,
  DefinitionBase<TRequired, ObjectValue<TFieldDefinitions>> & {
    fields: TFieldDefinitions;
  }
>;

type DocumentValue<
  TType extends string,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Simplify<
  ObjectValue<TFieldDefinitions> &
    RemoveIndexSignature<SanityDocument> & { _type: TType }
>;

export type DocumentDefinition<
  TName extends string,
  TRequired extends boolean,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = Merge<
  DocumentDefinitionNative,
  DefinitionBase<TRequired, DocumentValue<TName, TFieldDefinitions>> & {
    fields: TFieldDefinitions;
  }
>;

export type FileValue<TFieldDefinitions extends { name: string }[] = []> =
  Simplify<
    ObjectValue<TFieldDefinitions> & RemoveIndexSignature<FileValueNative>
  >;

type FileDefinition<
  TRequired extends boolean,
  TFieldDefinitions extends { name: string }[]
> = Merge<
  FileDefinitionNative,
  DefinitionBase<TRequired, FileValue<TFieldDefinitions>> & {
    fields?: TFieldDefinitions;
  }
>;

export type ImageValue<TFieldDefinitions extends { name: string }[] = []> =
  Simplify<
    ObjectValue<TFieldDefinitions> & RemoveIndexSignature<ImageValueNative>
  >;

type ImageDefinition<
  TRequired extends boolean,
  TFieldDefinitions extends { name: string }[]
> = Merge<
  ImageDefinitionNative,
  DefinitionBase<TRequired, ImageValue<TFieldDefinitions>> & {
    fields?: TFieldDefinitions;
  }
>;

type IntrinsicDefinitions<
  TName extends string,
  TRequired extends boolean,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>
> = {
  array: ArrayDefinition<TRequired, TMemberDefinitions>;
  block: BlockDefinition<TRequired>;
  boolean: BooleanDefinition<TRequired>;
  crossDatasetReference: CrossDatasetReferenceDefinition;
  date: DateDefinition<TRequired>;
  datetime: DatetimeDefinition<TRequired>;
  document: DocumentDefinition<TName, TRequired, TFieldDefinitions>;
  email: EmailDefinition<TRequired>;
  file: FileDefinition<TRequired, TFieldDefinitions>;
  geopoint: GeopointDefinition<TRequired>;
  image: ImageDefinition<TRequired, TFieldDefinitions>;
  number: NumberDefinition<TRequired>;
  object: ObjectDefinition<TRequired, TFieldDefinitions>;
  reference: ReferenceDefinition<TRequired>;
  slug: SlugDefinition<TRequired>;
  string: StringDefinition<TRequired>;
  text: TextDefinition<TRequired>;
  url: UrlDefinition<TRequired>;
};

type IntrinsicBase<
  TName extends string,
  TRequired extends boolean,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>
> = {
  [K in keyof IntrinsicDefinitions<
    TName,
    TRequired,
    TFieldDefinitions,
    TMemberDefinitions
  >]: Omit<
    IntrinsicDefinitions<
      TName,
      TRequired,
      TFieldDefinitions,
      TMemberDefinitions
    >[K] & {
      name: TName;
    },
    "preview"
  >;
}[keyof IntrinsicDefinitions<
  TName,
  TRequired,
  TFieldDefinitions,
  TMemberDefinitions
>];

type DefineSchemaBase<
  TType extends IntrinsicTypeName,
  TName extends string,
  TAlias extends IntrinsicTypeName | undefined,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>,
  TRequired extends boolean
> = (TType extends IntrinsicTypeName
  ? Extract<
      IntrinsicBase<TName, TRequired, TFieldDefinitions, TMemberDefinitions>,
      { type: TType }
    >
  : TypeAliasDefinition<TType, TAlias>) & {
  [requiredSymbol]?: TRequired;
};

export const defineField = <
  TType extends IntrinsicTypeName,
  TName extends string,
  TSelect extends { [key: string]: string } | undefined,
  TPrepareValue extends { [key in keyof TSelect]: any } | undefined,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>,
  TRequired extends boolean = false
>(
  schemaField: DefineSchemaBase<
    TType,
    TName,
    TAlias,
    TFieldDefinitions,
    TMemberDefinitions,
    TRequired
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
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>,
  TRequired extends boolean = false
>(
  schemaDefinition: DefineSchemaBase<
    TType,
    TName,
    TAlias,
    TFieldDefinitions,
    TMemberDefinitions,
    TRequired
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
  [K in keyof IntrinsicDefinitions<any, any, TFieldDefinitions, any>]: Omit<
    ArrayOfEntry<IntrinsicDefinitions<any, any, TFieldDefinitions, any>[K]>,
    "preview"
  >;
}[keyof IntrinsicDefinitions<any, any, TFieldDefinitions, any>];

type DefineArrayMemberBase<
  TType extends IntrinsicTypeName,
  TAlias extends IntrinsicTypeName | undefined,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
> = TType extends "document"
  ? never
  : TType extends IntrinsicTypeName
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
