import type {
  PortableTextBlock as PortableTextBlockNative,
  PortableTextMarkDefinition as PortableTextMarkDefinitionNative,
  PortableTextSpan as PortableTextSpanNative,
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
  NumberOptions,
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
  SlugValue as SlugValueNative,
  StrictDefinition,
  StringDefinition as StringDefinitionNative,
  StringOptions,
  StringRule,
  TextDefinition as TextDefinitionNative,
  TextRule,
  TitledListValue,
  TypeAliasDefinition as TypeAliasDefinitionNative,
  TypeReference as TypeReferenceNative,
  UrlDefinition as UrlDefinitionNative,
  UrlRule,
  WorkspaceOptions as WorkspaceOptionsNative,
} from "sanity";
import type {
  Except,
  IsStringLiteral,
  OmitIndexSignature,
  SetRequired,
  Simplify,
} from "type-fest";

import type { MaybeArray, TupleOfLength } from "./utils";

// TODO Couldn't use type-fest's Merge >=3.0.0
type Merge_<FirstType, SecondType> = Except<
  FirstType,
  Extract<keyof FirstType, keyof SecondType>
> &
  SecondType;
type MergeOld<FirstType, SecondType> = Simplify<Merge_<FirstType, SecondType>>;

declare const README: unique symbol;
declare const required: unique symbol;

type WithRequired<
  TRequired extends boolean,
  Rule extends RuleDef<Rule, any>
> = MergeOld<
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

type RewriteValue<Value, Rule extends RuleDef<Rule, any>> = MergeOld<
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

export type BooleanDefinition<TRequired extends boolean> = MergeOld<
  BooleanDefinitionNative,
  DefinitionBase<TRequired, boolean, BooleanRule>
>;

export type CrossDatasetReferenceValue = MergeOld<
  Omit<CrossDatasetReferenceValueNative, "_key">,
  { _type: "crossDatasetReference" }
>;

type CrossDatasetReferenceRule = RuleDef<
  CrossDatasetReferenceRule,
  CrossDatasetReferenceValue
>;

export type CrossDatasetReferenceDefinition<TRequired extends boolean> =
  MergeOld<
    CrossDatasetReferenceDefinitionNative,
    DefinitionBase<
      TRequired,
      CrossDatasetReferenceValue,
      CrossDatasetReferenceRule
    >
  >;

export type DateDefinition<TRequired extends boolean> = MergeOld<
  DateDefinitionNative,
  DefinitionBase<TRequired, string, DateRule>
>;

export type DatetimeDefinition<TRequired extends boolean> = MergeOld<
  DatetimeDefinitionNative,
  DefinitionBase<TRequired, string, DatetimeRule>
>;

export type EmailDefinition<TRequired extends boolean> = MergeOld<
  EmailDefinitionNative,
  DefinitionBase<TRequired, string, EmailRule>
>;

export type GeopointDefinition<TRequired extends boolean> = MergeOld<
  GeopointDefinitionNative,
  DefinitionBase<TRequired, GeopointValue, GeopointRule>
>;

type MaybeTitledListValue<T> = T | TitledListValue<T>;

export type NumberDefinition<
  TOptionsHelper,
  TRequired extends boolean
> = MergeOld<
  NumberDefinitionNative,
  DefinitionBase<
    TRequired,
    TOptionsHelper & number,
    RewriteValue<TOptionsHelper & number, NumberRule>
  > & {
    options?: MergeOld<
      NumberOptions,
      {
        list?: MaybeTitledListValue<TOptionsHelper>[];
      }
    >;
  }
>;

/** @private */
export const _referenced: unique symbol = Symbol("referenced");

export type ReferenceValue<TReferenced extends string> = MergeOld<
  Omit<ReferenceValueNative, "_key">,
  { [_referenced]: TReferenced; _type: "reference" }
>;

export type TypeReference<TReferenced extends string> = MergeOld<
  TypeReferenceNative,
  {
    type: TReferenced &
      (IsStringLiteral<TReferenced> extends false
        ? {
            [README]: "⛔️ Unfortunately, this needs an `as const` for correct types. ⛔️";
          }
        : unknown);
  }
>;

export type ReferenceDefinition<
  TReferenced extends string,
  TRequired extends boolean
> = MergeOld<
  ReferenceDefinitionNative,
  DefinitionBase<
    TRequired,
    ReferenceValue<TReferenced>,
    RewriteValue<ReferenceValue<TReferenced>, ReferenceRule>
  > & {
    to: TupleOfLength<TypeReference<TReferenced>, 1>;
  }
>;

export type SlugValue = Required<SlugValueNative>;

export type SlugDefinition<TRequired extends boolean> = MergeOld<
  SlugDefinitionNative,
  DefinitionBase<TRequired, SlugValue, RewriteValue<SlugValue, SlugRule>>
>;

export type StringDefinition<
  TOptionsHelper,
  TRequired extends boolean
> = MergeOld<
  StringDefinitionNative,
  DefinitionBase<
    TRequired,
    TOptionsHelper & string,
    RewriteValue<TOptionsHelper & string, StringRule>
  > & {
    options?: MergeOld<
      StringOptions,
      {
        list?: MaybeTitledListValue<TOptionsHelper>[];
      }
    >;
  }
>;

export type TextDefinition<TRequired extends boolean> = MergeOld<
  TextDefinitionNative,
  DefinitionBase<TRequired, string, TextRule>
>;

export type UrlDefinition<TRequired extends boolean> = MergeOld<
  UrlDefinitionNative,
  DefinitionBase<TRequired, string, UrlRule>
>;
export type InferRawValue<Def extends DefinitionBase<any, any, any>> =
  Def extends DefinitionBase<any, infer Value, any> ? Value : never;

export type ArrayDefinition<
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = MergeOld<
  ArrayDefinitionNative,
  DefinitionBase<
    TRequired,
    InferRawValue<TMemberDefinition>[],
    ArrayRule<InferRawValue<TMemberDefinition>[]>
  > & {
    of: TupleOfLength<TMemberDefinition, 1>;
  }
>;

export type PortableTextMarkDefinition =
  OmitIndexSignature<PortableTextMarkDefinitionNative>;

export type PortableTextSpan = SetRequired<PortableTextSpanNative, "_key">;

export type PortableTextBlock<
  M extends PortableTextMarkDefinitionNative = PortableTextMarkDefinition,
  C extends TypedObject = PortableTextSpan,
  S extends string = string,
  L extends string = string
> = Omit<PortableTextBlockNative<M, C, S, L> & { _type: "block" }, "_key">;

export type BlockDefinition<
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = MergeOld<
  BlockDefinitionNative,
  DefinitionBase<
    TRequired,
    PortableTextBlock<
      PortableTextMarkDefinition,
      | PortableTextSpan
      | (TMemberDefinition extends never
          ? never
          : InferRawValue<TMemberDefinition> & { _key: string })
    >,
    RewriteValue<
      PortableTextBlock<
        PortableTextMarkDefinition,
        | PortableTextSpan
        | (TMemberDefinition extends never
            ? never
            : InferRawValue<TMemberDefinition> & { _key: string })
      >,
      BlockRule
    >
  > & {
    of?: TupleOfLength<TMemberDefinition, 1>;
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
    >["name"]]?: InferRawValue<Extract<TFieldDefinition, { name: Name }>>;
  } & {
    [Name in Extract<
      TFieldDefinition,
      { [required]?: true }
    >["name"]]: InferRawValue<Extract<TFieldDefinition, { name: Name }>>;
  }
>;

export type ObjectDefinition<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TRequired extends boolean
> = MergeOld<
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
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<
  OmitIndexSignature<ObjectValue<TFieldDefinition> & SanityDocumentNative> & {
    _type: "document";
  }
>;

export type DocumentDefinition<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TRequired extends boolean
> = MergeOld<
  DocumentDefinitionNative,
  DefinitionBase<
    TRequired,
    SanityDocument<TFieldDefinition>,
    RewriteValue<SanityDocument<TFieldDefinition>, DocumentRule>
  > & {
    fields: TupleOfLength<TFieldDefinition, 1>;
  }
>;

// HACK Not sure why, but without this, the #108 specific test fails 🤷
type FileValueNativeWithType = FileValueNative & {
  _type: "file";
};

export type FileValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<
  ObjectValue<TFieldDefinition> & OmitIndexSignature<FileValueNativeWithType>
>;

type FileDefinition<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TRequired extends boolean
> = MergeOld<
  FileDefinitionNative,
  DefinitionBase<
    TRequired,
    FileValue<TFieldDefinition>,
    RewriteValue<FileValue<TFieldDefinition>, FileRule>
  > & {
    fields?: TFieldDefinition[];
  }
>;

// HACK Not sure why, but without this, the #108 specific test fails 🤷
type ImageValueNativeWithType = ImageValueNative & {
  _type: "image";
};

export type ImageValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<
  ObjectValue<TFieldDefinition> & OmitIndexSignature<ImageValueNativeWithType>
>;

type ImageDefinition<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TRequired extends boolean
> = MergeOld<
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
  TOptionsHelper,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = {
  array: ArrayDefinition<TMemberDefinition, TRequired>;
  block: BlockDefinition<TMemberDefinition, TRequired>;
  boolean: BooleanDefinition<TRequired>;
  crossDatasetReference: CrossDatasetReferenceDefinition<TRequired>;
  date: DateDefinition<TRequired>;
  datetime: DatetimeDefinition<TRequired>;
  document: DocumentDefinition<TFieldDefinition, TRequired>;
  email: EmailDefinition<TRequired>;
  file: FileDefinition<TFieldDefinition, TRequired>;
  geopoint: GeopointDefinition<TRequired>;
  image: ImageDefinition<TFieldDefinition, TRequired>;
  number: NumberDefinition<TOptionsHelper, TRequired>;
  object: ObjectDefinition<TFieldDefinition, TRequired>;
  reference: ReferenceDefinition<TReferenced, TRequired>;
  slug: SlugDefinition<TRequired>;
  string: StringDefinition<TOptionsHelper, TRequired>;
  text: TextDefinition<TRequired>;
  url: UrlDefinition<TRequired>;
};

export type IntrinsicTypeName = Simplify<
  keyof IntrinsicDefinitions<any, any, any, any, any>
>;

declare const aliasedType: unique symbol;

type AliasValue<TType extends string> = {
  [aliasedType]: TType;
};

type TypeAliasDefinition<
  TType extends string,
  TAlias extends IntrinsicTypeName,
  TOptionsHelper,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = MergeOld<
  TypeAliasDefinitionNative<TType, TAlias>,
  DefinitionBase<TRequired, AliasValue<TType>, any> & {
    options?: TAlias extends IntrinsicTypeName
      ? IntrinsicDefinitions<
          TOptionsHelper,
          TReferenced,
          TFieldDefinition,
          TMemberDefinition,
          TRequired
        >[TAlias]["options"]
      : unknown;
  }
>;

type IsObject<T> = T extends any[] ? false : T extends object ? true : false;

/** @private */
export type _ArrayMemberDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TOptionsHelper,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  AllowArrays extends boolean
> = MaybeAllowUnknownProps<TStrict> &
  ((TType extends "array" ? AllowArrays : true) extends false
    ? never
    : TType extends IntrinsicTypeName
    ? // HACK Why can't I just index off of IntrinsicDefinitions?
      Extract<
        {
          [type in IntrinsicTypeName]: Omit<
            IntrinsicDefinitions<
              TOptionsHelper,
              TReferenced,
              TFieldDefinition,
              TMemberDefinition,
              any
            >[type] extends DefinitionBase<any, infer Value, infer Rule>
              ? MergeOld<
                  IntrinsicDefinitions<
                    TOptionsHelper,
                    TReferenced,
                    TFieldDefinition,
                    TMemberDefinition,
                    any
                  >[type],
                  DefinitionBase<
                    any,
                    IsObject<Value> extends false
                      ? Value
                      : IsStringLiteral<TName> extends false
                      ? Value
                      : Omit<Value, "_type"> & { _type: TName },
                    // @ts-expect-error -- TODO Doesn't match the rule for some reason
                    RewriteValue<
                      IsObject<Value> extends false
                        ? Value
                        : IsStringLiteral<TName> extends false
                        ? Value
                        : Omit<Value, "_type"> & { _type: TName },
                      Rule
                    >
                  >
                >
              : IntrinsicDefinitions<
                  TOptionsHelper,
                  TReferenced,
                  TFieldDefinition,
                  TMemberDefinition,
                  any
                >[type],
            "name"
          >;
        }[IntrinsicTypeName],
        { type: TType }
      >
    : Omit<
        MergeOld<
          TypeAliasDefinition<
            TType,
            TAlias,
            TOptionsHelper,
            TReferenced,
            TFieldDefinition,
            TMemberDefinition,
            any
          >,
          DefinitionBase<
            any,
            AliasValue<TType> &
              (IsStringLiteral<TName> extends false
                ? unknown
                : { _type: TName }),
            any
          >
        >,
        "name"
      >) &
  (IsStringLiteral<TName> extends false
    ? unknown
    : {
        name: TName;
      }) & {
    name?: TName;
    type: TType;
  };

// Arrays shouldn't be children of arrays, ever.
// https://www.sanity.io/docs/array-type#fNBIr84P
// But we give an option to do so, only so we can test the depth limit
/** @private */
export const _makeDefineArrayMember =
  <AllowArrays extends boolean>() =>
  <
    TType extends string,
    TName extends string,
    TAlias extends IntrinsicTypeName,
    TStrict extends StrictDefinition,
    TReferenced extends string,
    const TOptionsHelper,
    TFieldDefinition extends DefinitionBase<any, any, any> & {
      name: string;
      [required]?: boolean;
    } = never,
    TMemberDefinition extends DefinitionBase<any, any, any> & {
      name?: string;
    } = never
  >(
    arrayOfSchema: _ArrayMemberDefinition<
      TType,
      TName,
      TAlias,
      TStrict,
      TOptionsHelper,
      TReferenced,
      TFieldDefinition,
      TMemberDefinition,
      AllowArrays
    >,
    defineOptions?: DefineSchemaOptions<TStrict, TAlias>
  ) =>
    defineArrayMemberNative(
      arrayOfSchema as any,
      defineOptions
    ) as typeof arrayOfSchema;

export const defineArrayMember = _makeDefineArrayMember<false>();

/** @private */
export type _FieldDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TOptionsHelper,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  TRequired extends boolean
> = FieldDefinitionBase &
  MaybeAllowUnknownProps<TStrict> &
  (TType extends "block"
    ? never
    : TType extends IntrinsicTypeName
    ? // HACK Why can't I just index off of IntrinsicDefinitions?
      Extract<
        {
          [type in IntrinsicTypeName]: Omit<
            IntrinsicDefinitions<
              TOptionsHelper,
              TReferenced,
              TFieldDefinition,
              TMemberDefinition,
              TRequired
            >[type],
            "TODO why does this fail without the omit? we're clearly not using it"
          >;
        }[IntrinsicTypeName],
        { type: TType }
      >
    : TypeAliasDefinition<
        TType,
        TAlias,
        TOptionsHelper,
        TReferenced,
        TFieldDefinition,
        TMemberDefinition,
        TRequired
      >) & {
    name: TName;
    [required]?: TRequired;
    type: TType;
  };

export const defineField = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  const TOptionsHelper,
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
  schemaField: _FieldDefinition<
    TType,
    TName,
    TAlias,
    TStrict,
    TOptionsHelper,
    TReferenced,
    TFieldDefinition,
    TMemberDefinition,
    TRequired
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) => defineFieldNative(schemaField as any, defineOptions) as typeof schemaField;

/** @private */
export type _TypeDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TOptionsHelper,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string }
> = MaybeAllowUnknownProps<TStrict> &
  (TType extends IntrinsicTypeName
    ? // HACK Why can't I just index off of IntrinsicDefinitions?
      Extract<
        {
          [type in IntrinsicTypeName]: Omit<
            IntrinsicDefinitions<
              TOptionsHelper,
              TReferenced,
              TFieldDefinition,
              TMemberDefinition,
              any
            >[type],
            "TODO why does this fail without the omit? we're clearly not using it"
          >;
        }[IntrinsicTypeName],
        { type: TType }
      >
    : TypeAliasDefinition<
        TType,
        TAlias,
        TOptionsHelper,
        TReferenced,
        TFieldDefinition,
        TMemberDefinition,
        any
      >) & {
    name: TName;
    type: TType;
  };

export const defineType = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  const TOptionsHelper,
  TReferenced extends string,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never,
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never
>(
  schemaDefinition: _TypeDefinition<
    TType,
    TName,
    TAlias,
    TStrict,
    TOptionsHelper,
    TReferenced,
    TFieldDefinition,
    TMemberDefinition
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineTypeNative(
    schemaDefinition as any,
    defineOptions
  ) as typeof schemaDefinition;

/** @private */
export type _ConfigBase<
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive type
  plugins?: (PluginOptions<TPluginTypeDefinition, any> | PluginOptionsNative)[];
  schema?: MergeOld<
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
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > = _TypeDefinition<string, any, any, any, any, any, any, any>
> = _ConfigBase<TTypeDefinition, TPluginTypeDefinition> &
  Omit<PluginOptionsNative, "plugins" | "schema">;

export const definePlugin = <
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > = _TypeDefinition<string, any, any, any, any, any, any, any>,
  TOptionsHelper = void
>(
  arg:
    | PluginOptions<TTypeDefinition, TPluginTypeDefinition>
    | ((
        options: TOptionsHelper
      ) => PluginOptions<TTypeDefinition, TPluginTypeDefinition>)
) =>
  definePluginNative(arg as any) as (
    options: TOptionsHelper
  ) => PluginOptions<TTypeDefinition, TPluginTypeDefinition>;

type WorkspaceOptions<
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = MergeOld<
  WorkspaceOptionsNative,
  _ConfigBase<TTypeDefinition, TPluginTypeDefinition>
>;

export type Config<
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > = _TypeDefinition<string, any, any, any, any, any, any, any>
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
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > = _TypeDefinition<string, any, any, any, any, any, any, any>
>(
  config: Config<TTypeDefinition, TPluginTypeDefinition>
) =>
  defineConfigNative(config as any) as typeof config extends any[]
    ? Extract<typeof config, any[]>
    : Exclude<typeof config, any[]>;

type ExpandAliasValues<
  Value,
  TAliasedDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = Value extends AliasValue<infer TType>
  ? Extract<TAliasedDefinition, { name: TType }> extends never
    ? unknown
    : IsObject<
        ExpandAliasValues<
          InferRawValue<Extract<TAliasedDefinition, { name: TType }>>,
          TAliasedDefinition
        >
      > extends false
    ? ExpandAliasValues<
        InferRawValue<Extract<TAliasedDefinition, { name: TType }>>,
        TAliasedDefinition
      >
    : Omit<
        ExpandAliasValues<
          InferRawValue<Extract<TAliasedDefinition, { name: TType }>>,
          TAliasedDefinition
        >,
        "_type"
      > & {
        _type: Value extends { _type: infer TOverwriteType }
          ? TOverwriteType
          : TType;
      }
  : Value extends Omit<PortableTextBlock<any, any, any, any>, "_type">
  ? Value
  : Value extends (infer Item)[]
  ? (Item extends never
      ? never
      : IsObject<Item> extends false
      ? ExpandAliasValues<Item, TAliasedDefinition>
      : ExpandAliasValues<Item, TAliasedDefinition> & {
          _key: string;
        })[]
  : Value extends object
  ? {
      [key in keyof Value]: ExpandAliasValues<Value[key], TAliasedDefinition>;
    }
  : Value;

export type InferSchemaValues<
  TConfig extends MaybeArray<_ConfigBase<any, any>>
> = TConfig extends MaybeArray<
  _ConfigBase<infer TTypeDefinition, infer TPluginTypeDefinition>
>
  ? {
      [TName in TTypeDefinition["name"]]: ExpandAliasValues<
        AliasValue<TName>,
        // TPluginTypeDefinition | TTypeDefinition
        | (_TypeDefinition<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any
          > extends TPluginTypeDefinition
            ? never
            : TPluginTypeDefinition)
        | (_TypeDefinition<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any
          > extends TTypeDefinition
            ? never
            : TTypeDefinition)
      >;
    }
  : never;

export const castToTyped = <Untyped>(untyped: Untyped) =>
  untyped as Untyped extends
    | ReturnType<
        typeof defineArrayMemberNative<
          infer TType extends string,
          infer TName extends string,
          any,
          any,
          infer TAlias extends IntrinsicTypeName | undefined,
          infer TStrict extends StrictDefinition
        >
      >
    | ReturnType<
        typeof defineFieldNative<
          infer TType extends string,
          infer TName extends string,
          any,
          any,
          infer TAlias extends IntrinsicTypeName | undefined,
          infer TStrict extends StrictDefinition
        >
      >
    | ReturnType<
        typeof defineTypeNative<
          infer TType extends string,
          infer TName extends string,
          any,
          any,
          infer TAlias extends IntrinsicTypeName | undefined,
          infer TStrict extends StrictDefinition
        >
      >
    ?
        | (Untyped extends ReturnType<
            typeof defineArrayMemberNative<
              TType,
              TName,
              any,
              any,
              TAlias,
              TStrict
            >
          >
            ? _ArrayMemberDefinition<
                TType,
                TName,
                NonNullable<TAlias>,
                TStrict,
                any,
                any,
                any,
                any,
                any
              >
            : never)
        | (Untyped extends ReturnType<
            typeof defineFieldNative<TType, TName, any, any, TAlias, TStrict>
          >
            ? _FieldDefinition<
                TType,
                TName,
                NonNullable<TAlias>,
                TStrict,
                any,
                any,
                any,
                any,
                any
              >
            : never)
        | (Untyped extends ReturnType<
            typeof defineTypeNative<TType, TName, any, any, TAlias, TStrict>
          >
            ? _TypeDefinition<
                TType,
                TName,
                NonNullable<TAlias>,
                TStrict,
                any,
                any,
                any,
                any
              >
            : never)
    : Untyped extends PluginOptionsNative
    ? ReturnType<typeof definePlugin<any, any>>
    : {
        [README]: "⛔️ This can't be casted! Did you pass it the return value of a `define*` method from `sanity`?. ⛔️";
      };

export const castFromTyped = <Typed>(typed: Typed) =>
  typed as Typed extends _FieldDefinition<
    infer TType extends string,
    infer TName extends string,
    infer TAlias extends IntrinsicTypeName,
    infer TStrict extends StrictDefinition,
    any,
    any,
    any,
    any,
    any
  >
    ? ReturnType<
        typeof defineFieldNative<TType, TName, any, any, TAlias, TStrict>
      >
    : Typed extends _TypeDefinition<
        infer TType extends string,
        infer TName extends string,
        infer TAlias extends IntrinsicTypeName,
        infer TStrict extends StrictDefinition,
        any,
        any,
        any,
        any
      >
    ? ReturnType<
        typeof defineTypeNative<TType, TName, any, any, TAlias, TStrict>
      >
    : Typed extends _ArrayMemberDefinition<
        infer TType extends string,
        infer TName extends string,
        infer TAlias extends IntrinsicTypeName,
        infer TStrict extends StrictDefinition,
        any,
        any,
        any,
        any,
        any
      >
    ? ReturnType<
        typeof defineArrayMemberNative<TType, TName, any, any, TAlias, TStrict>
      >
    : Typed extends PluginOptions<any, any>
    ? PluginOptionsNative
    : {
        [README]: "⛔️ This can't be casted! Did you pass it the return value of a `define*` method from `sanity`?. ⛔️";
      };
