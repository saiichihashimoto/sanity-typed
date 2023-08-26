import type {
  PortableTextBlock as PortableTextBlockNative,
  PortableTextMarkDefinition,
  PortableTextSpan,
  TypedObject,
} from "@portabletext/types";
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
  ReferenceValue as ReferenceValueNative,
  RuleDef,
  SanityDocument as SanityDocumentNative,
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
  TypeReference as TypeReferenceNative,
  UrlDefinition as UrlDefinitionNative,
  UrlRule,
  WorkspaceOptions as WorkspaceOptionsNative,
} from "sanity";
import type { Merge, RemoveIndexSignature, Simplify } from "type-fest";

import type { TupleOfLength } from "./utils";

declare const README: unique symbol;
declare const required: unique symbol;

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
    [required]: TRequired;
  }
>;

type MaybeArray<T> = T | T[];

type ValidationBuilder<
  TRequired extends boolean,
  Value,
  Rule extends RuleDef<Rule, Value>
> = (
  rule: WithRequired<false, Rule>
) => MaybeArray<WithRequired<TRequired | false, Rule>>;

type DefinitionBase<
  TRequired extends boolean,
  Value,
  Rule extends RuleDef<Rule, Value>
> = {
  preview?: PreviewConfig;
  validation?: ValidationBuilder<TRequired, Value, Rule>;
};

/**
 * Infers the Value of a Definition, without aliased types.
 *
 * @private
 */
export type _InferValue<Def extends DefinitionBase<any, any, any>> =
  Def extends DefinitionBase<any, infer Value, any> ? Value : never;

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
  DefinitionBase<TRequired, GeopointValue, GeopointRule>
>;

export type NumberDefinition<TRequired extends boolean> = Merge<
  NumberDefinitionNative,
  DefinitionBase<TRequired, number, NumberRule>
>;

declare const referenced: unique symbol;

export type ReferenceValue<TReferenced extends string> = Merge<
  Omit<ReferenceValueNative, "_type">,
  { [referenced]: TReferenced[] }
>;

export type TypeReference<TReferenced extends string> = Merge<
  TypeReferenceNative,
  {
    type: string extends TReferenced
      ? TReferenced & {
          [README]: "⛔️ Unfortunately, this needs an `as const` for correct types. ⛔️";
        }
      : TReferenced;
  }
>;

export type ReferenceDefinition<
  TRequired extends boolean,
  TReferenced extends string
> = Merge<
  ReferenceDefinitionNative,
  DefinitionBase<
    TRequired,
    ReferenceValue<TReferenced>,
    RewriteValue<ReferenceValue<TReferenced>, ReferenceRule>
  > & {
    to: TupleOfLength<TypeReference<TReferenced>, 1>;
  }
>;

export type SlugDefinition<TRequired extends boolean> = Merge<
  SlugDefinitionNative,
  DefinitionBase<TRequired, SlugValue, SlugRule>
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

export type ArrayDefinition<
  TRequired extends boolean,
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = Merge<
  ArrayDefinitionNative,
  DefinitionBase<
    TRequired,
    _InferValue<TMemberDefinition>[],
    ArrayRule<_InferValue<TMemberDefinition>[]>
  > & {
    of: TupleOfLength<TMemberDefinition, 1>;
  }
>;

export type PortableTextBlock<
  M extends PortableTextMarkDefinition = PortableTextMarkDefinition,
  C extends TypedObject = PortableTextSpan,
  S extends string = string,
  L extends string = string
> = Omit<PortableTextBlockNative<M, C, S, L> & { _type: "block" }, "_key">;

export type BlockDefinition<
  TRequired extends boolean,
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = Merge<
  BlockDefinitionNative,
  DefinitionBase<
    TRequired,
    PortableTextBlock<
      PortableTextMarkDefinition,
      _InferValue<TMemberDefinition> | PortableTextSpan
    >,
    RewriteValue<
      PortableTextBlock<
        PortableTextMarkDefinition,
        _InferValue<TMemberDefinition> | PortableTextSpan
      >,
      BlockRule
    >
  > & {
    of?: (TMemberDefinition & { name: string; type: "object" | "reference" })[];
  }
>;

type ObjectValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  }
> = Simplify<
  {
    [Name in Extract<
      TFieldDefinition,
      { [required]?: false }
    >["name"]]?: _InferValue<Extract<TFieldDefinition, { name: Name }>>;
  } & {
    [Name in Extract<
      TFieldDefinition,
      { [required]?: true }
    >["name"]]: _InferValue<Extract<TFieldDefinition, { name: Name }>>;
  }
>;

export type ObjectDefinition<
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
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

export type SanityDocument<
  TType extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  }
> = Simplify<
  RemoveIndexSignature<ObjectValue<TFieldDefinition> & SanityDocumentNative> & {
    _type: TType;
  }
>;

export type DocumentDefinition<
  TName extends string,
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  }
> = Merge<
  DocumentDefinitionNative,
  DefinitionBase<
    TRequired,
    SanityDocument<TName, TFieldDefinition>,
    RewriteValue<SanityDocument<TName, TFieldDefinition>, DocumentRule>
  > & {
    fields: TupleOfLength<TFieldDefinition, 1>;
  }
>;

export type FileValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<
  ObjectValue<TFieldDefinition> & RemoveIndexSignature<FileValueNative>
>;

type FileDefinition<
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
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
    [required]?: boolean;
  } = never
> = Simplify<
  ObjectValue<TFieldDefinition> & RemoveIndexSignature<ImageValueNative>
>;

type ImageDefinition<
  TRequired extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
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
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TReferenced extends string,
  TRequired extends boolean
> = {
  array: ArrayDefinition<TRequired, TMemberDefinition>;
  block: BlockDefinition<TRequired, TMemberDefinition>;
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
  reference: ReferenceDefinition<TRequired, TReferenced>;
  slug: SlugDefinition<TRequired>;
  string: StringDefinition<TRequired>;
  text: TextDefinition<TRequired>;
  url: UrlDefinition<TRequired>;
};

type IntrinsicTypeName = keyof IntrinsicDefinitions<any, any, any, any, any>;

declare const aliasedType: unique symbol;

export type AliasValue<TType extends string> = {
  [aliasedType]: TType;
};

type TypeAliasDefinition<
  TType extends string,
  TAlias extends IntrinsicTypeName,
  TRequired extends boolean
> = Merge<
  TypeAliasDefinitionNative<TType, TAlias>,
  DefinitionBase<TRequired, AliasValue<TType>, any> & {
    options?: TAlias extends IntrinsicTypeName
      ? IntrinsicDefinitions<any, any, any, any, TRequired>[TAlias]["options"]
      : unknown;
  }
>;

/**
 * Arrays shouldn't be children of arrays, ever.
 * https://www.sanity.io/docs/array-type#fNBIr84P
 *
 * But we give an option to do so, only so we can test the depth limit
 *
 * @private
 */
export const makeDefineArrayMember =
  <AllowArrays extends boolean>() =>
  <
    TType extends string,
    TName extends string,
    TAlias extends IntrinsicTypeName,
    TStrict extends StrictDefinition,
    TReferenced extends string,
    TFieldDefinition extends DefinitionBase<any, any, any> & {
      name: string;
      [required]?: boolean;
    } = never,
    TMemberDefinition extends DefinitionBase<any, any, any> & {
      name?: string;
    } = never
  >(
    arrayOfSchema: MaybeAllowUnknownProps<TStrict> &
      ((TType extends "array" ? AllowArrays : true) extends false
        ? never
        : TType extends IntrinsicTypeName
        ? // HACK Why can't I just index off of IntrinsicDefinitions?
          Extract<
            {
              [type in IntrinsicTypeName]: Omit<
                IntrinsicDefinitions<
                  TName,
                  TFieldDefinition,
                  TMemberDefinition,
                  TReferenced,
                  any
                >[type] extends DefinitionBase<any, infer Value, infer Rule>
                  ? Merge<
                      IntrinsicDefinitions<
                        TName,
                        TFieldDefinition,
                        TMemberDefinition,
                        TReferenced,
                        any
                      >[type],
                      DefinitionBase<
                        any,
                        Value &
                          (Value extends any[]
                            ? unknown
                            : Value extends { [key: string]: any }
                            ? (string extends TName
                                ? unknown
                                : Value["_type"] extends TName
                                ? unknown
                                : { _type: TName }) & { _key: string }
                            : unknown),
                        // @ts-expect-error -- FIXME
                        RewriteValue<
                          Value &
                            (Value extends any[]
                              ? unknown
                              : Value extends { [key: string]: any }
                              ? (string extends TName
                                  ? unknown
                                  : Value["_type"] extends TName
                                  ? unknown
                                  : { _type: TName }) & { _key: string }
                              : unknown),
                          Rule
                        >
                      >
                    >
                  : IntrinsicDefinitions<
                      TName,
                      TFieldDefinition,
                      TMemberDefinition,
                      TReferenced,
                      any
                    >[type],
                "name"
              >;
            }[IntrinsicTypeName],
            { type: TType }
          >
        : Omit<
            Merge<
              TypeAliasDefinition<TType, TAlias, any>,
              DefinitionBase<
                any,
                AliasValue<TType> &
                  (string extends TName ? unknown : { _type: TName }) & {
                    _key: string;
                  },
                any
              >
            >,
            "name"
          >) & {
        name?: TName;
        type: TType;
      },
    defineOptions?: DefineSchemaOptions<TStrict, TAlias>
  ) =>
    defineArrayMemberNative(
      arrayOfSchema as any,
      defineOptions
    ) as typeof arrayOfSchema &
      (string extends TName ? unknown : { name: TName });

export const defineArrayMember = makeDefineArrayMember<false>();

export const defineField = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never,
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never,
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
            [type in IntrinsicTypeName]: Omit<
              IntrinsicDefinitions<
                TName,
                TFieldDefinition,
                TMemberDefinition,
                TReferenced,
                TRequired
              >[type],
              "FIXME why does this fail without the omit? we're clearly not using it"
            >;
          }[IntrinsicTypeName],
          { type: TType }
        >
      : TypeAliasDefinition<TType, TAlias, TRequired>) & {
      name: TName;
      [required]?: TRequired;
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
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TReferenced extends string
> = MaybeAllowUnknownProps<TStrict> &
  (TType extends IntrinsicTypeName
    ? // HACK Why can't I just index off of IntrinsicDefinitions?
      Extract<
        {
          [type in IntrinsicTypeName]: Omit<
            IntrinsicDefinitions<
              TName,
              TFieldDefinition,
              TMemberDefinition,
              TReferenced,
              any
            >[type],
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
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never,
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never
>(
  schemaDefinition: Type<
    TType,
    TName,
    TAlias,
    TStrict,
    TFieldDefinition,
    TMemberDefinition,
    TReferenced
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineTypeNative(
    schemaDefinition as any,
    defineOptions
  ) as typeof schemaDefinition;

type ConfigBase<
  TTypeDefinition extends Type<any, any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any, any>
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
  TTypeDefinition extends Type<any, any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any, any> = Type<
    string,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = ConfigBase<TTypeDefinition, TPluginTypeDefinition> &
  Omit<PluginOptionsNative, "plugins" | "schema">;

export const definePlugin = <
  TTypeDefinition extends Type<any, any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any, any> = Type<
    string,
    any,
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
  TTypeDefinition extends Type<any, any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any, any>
> = Merge<
  WorkspaceOptionsNative,
  ConfigBase<TTypeDefinition, TPluginTypeDefinition>
>;

export type Config<
  TTypeDefinition extends Type<any, any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any, any> = Type<
    string,
    any,
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
  TTypeDefinition extends Type<any, any, any, any, any, any, any>,
  TPluginTypeDefinition extends Type<any, any, any, any, any, any, any> = Type<
    string,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  config: Config<TTypeDefinition, TPluginTypeDefinition>
) =>
  defineConfigNative(config as any) as typeof config extends any[]
    ? Extract<typeof config, any[]>
    : Exclude<typeof config, any[]>;

export const castToTyped = <Untyped>(untyped: Untyped) =>
  untyped as Untyped extends ReturnType<
    typeof defineTypeNative<
      infer TType extends string,
      infer TName extends string,
      any,
      any,
      infer TAlias extends IntrinsicTypeName | undefined,
      infer TStrict extends StrictDefinition
    >
  >
    ? ReturnType<
        typeof defineType<
          TType,
          TName,
          NonNullable<TAlias>,
          TStrict,
          any,
          any,
          any
        >
      >
    : Untyped extends ReturnType<
        typeof defineFieldNative<
          infer TType extends string,
          infer TName extends string,
          any,
          any,
          infer TAlias extends IntrinsicTypeName | undefined,
          infer TStrict extends StrictDefinition
        >
      >
    ? ReturnType<
        typeof defineField<
          TType,
          TName,
          NonNullable<TAlias>,
          TStrict,
          any,
          any,
          any,
          any
        >
      >
    : Untyped extends ReturnType<
        typeof defineArrayMemberNative<
          infer TType extends string,
          infer TName extends string,
          any,
          any,
          infer TAlias extends IntrinsicTypeName | undefined,
          infer TStrict extends StrictDefinition
        >
      >
    ? ReturnType<
        typeof defineArrayMember<
          TType,
          TName,
          NonNullable<TAlias>,
          TStrict,
          any,
          any,
          any
        >
      >
    : Untyped extends PluginOptionsNative
    ? ReturnType<typeof definePlugin<any, any>>
    : {
        [README]: "⛔️ This can't be casted! Did you pass it the return value of a `define*` method from `sanity`?. ⛔️";
      };

export const castFromTyped = <Untyped>(untyped: Untyped) =>
  untyped as Untyped extends ReturnType<
    typeof defineField<
      infer TType extends string,
      infer TName extends string,
      infer TAlias extends IntrinsicTypeName,
      infer TStrict extends StrictDefinition,
      any,
      any,
      any,
      any
    >
  >
    ? ReturnType<
        typeof defineFieldNative<TType, TName, any, any, TAlias, TStrict>
      >
    : Untyped extends ReturnType<
        typeof defineType<
          infer TType extends string,
          infer TName extends string,
          infer TAlias extends IntrinsicTypeName,
          infer TStrict extends StrictDefinition,
          any,
          any,
          any
        >
      >
    ? ReturnType<
        typeof defineTypeNative<TType, TName, any, any, TAlias, TStrict>
      >
    : Untyped extends ReturnType<
        typeof defineArrayMember<
          infer TType extends string,
          infer TName extends string,
          infer TAlias extends IntrinsicTypeName,
          infer TStrict extends StrictDefinition,
          any,
          any,
          any
        >
      >
    ? ReturnType<
        typeof defineArrayMemberNative<TType, TName, any, any, TAlias, TStrict>
      >
    : Untyped extends PluginOptions<any, any>
    ? PluginOptionsNative
    : {
        [README]: "⛔️ This can't be casted! Did you pass it the return value of a `define*` method from `sanity`?. ⛔️";
      };

type OmitToUnknown<T, K extends number | string | symbol> = Exclude<
  keyof T,
  K
> extends never
  ? unknown
  : Omit<T, K>;

type ExpandAliasValues<
  Value,
  TAliasedDefinition extends Type<any, any, any, any, any, any, any>
> = Value extends AliasValue<infer TType>
  ? Extract<TAliasedDefinition, { name: TType }> extends never
    ? unknown
    : ExpandAliasValues<
        _InferValue<Extract<TAliasedDefinition, { name: TType }>>,
        TAliasedDefinition
      > &
        OmitToUnknown<Value, keyof AliasValue<TType>> &
        (Extract<
          TAliasedDefinition,
          {
            name: TType;
            type: "object";
          }
        > extends never
          ? unknown
          : OmitToUnknown<
              {
                _type: TType;
              },
              keyof Value
            >)
  : Value extends (infer Item)[]
  ? ExpandAliasValues<Item, TAliasedDefinition>[]
  : Value extends { [key: string]: any }
  ? {
      [key in keyof Value]: ExpandAliasValues<Value[key], TAliasedDefinition>;
    }
  : Value;

export type InferSchemaValues<
  TConfig extends MaybeArray<ConfigBase<any, any>>
> = TConfig extends MaybeArray<
  ConfigBase<infer TTypeDefinition, infer TPluginTypeDefinition>
>
  ? {
      [TName in TTypeDefinition extends Type<
        any,
        infer TName extends string,
        any,
        any,
        any,
        any,
        any
      >
        ? TName
        : never]: ExpandAliasValues<
        TTypeDefinition extends Type<"object", TName, any, any, any, any, any>
          ? _InferValue<TTypeDefinition> & { _type: TName }
          : TTypeDefinition extends Type<any, TName, any, any, any, any, any>
          ? _InferValue<TTypeDefinition>
          : never,
        // TPluginTypeDefinition | TTypeDefinition
        | (Type<any, any, any, any, any, any, any> extends TPluginTypeDefinition
            ? never
            : TPluginTypeDefinition)
        | (Type<any, any, any, any, any, any, any> extends TTypeDefinition
            ? never
            : TTypeDefinition)
      >;
    }
  : never;
