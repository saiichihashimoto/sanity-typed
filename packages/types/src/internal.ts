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
  BlockDecoratorDefinition as BlockDecoratorDefinitionNative,
  BlockDefinition as BlockDefinitionNative,
  BlockListDefinition as BlockListDefinitionNative,
  BlockMarksDefinition,
  BlockRule,
  BlockStyleDefinition as BlockStyleDefinitionNative,
  BooleanDefinition as BooleanDefinitionNative,
  BooleanRule,
  ComposableOption,
  ConfigContext,
  CrossDatasetReferenceDefinition as CrossDatasetReferenceDefinitionNative,
  CustomValidator,
  DateDefinition as DateDefinitionNative,
  DateRule,
  DatetimeDefinition as DatetimeDefinitionNative,
  DatetimeRule,
  DefineSchemaOptions,
  DocumentDefinition as DocumentDefinitionNative,
  EmailDefinition as EmailDefinitionNative,
  EmailRule,
  FieldDefinitionBase,
  FileAsset as FileAssetNative,
  FileDefinition as FileDefinitionNative,
  FileRule,
  GeopointDefinition as GeopointDefinitionNative,
  GeopointRule,
  GeopointValue,
  ImageAsset as ImageAssetNative,
  ImageCrop,
  ImageDefinition as ImageDefinitionNative,
  ImageHotspot,
  ImageOptions,
  ImageRule,
  MaybeAllowUnknownProps,
  NumberDefinition as NumberDefinitionNative,
  NumberOptions,
  NumberRule,
  ObjectDefinition as ObjectDefinitionNative,
  ObjectRule,
  Plugin as PluginNative,
  PluginOptions as PluginOptionsNative,
  PreviewConfig,
  ReferenceDefinition as ReferenceDefinitionNative,
  ReferenceRule,
  ReferenceValue as ReferenceValueNative,
  RuleDef,
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
  TypeAliasDefinition as TypeAliasDefinitionNative,
  TypeReference as TypeReferenceNative,
  UrlDefinition as UrlDefinitionNative,
  UrlRule,
  WorkspaceOptions as WorkspaceOptionsNative,
} from "sanity";
import type {
  Except,
  IsStringLiteral,
  Merge,
  OmitIndexSignature,
  Simplify,
} from "type-fest";

import type {
  PortableTextBlock,
  PortableTextSpan,
} from "@portabletext-typed/types";
import type {
  BlockListItemDefault,
  BlockMarkDecoratorDefault,
  BlockStyleDefault,
} from "@portabletext-typed/types/src/internal";
import type {
  IsPlainObject,
  MaybeArray,
  ReadonlyTupleOfLength,
  TupleOfLength,
} from "@sanity-typed/utils";

// HACK Couldn't use type-fest's Merge >=3.0.0
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- When did this show up?
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
    optional: () => WithRequired<false, Rule>;
    required: (
      ...args: Parameters<Rule["required"]>
    ) => WithRequired<true, Rule>;
    [required]: TRequired;
    warning: (
      ...args: Parameters<Rule["warning"]>
    ) => WithRequired<false, Rule>;
  }
>;

type ValidationBuilder<
  TRequired extends boolean,
  Value,
  Rule extends RuleDef<Rule, Value>
> = (
  rule: WithRequired<false, Rule>
) => MaybeArray<WithRequired<TRequired | false, Rule>>;

export type DefinitionBase<
  TRequired extends boolean,
  Value,
  Rule extends RuleDef<Rule, Value>
> = {
  preview?: PreviewConfig;
  validation?: ValidationBuilder<TRequired, Value, Rule>;
};

export type GetOriginalRule<
  TDefinitionBase extends DefinitionBase<any, any, any>
> = TDefinitionBase extends DefinitionBase<any, any, infer Rule> ? Rule : never;

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

// HACK For whatever reason, typescript reduces complexity when "static" types are split out 🤷 https://github.com/saiichihashimoto/sanity-typed/issues/108
export type CrossDatasetReferenceValue = {
  _dataset: string;
  _projectId: string;
  _ref: string;
  _type: "crossDatasetReference";
  _weak?: boolean;
};

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

export type TitledListValue<T> = {
  _key?: string;
  title: string;
  value: T;
};

export type MaybeTitledListValue<T> = T | TitledListValue<T>;

export type NumberDefinition<
  TNumberValue extends number,
  TRequired extends boolean
> = MergeOld<
  NumberDefinitionNative,
  DefinitionBase<
    TRequired,
    TNumberValue,
    RewriteValue<TNumberValue, NumberRule>
  > & {
    options?: MergeOld<
      NumberOptions,
      {
        list?: MaybeTitledListValue<TNumberValue>[];
      }
    >;
  }
>;

/**
 * **WARNING!!!**
 *
 * This is *not* used during runtime in any way.
 *
 * ReferenceValue will not actually have a key of this symbol.
 *
 * This is only used to help with type inference.
 *
 * DO NOT rely on or use this symbol in runtime in any way. Typescript won't complain but it won't be there. We *cannot* change the output of sanity's content lake to include anything, especially symbols.
 *
 * This is also true for the other `@sanity-typed/*` packages. Although they import this symbol, it's only for type inference.
 */
export const referenced: unique symbol = Symbol("referenced");

export type ReferenceValue<
  TReferenced extends string,
  TReferenceWeak extends boolean = false
> = MergeOld<
  Omit<ReferenceValueNative, "_key" | "_strengthenOnPublish" | "_weak">,
  (true extends TReferenceWeak
    ? Pick<ReferenceValueNative, "_strengthenOnPublish"> & { _weak?: true }
    : unknown) & {
    _type: "reference";
    [referenced]: TReferenced;
  }
>;

type TypeReference<TReferenced extends string> = MergeOld<
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
  TReferenceWeak extends boolean,
  TRequired extends boolean
> = MergeOld<
  Omit<ReferenceDefinitionNative, "weak">,
  DefinitionBase<
    TRequired,
    ReferenceValue<TReferenced, TReferenceWeak>,
    RewriteValue<ReferenceValue<TReferenced, TReferenceWeak>, ReferenceRule>
  > & {
    to:
      | ReadonlyTupleOfLength<TypeReference<TReferenced>, 1>
      | TupleOfLength<TypeReference<TReferenced>, 1>;
    weak?: TReferenceWeak;
  }
>;

export type SlugValue = Required<SlugValueNative>;

export type SlugDefinition<TRequired extends boolean> = MergeOld<
  SlugDefinitionNative,
  DefinitionBase<TRequired, SlugValue, RewriteValue<SlugValue, SlugRule>>
>;

export type RegexRule<Rule extends RuleDef<Rule, any>> = MergeOld<
  {
    [key in keyof Rule]: Rule[key] extends (...args: infer Args) => Rule
      ? (...args: Args) => RegexRule<Rule>
      : Rule[key];
  },
  {
    regex: (
      ...args:
        | [
            pattern: RegExp,
            name: string,
            options: {
              invert?: boolean;
              // TODO why have name here when it's in the second arg?
              // name?: string;
            }
          ]
        | [
            pattern: RegExp,
            options: {
              invert?: boolean;
              name?: string;
            }
          ]
        | [pattern: RegExp, name: string]
        | [pattern: RegExp]
    ) => RegexRule<Rule>;
  }
>;

export type StringDefinition<
  TStringValue extends string,
  TRequired extends boolean
> = MergeOld<
  StringDefinitionNative,
  DefinitionBase<
    TRequired,
    TStringValue,
    RewriteValue<
      TStringValue,
      // @ts-expect-error TODO not sure why RegexRule causes an error
      RegexRule<StringRule>
    >
  > & {
    options?: MergeOld<
      StringOptions,
      {
        list?: MaybeTitledListValue<TStringValue>[];
      }
    >;
  }
>;

export type TextDefinition<TRequired extends boolean> = MergeOld<
  TextDefinitionNative,
  DefinitionBase<
    TRequired,
    string,
    // @ts-expect-error TODO not sure why RegexRule causes an error
    RegexRule<TextRule>
  >
>;

export type UrlDefinition<TRequired extends boolean> = MergeOld<
  UrlDefinitionNative,
  DefinitionBase<TRequired, string, UrlRule>
>;

type InferRawValue<Def extends DefinitionBase<any, any, any>> =
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
    of: TMemberDefinition[];
  }
>;

export type BlockStyleDefinition<Value extends string> = MergeOld<
  BlockStyleDefinitionNative,
  {
    value: Value;
  }
>;

export type BlockListDefinition<Value extends string> = MergeOld<
  BlockListDefinitionNative,
  {
    value: Value;
  }
>;

export type BlockDecoratorDefinition<Value extends string> = MergeOld<
  BlockDecoratorDefinitionNative,
  {
    value: Value;
  }
>;

export type BlockDefinition<
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = MergeOld<
  BlockDefinitionNative,
  DefinitionBase<
    TRequired,
    PortableTextBlock<
      TBlockMarkDecorator,
      InferRawValue<TBlockMarkAnnotation>,
      InferRawValue<TMemberDefinition> | PortableTextSpan<TBlockMarkDecorator>,
      TBlockStyle,
      TBlockListItem
    >,
    RewriteValue<
      PortableTextBlock<
        TBlockMarkDecorator,
        InferRawValue<TBlockMarkAnnotation>,
        | InferRawValue<TMemberDefinition>
        | PortableTextSpan<TBlockMarkDecorator>,
        TBlockStyle,
        TBlockListItem
      >,
      BlockRule
    >
  > & {
    lists?: ReadonlyArray<
      BlockListDefinition<
        TBlockListItem &
          (IsStringLiteral<TBlockListItem> extends false
            ? {
                [README]: "⛔️ Unfortunately, this needs an `as const` for correct types. ⛔️";
              }
            : unknown)
      >
    >;
    marks?: Omit<BlockMarksDefinition, "annotations" | "decorators"> & {
      annotations?: TBlockMarkAnnotation[];
      decorators?: ReadonlyArray<
        BlockDecoratorDefinition<
          TBlockMarkDecorator &
            (IsStringLiteral<TBlockMarkDecorator> extends false
              ? {
                  [README]: "⛔️ Unfortunately, this needs an `as const` for correct types. ⛔️";
                }
              : unknown)
        >
      >;
    };
    of?: TupleOfLength<TMemberDefinition, 1>;
    styles?: ReadonlyArray<
      BlockStyleDefinition<
        TBlockStyle &
          (IsStringLiteral<TBlockStyle> extends false
            ? {
                [README]: "⛔️ Unfortunately, this needs an `as const` for correct types. ⛔️";
              }
            : unknown)
      >
    >;
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
    fields: TFieldDefinition[];
  }
>;

// HACK For whatever reason, typescript reduces complexity when "static" types are split out 🤷 https://github.com/saiichihashimoto/sanity-typed/issues/108
type SanityDocumentBase = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: "document";
  _updatedAt: string;
};

export type SanityDocument<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<ObjectValue<TFieldDefinition> & SanityDocumentBase>;

export type AnySanityDocument = Merge<SanityDocument, { _type: string }>;

export type DocumentRule<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  }
> = RuleDef<DocumentRule<TFieldDefinition>, SanityDocument<TFieldDefinition>>;

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
    DocumentRule<TFieldDefinition>
  > & {
    fields: TFieldDefinition[];
  }
>;

// HACK For whatever reason, typescript reduces complexity when "static" types are split out 🤷 https://github.com/saiichihashimoto/sanity-typed/issues/108
type FileValueBase = {
  _type: "file";
  asset: ReferenceValue<"sanity.fileAsset", false>;
};

export type FileValue<
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<FileValueBase & ObjectValue<TFieldDefinition>>;

export type FileDefinition<
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

// HACK For whatever reason, typescript reduces complexity when "static" types are split out 🤷 https://github.com/saiichihashimoto/sanity-typed/issues/108
type ImageValueBase = {
  _type: "image";
  asset: ReferenceValue<"sanity.imageAsset", false>;
};

type ImageValueExtra = {
  crop: ImageCrop;
  hotspot: ImageHotspot;
};

export type ImageValue<
  THotspot extends boolean = false,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never
> = Simplify<
  ImageValueBase &
    ObjectValue<TFieldDefinition> &
    (THotspot extends true ? ImageValueExtra : unknown)
>;

export type ImageDefinition<
  THotspot extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TRequired extends boolean
> = MergeOld<
  ImageDefinitionNative,
  DefinitionBase<
    TRequired,
    ImageValue<THotspot, TFieldDefinition>,
    RewriteValue<ImageValue<THotspot, TFieldDefinition>, ImageRule>
  > & {
    fields?: TFieldDefinition[];
    options?: MergeOld<
      ImageOptions,
      {
        hotspot?: THotspot;
      }
    >;
  }
>;

type IntrinsicDefinitions<
  TNumberValue extends number,
  TStringValue extends string,
  TReferenced extends string,
  TReferenceWeak extends boolean,
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  THotspot extends boolean,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  },
  TMemberDefinition extends DefinitionBase<any, any, any> & { name?: string },
  TRequired extends boolean
> = {
  array: ArrayDefinition<TMemberDefinition, TRequired>;
  block: BlockDefinition<
    TBlockStyle,
    TBlockListItem,
    TBlockMarkDecorator,
    TBlockMarkAnnotation,
    TMemberDefinition,
    TRequired
  >;
  boolean: BooleanDefinition<TRequired>;
  crossDatasetReference: CrossDatasetReferenceDefinition<TRequired>;
  date: DateDefinition<TRequired>;
  datetime: DatetimeDefinition<TRequired>;
  document: DocumentDefinition<TFieldDefinition, TRequired>;
  email: EmailDefinition<TRequired>;
  file: FileDefinition<TFieldDefinition, TRequired>;
  geopoint: GeopointDefinition<TRequired>;
  image: ImageDefinition<THotspot, TFieldDefinition, TRequired>;
  number: NumberDefinition<TNumberValue, TRequired>;
  object: ObjectDefinition<TFieldDefinition, TRequired>;
  reference: ReferenceDefinition<TReferenced, TReferenceWeak, TRequired>;
  slug: SlugDefinition<TRequired>;
  string: StringDefinition<TStringValue, TRequired>;
  text: TextDefinition<TRequired>;
  url: UrlDefinition<TRequired>;
};

export type IntrinsicTypeName = Simplify<
  keyof IntrinsicDefinitions<
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
    any,
    any
  >
>;

declare const aliasedType: unique symbol;

type AliasValue<TType extends string> = {
  [aliasedType]: TType;
};

export type TypeAliasDefinition<
  TType extends string,
  TAlias extends IntrinsicTypeName,
  TNumberValue extends number,
  TStringValue extends string,
  TReferenced extends string,
  TReferenceWeak extends boolean,
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  THotspot extends boolean,
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
          TNumberValue,
          TStringValue,
          TReferenced,
          TReferenceWeak,
          TBlockStyle,
          TBlockListItem,
          TBlockMarkDecorator,
          TBlockMarkAnnotation,
          THotspot,
          TFieldDefinition,
          TMemberDefinition,
          TRequired
        >[TAlias]["options"]
      : unknown;
  }
>;

declare const type: unique symbol;

export type ArrayMemberDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TNumberValue extends number,
  TStringValue extends string,
  TReferenced extends string,
  TReferenceWeak extends boolean,
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  THotspot extends boolean,
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
              TNumberValue,
              TStringValue,
              TReferenced,
              TReferenceWeak,
              TBlockStyle,
              TBlockListItem,
              TBlockMarkDecorator,
              TBlockMarkAnnotation,
              THotspot,
              TFieldDefinition,
              TMemberDefinition,
              any
            >[type] extends DefinitionBase<any, infer Value, infer Rule>
              ? MergeOld<
                  IntrinsicDefinitions<
                    TNumberValue,
                    TStringValue,
                    TReferenced,
                    TReferenceWeak,
                    TBlockStyle,
                    TBlockListItem,
                    TBlockMarkDecorator,
                    TBlockMarkAnnotation,
                    THotspot,
                    TFieldDefinition,
                    TMemberDefinition,
                    any
                  >[type],
                  DefinitionBase<
                    any,
                    IsPlainObject<Value> extends false
                      ? Value
                      : IsStringLiteral<TName> extends false
                      ? Value
                      : Omit<Value, "_type"> & { _type: TName },
                    // @ts-expect-error TODO Doesn't match the rule for some reason
                    RewriteValue<
                      IsPlainObject<Value> extends false
                        ? Value
                        : IsStringLiteral<TName> extends false
                        ? Value
                        : Omit<Value, "_type"> & { _type: TName },
                      Rule
                    >
                  >
                >
              : IntrinsicDefinitions<
                  TNumberValue,
                  TStringValue,
                  TReferenced,
                  TReferenceWeak,
                  TBlockStyle,
                  TBlockListItem,
                  TBlockMarkDecorator,
                  TBlockMarkAnnotation,
                  THotspot,
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
            TNumberValue,
            TStringValue,
            TReferenced,
            TReferenceWeak,
            TBlockStyle,
            TBlockListItem,
            TBlockMarkDecorator,
            TBlockMarkAnnotation,
            THotspot,
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
    [type]?: "arrayMember";
    type: TType;
  };

// Arrays shouldn't be children of arrays, ever.
// https://www.sanity.io/docs/array-type#fNBIr84P
// But we give an option to do so, only so we can test the depth limit
export const makeDefineArrayMember =
  <AllowArrays extends boolean>() =>
  <
    TType extends string,
    TName extends string,
    TAlias extends IntrinsicTypeName,
    TStrict extends StrictDefinition,
    const TNumberValue extends number,
    const TStringValue extends string,
    const TReferenced extends string,
    const TReferenceWeak extends boolean = false,
    const TBlockStyle extends string = BlockStyleDefault,
    const TBlockListItem extends string = BlockListItemDefault,
    const TBlockMarkDecorator extends string = BlockMarkDecoratorDefault,
    TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
      name?: string;
    } = never,
    const THotspot extends boolean = false,
    TFieldDefinition extends DefinitionBase<any, any, any> & {
      name: string;
      [required]?: boolean;
    } = never,
    TMemberDefinition extends DefinitionBase<any, any, any> & {
      name?: string;
    } = never
  >(
    arrayOfSchema: ArrayMemberDefinition<
      TType,
      TName,
      TAlias,
      TStrict,
      TNumberValue,
      TStringValue,
      TReferenced,
      TReferenceWeak,
      TBlockStyle,
      TBlockListItem,
      TBlockMarkDecorator,
      TBlockMarkAnnotation,
      THotspot,
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

export const defineArrayMember = makeDefineArrayMember<false>();

export type FieldDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TNumberValue extends number,
  TStringValue extends string,
  TReferenced extends string,
  TReferenceWeak extends boolean,
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  THotspot extends boolean,
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
              TNumberValue,
              TStringValue,
              TReferenced,
              TReferenceWeak,
              TBlockStyle,
              TBlockListItem,
              TBlockMarkDecorator,
              TBlockMarkAnnotation,
              THotspot,
              TFieldDefinition,
              TMemberDefinition,
              TRequired
            >[type],
            "TODO why does this fail without the omit? we're clearly not using it"
          >;
        }[IntrinsicTypeName],
        { type: TType }
      >
    : Omit<
        TypeAliasDefinition<
          TType,
          TAlias,
          TNumberValue,
          TStringValue,
          TReferenced,
          TReferenceWeak,
          TBlockStyle,
          TBlockListItem,
          TBlockMarkDecorator,
          TBlockMarkAnnotation,
          THotspot,
          TFieldDefinition,
          TMemberDefinition,
          TRequired
        >,
        "TODO why does this fail without the omit? we're clearly not using it"
      >) & {
    name: TName;
    [required]?: TRequired;
    [type]?: "field";
    type: TType;
  };

export const defineField = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  const TNumberValue extends number,
  const TStringValue extends string,
  const TReferenced extends string,
  const TReferenceWeak extends boolean = false,
  const TBlockStyle extends string = BlockStyleDefault,
  const TBlockListItem extends string = BlockListItemDefault,
  const TBlockMarkDecorator extends string = BlockMarkDecoratorDefault,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never,
  const THotspot extends boolean = false,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never,
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never,
  TRequired extends boolean = false
>(
  schemaField: FieldDefinition<
    TType,
    TName,
    TAlias,
    TStrict,
    TNumberValue,
    TStringValue,
    TReferenced,
    TReferenceWeak,
    TBlockStyle,
    TBlockListItem,
    TBlockMarkDecorator,
    TBlockMarkAnnotation,
    THotspot,
    TFieldDefinition,
    TMemberDefinition,
    TRequired
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) => defineFieldNative(schemaField as any, defineOptions) as typeof schemaField;

export type TypeDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TNumberValue extends number,
  TStringValue extends string,
  TReferenced extends string,
  TReferenceWeak extends boolean,
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  THotspot extends boolean,
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
              TNumberValue,
              TStringValue,
              TReferenced,
              TReferenceWeak,
              TBlockStyle,
              TBlockListItem,
              TBlockMarkDecorator,
              TBlockMarkAnnotation,
              THotspot,
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
        TNumberValue,
        TStringValue,
        TReferenced,
        TReferenceWeak,
        TBlockStyle,
        TBlockListItem,
        TBlockMarkDecorator,
        TBlockMarkAnnotation,
        THotspot,
        TFieldDefinition,
        TMemberDefinition,
        any
      >) & {
    name: TName;
    [type]?: "type";
    type: TType;
  };

export const defineType = <
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  const TNumberValue extends number,
  const TStringValue extends string,
  const TReferenced extends string,
  const TReferenceWeak extends boolean = false,
  const TBlockStyle extends string = BlockStyleDefault,
  const TBlockListItem extends string = BlockListItemDefault,
  const TBlockMarkDecorator extends string = BlockMarkDecoratorDefault,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never,
  const THotspot extends boolean = false,
  TFieldDefinition extends DefinitionBase<any, any, any> & {
    name: string;
    [required]?: boolean;
  } = never,
  TMemberDefinition extends DefinitionBase<any, any, any> & {
    name?: string;
  } = never
>(
  schemaDefinition: TypeDefinition<
    TType,
    TName,
    TAlias,
    TStrict,
    TNumberValue,
    TStringValue,
    TReferenced,
    TReferenceWeak,
    TBlockStyle,
    TBlockListItem,
    TBlockMarkDecorator,
    TBlockMarkAnnotation,
    THotspot,
    TFieldDefinition,
    TMemberDefinition
  >,
  defineOptions?: DefineSchemaOptions<TStrict, TAlias>
) =>
  defineTypeNative(
    schemaDefinition as any,
    defineOptions
  ) as typeof schemaDefinition;

export type ConfigBase<
  TTypeDefinition extends TypeDefinition<
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
    any,
    any,
    any,
    any,
    any
  >,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive type
  TPluginOptions extends PluginOptions<any, any>
> = {
  plugins?: (PluginOptionsNative | TPluginOptions)[];
  schema?: MergeOld<
    SchemaPluginOptionsNative,
    {
      types?:
        | TTypeDefinition[]
        | (TTypeDefinition extends never
            ? never
            : ComposableOption<
                TTypeDefinition[],
                Omit<
                  ConfigContext,
                  "client" | "currentUser" | "getClient" | "schema"
                >
              >);
    }
  >;
};

export type PluginOptions<
  TTypeDefinition extends TypeDefinition<
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
    any,
    any,
    any,
    any,
    any
  >,
  TPluginOptions extends PluginOptions<any, any>
> = ConfigBase<TTypeDefinition, TPluginOptions> &
  Omit<PluginOptionsNative, "plugins" | "schema">;

export const definePlugin = <
  TTypeDefinition extends TypeDefinition<
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
    any,
    any,
    any,
    any,
    any
  >,
  TPluginOptions extends PluginOptions<any, any>,
  TOptions = void
>(
  arg:
    | PluginOptions<TTypeDefinition, TPluginOptions>
    | ((options: TOptions) => PluginOptions<TTypeDefinition, TPluginOptions>)
) =>
  definePluginNative(arg as any) as (
    options: TOptions
  ) => PluginOptions<TTypeDefinition, TPluginOptions>;

type WorkspaceOptions<
  TTypeDefinition extends TypeDefinition<
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
    any,
    any,
    any,
    any,
    any
  >,
  TPluginOptions extends PluginOptions<any, any>
> = MergeOld<
  WorkspaceOptionsNative,
  ConfigBase<TTypeDefinition, TPluginOptions>
>;

export type Config<
  TTypeDefinition extends TypeDefinition<
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
    any,
    any,
    any,
    any,
    any
  >,
  TPluginOptions extends PluginOptions<any, any>
> =
  | WorkspaceOptions<TTypeDefinition, TPluginOptions>[]
  | (Omit<
      WorkspaceOptions<TTypeDefinition, TPluginOptions>,
      "basePath" | "name"
    > & {
      basePath?: string;
      name?: string;
    });

export const defineConfig = <
  TTypeDefinition extends TypeDefinition<
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
    any,
    any,
    any,
    any,
    any
  >,
  TPluginOptions extends PluginOptions<any, any>
>(
  config: Config<TTypeDefinition, TPluginOptions>
) =>
  defineConfigNative(config as any) as typeof config extends any[]
    ? Extract<typeof config, any[]>
    : Exclude<typeof config, any[]>;

export type FileAsset = OmitIndexSignature<FileAssetNative>;

export type ImageAsset = MergeOld<
  OmitIndexSignature<ImageAssetNative>,
  {
    metadata: MergeOld<
      ImageAssetNative["metadata"],
      {
        // https://www.sanity.io/docs/image-metadata#3e05db6e3c80
        exif?: {
          [key: string]: unknown;
          _type: "sanity.imageExifMetadata";
        };
        // https://www.sanity.io/docs/image-metadata#df19f6f51379
        location?: GeopointValue;
      }
    >;
  }
>;

export type ImplicitDocuments = {
  [TImplicitDoc in
    | FileAsset
    | ImageAsset as TImplicitDoc["_type"]]: TImplicitDoc;
};

type ExpandAliasValues<
  Value,
  AliasedValues extends { [name: string]: any }
> = Value extends AliasValue<infer TType>
  ? AliasedValues[TType] extends never
    ? unknown
    : IsPlainObject<
        ExpandAliasValues<AliasedValues[TType], AliasedValues>
      > extends false
    ? ExpandAliasValues<AliasedValues[TType], AliasedValues>
    : Omit<ExpandAliasValues<AliasedValues[TType], AliasedValues>, "_type"> & {
        _type: Value extends { _type: infer TOverwriteType }
          ? TOverwriteType
          : TType;
      }
  : Value extends (infer Item)[]
  ? (Item extends never
      ? never
      : IsPlainObject<Item> extends false
      ? ExpandAliasValues<Item, AliasedValues>
      : ExpandAliasValues<Item, AliasedValues> & {
          _key: string;
        })[]
  : Value extends object
  ? {
      [key in keyof Value]: ExpandAliasValues<Value[key], AliasedValues>;
    }
  : Value;

export type InferSchemaValues<
  TConfig extends MaybeArray<ConfigBase<any, any>>
> = PluginOptionsNative extends TConfig
  ? object
  : TConfig extends MaybeArray<
      ConfigBase<infer TTypeDefinition, infer TPluginOptions>
    >
  ? Merge<
      ImplicitDocuments,
      {
        [TName in TTypeDefinition["name"]]: ExpandAliasValues<
          AliasValue<TName>,
          InferSchemaValues<TPluginOptions> & {
            [TDefinition in TypeDefinition<
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
              any,
              any,
              any,
              any,
              any
            > extends TTypeDefinition
              ? never
              : TTypeDefinition as TDefinition["name"]]: InferRawValue<TDefinition>;
          }
        >;
      }
    >
  : never;

export type DocumentValues<SanityValues extends InferSchemaValues<any>> =
  Extract<SanityValues[keyof SanityValues], AnySanityDocument>;

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
            ? ArrayMemberDefinition<
                TType,
                TName,
                NonNullable<TAlias>,
                TStrict,
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
                any,
                any
              >
            : never)
        | (Untyped extends ReturnType<
            typeof defineFieldNative<TType, TName, any, any, TAlias, TStrict>
          >
            ? FieldDefinition<
                TType,
                TName,
                NonNullable<TAlias>,
                TStrict,
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
                any,
                any
              >
            : never)
        | (Untyped extends ReturnType<
            typeof defineTypeNative<TType, TName, any, any, TAlias, TStrict>
          >
            ? TypeDefinition<
                TType,
                TName,
                NonNullable<TAlias>,
                TStrict,
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
            : never)
    : Untyped extends PluginNative<infer TOptions>
    ? ReturnType<typeof definePlugin<any, any, TOptions>>
    : {
        [README]: "⛔️ This can't be casted! Did you pass it the return value of a `define*` method from `sanity`?. ⛔️";
      };

export const castFromTyped = <Typed>(typed: Typed) =>
  typed as Typed extends TypeDefinition<
    infer TType extends string,
    infer TName extends string,
    infer TAlias extends IntrinsicTypeName,
    infer TStrict extends StrictDefinition,
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
    ? ReturnType<
        typeof defineTypeNative<
          TType,
          TName,
          { [key: string]: string },
          { [key: string]: any },
          TAlias,
          TStrict
        >
      >
    : Typed extends ArrayMemberDefinition<
        infer TType extends string,
        infer TName extends string,
        infer TAlias extends IntrinsicTypeName,
        infer TStrict extends StrictDefinition,
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
        any,
        any
      >
    ? ReturnType<
        typeof defineArrayMemberNative<
          TType,
          TName,
          { [key: string]: string },
          { [key in never]: any },
          TAlias,
          TStrict
        >
      >
    : Typed extends FieldDefinition<
        infer TType extends string,
        infer TName extends string,
        infer TAlias extends IntrinsicTypeName,
        infer TStrict extends StrictDefinition,
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
        any,
        any
      >
    ? ReturnType<
        typeof defineFieldNative<
          TType,
          TName,
          { [key: string]: string },
          { [key in never]: any },
          TAlias,
          TStrict
        >
      >
    : Typed extends (options: infer TOptions) => PluginOptions<any, any>
    ? PluginNative<TOptions>
    : {
        [README]: "⛔️ This can't be casted! Did you pass it the return value of a `define*` method from `sanity`?. ⛔️";
      };
