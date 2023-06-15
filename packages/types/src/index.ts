import type { PortableTextBlock } from "@portabletext/types";
import type {
  ArrayDefinition as ArrayDefinitionNative,
  ArrayRule,
  BlockDefinition as BlockDefinitionNative,
  BlockRule,
  BooleanDefinition as BooleanDefinitionNative,
  BooleanRule,
  ComposableOption,
  ConfigContext,
  CrossDatasetReferenceDefinition as CrossDatasetReferenceDefinitionNative,
  CrossDatasetReferenceValue as CrossDatasetReferenceValueNative,
  CustomValidator,
  DateDefinition as DateDefinitionNative,
  DateRule,
  DatetimeDefinition as DatetimeDefinitionNative,
  DatetimeRule,
  DefineSchemaOptions,
  DocumentDefinition as DocumentDefinitionNative,
  DocumentRule,
  EmailDefinition as EmailDefinitionNative,
  EmailRule,
  FieldDefinitionBase,
  FileDefinition as FileDefinitionNative,
  FileRule,
  FileValue as FileValueNative,
  GeopointDefinition as GeopointDefinitionNative,
  GeopointRule,
  GeopointValue,
  ImageDefinition as ImageDefinitionNative,
  ImageValue as ImageValueNative,
  MaybeAllowUnknownProps,
  NumberDefinition as NumberDefinitionNative,
  NumberRule,
  ObjectDefinition as ObjectDefinitionNative,
  ObjectRule,
  PreviewConfig,
  ReferenceDefinition as ReferenceDefinitionNative,
  ReferenceRule,
  ReferenceValue,
  RuleDef,
  SanityDocument,
  SchemaPluginOptions as SchemaPluginOptionsNative,
  SlugDefinition as SlugDefinitionNative,
  SlugRule,
  SlugValue,
  StrictDefinition,
  StringDefinition as StringDefinitionNative,
  StringRule,
  TextDefinition as TextDefinitionNative,
  TextRule,
  TypeAliasDefinition,
  UrlDefinition as UrlDefinitionNative,
  UrlRule,
  WorkspaceOptions as WorkspaceOptionsNative,
} from "sanity";
import {
  defineArrayMember as defineArrayMemberNative,
  defineConfig as defineConfigNative,
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
  {
    [key in keyof Rule]: Rule[key] extends (...args: infer Args) => Rule
      ? (...args: Args) => WithRequired<TRequired, Rule>
      : Rule[key];
  },
  {
    required: () => WithRequired<true, Rule>;
    [requiredSymbol]: TRequired;
  }
>;

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
  Rule extends RuleDef<Rule, Value>
> = {
  preview?: PreviewConfig;
  validation?: ValidationBuilder<TRequired, Value, Rule>;
};

export type InferValue<Def> = Def extends DefinitionBase<any, infer Value, any>
  ? Value
  : unknown;

type RewriteValue<Value, Rule extends RuleDef<Rule, any>> = Merge<
  {
    [key in keyof Rule]: Rule[key] extends (...args: infer Args) => Rule
      ? (...args: Args) => RewriteValue<Value, Rule>
      : Rule[key];
  },
  {
    custom: <LenientValue extends Value>(
      fn: CustomValidator<LenientValue | undefined>
    ) => RewriteValue<Value, Rule>;
  }
>;

export type BlockDefinition<TRequired extends boolean> = Merge<
  BlockDefinitionNative,
  DefinitionBase<
    TRequired,
    PortableTextBlock,
    RewriteValue<PortableTextBlock, BlockRule>
  >
>;

export type BooleanDefinition<TRequired extends boolean> = Merge<
  BooleanDefinitionNative,
  DefinitionBase<TRequired, boolean, BooleanRule>
>;

export type CrossDatasetReferenceValue = Merge<
  CrossDatasetReferenceValueNative,
  { _type: "crossDatasetReference" }
>;

type CrossDatasetReferenceRule = RuleDef<
  CrossDatasetReferenceRule,
  CrossDatasetReferenceValue
>;

export type CrossDatasetReferenceDefinition<TRequired extends boolean> = Merge<
  CrossDatasetReferenceDefinitionNative,
  DefinitionBase<
    TRequired,
    CrossDatasetReferenceValue,
    CrossDatasetReferenceRule
  >
>;

export type DateDefinition<TRequired extends boolean> = Merge<
  DateDefinitionNative,
  DefinitionBase<TRequired, string, DateRule>
>;

export type DatetimeDefinition<TRequired extends boolean> = Merge<
  DatetimeDefinitionNative,
  DefinitionBase<TRequired, string, DatetimeRule>
>;

export type EmailDefinition<TRequired extends boolean> = Merge<
  EmailDefinitionNative,
  DefinitionBase<TRequired, string, EmailRule>
>;

export type GeopointDefinition<TRequired extends boolean> = Merge<
  GeopointDefinitionNative,
  DefinitionBase<TRequired, Omit<GeopointValue, "_type">, GeopointRule>
>;

export type NumberDefinition<TRequired extends boolean> = Merge<
  NumberDefinitionNative,
  DefinitionBase<TRequired, number, NumberRule>
>;

export type ReferenceDefinition<TRequired extends boolean> = Merge<
  ReferenceDefinitionNative,
  DefinitionBase<TRequired, Omit<ReferenceValue, "_type">, ReferenceRule>
>;

export type SlugDefinition<TRequired extends boolean> = Merge<
  SlugDefinitionNative,
  DefinitionBase<TRequired, Omit<SlugValue, "_type">, SlugRule>
>;

export type StringDefinition<TRequired extends boolean> = Merge<
  StringDefinitionNative,
  DefinitionBase<TRequired, string, StringRule>
>;

export type TextDefinition<TRequired extends boolean> = Merge<
  TextDefinitionNative,
  DefinitionBase<TRequired, string, TextRule>
>;

export type UrlDefinition<TRequired extends boolean> = Merge<
  UrlDefinitionNative,
  DefinitionBase<TRequired, string, UrlRule>
>;

type ArrayValue<
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>
> = (InferValue<TMemberDefinitions[number]> extends { [key: string]: any }
  ? Merge<InferValue<TMemberDefinitions[number]>, { _key: string }>
  : InferValue<TMemberDefinitions[number]>)[];

export type ArrayDefinition<
  TRequired extends boolean,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>
> = Merge<
  ArrayDefinitionNative,
  DefinitionBase<
    TRequired,
    ArrayValue<TMemberDefinitions>,
    ArrayRule<ArrayValue<TMemberDefinitions>>
  > & {
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
  DefinitionBase<
    TRequired,
    ObjectValue<TFieldDefinitions>,
    RewriteValue<ObjectValue<TFieldDefinitions>, ObjectRule>
  > & {
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
  DefinitionBase<
    TRequired,
    DocumentValue<TName, TFieldDefinitions>,
    RewriteValue<DocumentValue<TName, TFieldDefinitions>, DocumentRule>
  > & {
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
  DefinitionBase<
    TRequired,
    FileValue<TFieldDefinitions>,
    RewriteValue<FileValue<TFieldDefinitions>, FileRule>
  > & {
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
  DefinitionBase<
    TRequired,
    ImageValue<TFieldDefinitions>,
    RewriteValue<ImageValue<TFieldDefinitions>, FileRule>
  > & {
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
  crossDatasetReference: CrossDatasetReferenceDefinition<TRequired>;
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

type IntrinsicTypeName = keyof IntrinsicDefinitions<any, any, any, any>;

export const defineArrayMember = <
  TType extends IntrinsicTypeName,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>
>(
  arrayOfSchema: MaybeAllowUnknownProps<TStrict> &
    (TType extends "document"
      ? never
      : TType extends IntrinsicTypeName
      ? // Why can't I just index off of IntrinsicDefinitions?
        Extract<
          {
            [K in IntrinsicTypeName]: Omit<
              IntrinsicDefinitions<any, any, TFieldDefinitions, any>[K],
              "hidden" | "name"
            >;
          }[IntrinsicTypeName],
          { type: TType }
        >
      : Omit<TypeAliasDefinition<string, TAlias>, "hidden" | "name">) & {
      name?: string;
    },
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineArrayMemberNative(
    arrayOfSchema as any,
    defineOptions
  ) as typeof arrayOfSchema;

type DefineSchemaBase<
  TType extends IntrinsicTypeName,
  TName extends string,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>,
  TRequired extends boolean
> = MaybeAllowUnknownProps<TStrict> &
  (TType extends IntrinsicTypeName
    ? // Why can't I just index off of IntrinsicDefinitions?
      Extract<
        {
          [K in IntrinsicTypeName]: Omit<
            IntrinsicDefinitions<
              TName,
              TRequired,
              TFieldDefinitions,
              TMemberDefinitions
            >[K] & {
              name: TName;
            },
            "FIXME why does this fail without the omit? we're clearly not using it"
          >;
        }[IntrinsicTypeName],
        { type: TType }
      >
    : TypeAliasDefinition<TType, TAlias>) & {
    [requiredSymbol]?: TRequired;
  };

export const defineField = <
  TType extends IntrinsicTypeName,
  TName extends string,
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
    TStrict,
    TFieldDefinitions,
    TMemberDefinitions,
    TRequired
  > &
    FieldDefinitionBase,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) => defineFieldNative(schemaField as any, defineOptions) as typeof schemaField;

type Type<
  TType extends IntrinsicTypeName,
  TName extends string,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>,
  TRequired extends boolean
> = DefineSchemaBase<
  TType,
  TName,
  TAlias,
  TStrict,
  TFieldDefinitions,
  TMemberDefinitions,
  TRequired
>;

export const defineType = <
  TType extends IntrinsicTypeName,
  TName extends string,
  TAlias extends IntrinsicTypeName | undefined,
  TStrict extends StrictDefinition,
  TFieldDefinitions extends TupleOfLength<{ name: string }, 1>,
  TMemberDefinitions extends TupleOfLength<DefinitionBase<any, any, any>, 1>,
  TRequired extends boolean = false
>(
  schemaDefinition: Type<
    TType,
    TName,
    TAlias,
    TStrict,
    TFieldDefinitions,
    TMemberDefinitions,
    TRequired
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineTypeNative(
    schemaDefinition as any,
    defineOptions
  ) as typeof schemaDefinition;

type WorkspaceOptions<
  TSchemaType extends Type<any, any, any, any, any, any, any>
> = Merge<
  WorkspaceOptionsNative,
  {
    schema?: Merge<
      SchemaPluginOptionsNative,
      {
        types?:
          | ComposableOption<
              TSchemaType[],
              Omit<
                ConfigContext,
                "client" | "currentUser" | "getClient" | "schema"
              >
            >
          | TSchemaType[];
      }
    >;
  }
>;

export type Config<
  TSchemaType extends Type<any, any, any, any, any, any, any>
> =
  | Merge<
      WorkspaceOptions<TSchemaType>,
      {
        basePath?: string;
        name?: string;
      }
    >
  | WorkspaceOptions<TSchemaType>[];

export const defineConfig = <
  TSchemaType extends Type<any, any, any, any, any, any, any>
>(
  config: Config<TSchemaType>
) => defineConfigNative(config as any) as typeof config;
