import type { PortableTextBlock } from "@portabletext/types";
import {
  defineArrayMember as defineArrayMemberNative,
  defineConfig as defineConfigNative,
  defineField as defineFieldNative,
  definePlugin as definePluginNative,
  defineType as defineTypeNative,
} from "sanity";
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
  PluginOptions as PluginOptionsNative,
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
  TypeAliasDefinition as TypeAliasDefinitionNative,
  UrlDefinition as UrlDefinitionNative,
  UrlRule,
  WorkspaceOptions as WorkspaceOptionsNative,
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

export type _InferValue<Def> = Def extends DefinitionBase<any, infer Value, any>
  ? Value
  : never;

/**
 * @deprecated Use {@link InferSchemaValues} instead. Otherwise, you won't get any aliased types (e.g. named object types, plugin types).
 */
export type InferValue<Def> = _InferValue<Def>;

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

type ArrayMemberValueExtra<
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = _InferValue<TMemberDefinition> extends { [key: string]: any }
  ? Merge<
      { _key: string },
      TMemberDefinition extends {
        name?: infer TName;
      }
        ? string extends TName
          ? unknown
          : { _type: TName }
        : unknown
    >
  : unknown;

type ArrayValue<
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = Simplify<
  (_InferValue<TMemberDefinition> & ArrayMemberValueExtra<TMemberDefinition>)[]
>;

export type ArrayDefinition<
  TRequired extends boolean,
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = Merge<
  ArrayDefinitionNative,
  DefinitionBase<
    TRequired,
    ArrayValue<TMemberDefinition>,
    ArrayRule<ArrayValue<TMemberDefinition>>
  > & {
    of: TupleOfLength<TMemberDefinition, 1>;
  }
>;

type ObjectValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
> = Simplify<
  {
    [Name in Extract<
      TFieldDefinition,
      { [requiredSymbol]?: false }
    >["name"]]?: _InferValue<Extract<TFieldDefinition, { name: Name }>>;
  } & {
    [Name in Extract<
      TFieldDefinition,
      { [requiredSymbol]?: true }
    >["name"]]: _InferValue<Extract<TFieldDefinition, { name: Name }>>;
  }
>;

export type ObjectDefinition<
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
> = Merge<
  ObjectDefinitionNative,
  DefinitionBase<
    TRequired,
    ObjectValue<TFieldDefinition>,
    RewriteValue<ObjectValue<TFieldDefinition>, ObjectRule>
  > & {
    fields: TupleOfLength<TFieldDefinition, 1>;
  }
>;

type DocumentValue<
  TType extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
> = Simplify<
  ObjectValue<TFieldDefinition> &
    RemoveIndexSignature<SanityDocument> & { _type: TType }
>;

export type DocumentDefinition<
  TName extends string,
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
> = Merge<
  DocumentDefinitionNative,
  DefinitionBase<
    TRequired,
    DocumentValue<TName, TFieldDefinition>,
    RewriteValue<DocumentValue<TName, TFieldDefinition>, DocumentRule>
  > & {
    fields: TupleOfLength<TFieldDefinition, 1>;
  }
>;

export type FileValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  } = never
> = Simplify<
  ObjectValue<TFieldDefinition> & RemoveIndexSignature<FileValueNative>
>;

type FileDefinition<
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
> = Merge<
  FileDefinitionNative,
  DefinitionBase<
    TRequired,
    FileValue<TFieldDefinition>,
    RewriteValue<FileValue<TFieldDefinition>, FileRule>
  > & {
    fields?: TFieldDefinition[];
  }
>;

export type ImageValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  } = never
> = Simplify<
  ObjectValue<TFieldDefinition> & RemoveIndexSignature<ImageValueNative>
>;

type ImageDefinition<
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
> = Merge<
  ImageDefinitionNative,
  DefinitionBase<
    TRequired,
    ImageValue<TFieldDefinition>,
    RewriteValue<ImageValue<TFieldDefinition>, FileRule>
  > & {
    fields?: TFieldDefinition[];
  }
>;

type IntrinsicDefinitions<
  TName extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = {
  array: ArrayDefinition<TRequired, TMemberDefinition>;
  block: BlockDefinition<TRequired>;
  boolean: BooleanDefinition<TRequired>;
  crossDatasetReference: CrossDatasetReferenceDefinition<TRequired>;
  date: DateDefinition<TRequired>;
  datetime: DatetimeDefinition<TRequired>;
  document: DocumentDefinition<TName, TRequired, TFieldDefinition>;
  email: EmailDefinition<TRequired>;
  file: FileDefinition<TRequired, TFieldDefinition>;
  geopoint: GeopointDefinition<TRequired>;
  image: ImageDefinition<TRequired, TFieldDefinition>;
  number: NumberDefinition<TRequired>;
  object: ObjectDefinition<TRequired, TFieldDefinition>;
  reference: ReferenceDefinition<TRequired>;
  slug: SlugDefinition<TRequired>;
  string: StringDefinition<TRequired>;
  text: TextDefinition<TRequired>;
  url: UrlDefinition<TRequired>;
};

type IntrinsicTypeName = keyof IntrinsicDefinitions<any, any, any, any>;

declare const aliasTypeSymbol: unique symbol;

export type AliasValue<TType extends string> = {
  [aliasTypeSymbol]: TType;
};

type TypeAliasDefinition<
  TType extends string,
  TAlias extends IntrinsicTypeName,
  TRequired extends boolean
> = Merge<
  TypeAliasDefinitionNative<TType, TAlias>,
  DefinitionBase<TRequired, AliasValue<TType>, any> & {
    options?: TAlias extends IntrinsicTypeName
      ? IntrinsicDefinitions<any, any, any, TRequired>[TAlias]["options"]
      : unknown;
  }
>;

export const defineArrayMember = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  }
>(
  arrayOfSchema: MaybeAllowUnknownProps<TStrict> &
    (TType extends "array"
      ? never
      : TType extends IntrinsicTypeName
      ? // HACK Why can't I just index off of IntrinsicDefinitions?
        Extract<
          {
            [K in IntrinsicTypeName]: Omit<
              IntrinsicDefinitions<TName, TFieldDefinition, any, any>[K],
              "name"
            >;
          }[IntrinsicTypeName],
          { type: TType }
        >
      : Omit<TypeAliasDefinition<TType, TAlias, any>, "name">) & {
      name?: TName;
      type: TType;
    },
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineArrayMemberNative(
    arrayOfSchema as any,
    defineOptions
  ) as typeof arrayOfSchema;

export const defineField = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean = false
>(
  schemaField: FieldDefinitionBase &
    MaybeAllowUnknownProps<TStrict> &
    (TType extends "block"
      ? never
      : TType extends IntrinsicTypeName
      ? // HACK Why can't I just index off of IntrinsicDefinitions?
        Extract<
          {
            [K in IntrinsicTypeName]: Omit<
              IntrinsicDefinitions<
                TName,
                TFieldDefinition,
                TMemberDefinition,
                TRequired
              >[K],
              "FIXME why does this fail without the omit? we're clearly not using it"
            >;
          }[IntrinsicTypeName],
          { type: TType }
        >
      : TypeAliasDefinition<TType, TAlias, TRequired>) & {
      name: TName;
      [requiredSymbol]?: TRequired;
      type: TType;
    },
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) => defineFieldNative(schemaField as any, defineOptions) as typeof schemaField;

type Type<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = MaybeAllowUnknownProps<TStrict> &
  (TType extends IntrinsicTypeName
    ? // HACK Why can't I just index off of IntrinsicDefinitions?
      Extract<
        {
          [K in IntrinsicTypeName]: Omit<
            IntrinsicDefinitions<
              TName,
              TFieldDefinition,
              TMemberDefinition,
              any
            >[K],
            "FIXME why does this fail without the omit? we're clearly not using it"
          >;
        }[IntrinsicTypeName],
        { type: TType }
      >
    : TypeAliasDefinition<TType, TAlias, any>) & {
    name: TName;
    type: TType;
  };

export const defineType = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [requiredSymbol]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
>(
  schemaDefinition: Type<
    TType,
    TName,
    TAlias,
    TStrict,
    TFieldDefinition,
    TMemberDefinition
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineTypeNative(
    schemaDefinition as any,
    defineOptions
  ) as typeof schemaDefinition;

type ConfigBase<
  TTypeDefinition extends Type<any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any>
> = {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive type
  plugins?: (PluginOptions<TPluginTypeDefinition, any> | PluginOptionsNative)[];
  schema?: Merge<
    SchemaPluginOptionsNative,
    {
      types?:
        | ComposableOption<
            TTypeDefinition[],
            Omit<
              ConfigContext,
              "client" | "currentUser" | "getClient" | "schema"
            >
          >
        | TTypeDefinition[];
    }
  >;
};

export type PluginOptions<
  TTypeDefinition extends Type<any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any> = Type<
    string,
    any,
    any,
    any,
    any,
    any
  >
> = ConfigBase<TTypeDefinition, TPluginTypeDefinition> &
  Omit<PluginOptionsNative, "plugins" | "schema">;

export const definePlugin = <
  TTypeDefinition extends Type<any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any> = Type<
    string,
    any,
    any,
    any,
    any,
    any
  >,
  TOptions = void
>(
  arg:
    | PluginOptions<TTypeDefinition, TPluginTypeDefinition>
    | ((
        options: TOptions
      ) => PluginOptions<TTypeDefinition, TPluginTypeDefinition>)
) =>
  definePluginNative(arg as any) as (
    options: TOptions
  ) => PluginOptions<TTypeDefinition, TPluginTypeDefinition>;

type WorkspaceOptions<
  TTypeDefinition extends Type<any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any>
> = Merge<
  WorkspaceOptionsNative,
  ConfigBase<TTypeDefinition, TPluginTypeDefinition>
>;

export type Config<
  TTypeDefinition extends Type<any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any> = Type<
    string,
    any,
    any,
    any,
    any,
    any
  >
> =
  | WorkspaceOptions<TTypeDefinition, TPluginTypeDefinition>[]
  | (Omit<
      WorkspaceOptions<TTypeDefinition, TPluginTypeDefinition>,
      "basePath" | "name"
    > & {
      basePath?: string;
      name?: string;
    });

export const defineConfig = <
  TTypeDefinition extends Type<any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any> = Type<
    string,
    any,
    any,
    any,
    any,
    any
  >
>(
  config: Config<TTypeDefinition, TPluginTypeDefinition>
) => defineConfigNative(config as any) as typeof config;

type ExpandAliasValues<
  Value,
  TAliasedDefinition extends Type<"object", any, any, any, any, any>
> = Value extends AliasValue<infer TType>
  ? Extract<
      TAliasedDefinition,
      Type<"object", TType, any, any, any, any>
    > extends never
    ? unknown
    : ExpandAliasValues<
        _InferValue<
          Extract<TAliasedDefinition, Type<"object", TType, any, any, any, any>>
        >,
        TAliasedDefinition
      > & {
        _type: TType;
      }
  : Value extends (infer Item)[]
  ? (Item extends ArrayMemberValueExtra<any>
      ? Item extends { [key: string]: any }
        ? Simplify<
            Omit<ExpandAliasValues<Item, TAliasedDefinition>, "_key" | "_type">
          > &
            Simplify<Pick<Item, "_key" | "_type">>
        : ExpandAliasValues<Item, TAliasedDefinition>
      : ExpandAliasValues<Item, TAliasedDefinition>)[]
  : Value extends { [key: string]: any }
  ? {
      [key in keyof Value]: ExpandAliasValues<Value[key], TAliasedDefinition>;
    }
  : Value;

export type InferSchemaValues<
  TConfig extends ConfigBase<any, any> | ConfigBase<any, any>[]
> = TConfig extends
  | ConfigBase<infer TTypeDefinition, infer TPluginTypeDefinition>
  | ConfigBase<infer TTypeDefinition, infer TPluginTypeDefinition>[]
  ? ExpandAliasValues<
      _InferValue<TTypeDefinition>,
      Extract<
        | (Type<any, any, any, any, any, any> extends TPluginTypeDefinition
            ? never
            : TPluginTypeDefinition)
        | (Type<any, any, any, any, any, any> extends TTypeDefinition
            ? never
            : TTypeDefinition),
        Type<"object", any, any, any, any, any>
      >
    >
  : never;
