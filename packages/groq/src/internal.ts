import type { PortableTextBlock } from "@portabletext/types";
import type { ClientConfig } from "@sanity/client";
import type {
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from "geojson";
import type {
  AccessAttributeNode,
  AccessElementNode,
  AndNode,
  ArrayCoerceNode,
  ArrayElementNode,
  ArrayNode,
  AscNode,
  ContextNode,
  DateTime,
  DerefNode,
  DescNode,
  EverythingNode,
  ExprNode,
  FilterNode,
  FuncCallNode,
  GroqFunction,
  GroqPipeFunction,
  GroupNode,
  InRangeNode,
  MapNode,
  NegNode,
  NotNode,
  ObjectAttributeNode,
  ObjectAttributeValueNode,
  ObjectNode,
  ObjectSplatNode,
  OpCallNode,
  OrNode,
  ParameterNode,
  ParentNode,
  Path,
  PipeFuncCallNode,
  PosNode,
  ProjectionNode,
  SelectAlternativeNode,
  SelectNode,
  SliceNode,
  ThisNode,
  ValueNode,
} from "groq-js";
import type {
  IsNever,
  IsUnknown,
  Join,
  SetOptional,
  Simplify as SimplifyNative,
  Split,
  UnionToIntersection,
} from "type-fest";

import type { ReferenceValue, referenced } from "@sanity-typed/types";
import type { IsPlainObject, TupleOfLength } from "@sanity-typed/utils";

type Simplify<AnyType> = SimplifyNative<AnyType> extends AnyType
  ? SimplifyNative<AnyType>
  : AnyType;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Query-context
 */
type Context<Dataset extends any[], DeltaElement extends Dataset[number]> = {
  client: ClientConfig;
  dataset: Dataset;
  delta: { after: DeltaElement | null; before: DeltaElement | null };
  identity: string;
  parameters: { [param: string]: any };
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Scope
 */
type Scope<TContext extends Context<any[], any>> = {
  context: TContext;
  parent: Scope<TContext> | null;
  this: any;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewNestedScope()
 */
type NestedScope<Value, TScope extends Scope<Context<any[], any>>> = {
  context: TScope["context"];
  parent: TScope;
  this: Value;
};

type EscapedDoubleQuote = "__ESCAPED__DOUBLE__QUOTE___";

type EscapedSingleQuote = "__ESCAPED__SINGLE__QUOTE___";

type PrefixWithSpace<TString extends string> =
  `__PREFIX__WITH_SPACE__${TString}___`;

type SurroundWithSpace<TString extends string> =
  `__SURROUNDED_WITH_SPACES__${TString}___`;

type AddPlaceholders<TString extends string> =
  TString extends `${infer TLeft} in ${infer TRight}`
    ? `${AddPlaceholders<TLeft>}${SurroundWithSpace<"in">}${AddPlaceholders<TRight>}`
    : TString extends `${infer TLeft} match ${infer TRight}`
    ? `${AddPlaceholders<TLeft>}${SurroundWithSpace<"match">}${AddPlaceholders<TRight>}`
    : TString extends `${infer TLeft} asc${infer TRight}`
    ? `${AddPlaceholders<TLeft>}${PrefixWithSpace<"asc">}${AddPlaceholders<TRight>}`
    : TString extends `${infer TLeft} desc${infer TRight}`
    ? `${AddPlaceholders<TLeft>}${PrefixWithSpace<"desc">}${AddPlaceholders<TRight>}`
    : TString extends `${infer TLeft}\\${infer TRight}`
    ? `${AddPlaceholders<TLeft>}${TRight extends `${infer TRightHead}${infer TRightRest}`
        ? `${TRightHead extends '"'
            ? EscapedDoubleQuote
            : TRightHead extends "'"
            ? EscapedSingleQuote
            : `\\${TRightHead}`}${AddPlaceholders<TRightRest>}`
        : `\\${TRight}`}`
    : TString;

type RemovePlaceholders<TString extends string> =
  TString extends `${infer TLeft}${SurroundWithSpace<infer TOp>}${infer TRight}`
    ? `${RemovePlaceholders<TLeft>} ${TOp} ${RemovePlaceholders<TRight>}`
    : TString extends `${infer TLeft}${PrefixWithSpace<
        infer TOp
      >}${infer TRight}`
    ? `${RemovePlaceholders<TLeft>} ${TOp}${RemovePlaceholders<TRight>}`
    : TString extends `${infer TLeft}${EscapedDoubleQuote}${infer TRight}`
    ? `${RemovePlaceholders<TLeft>}\\"${RemovePlaceholders<TRight>}`
    : TString extends `${infer TLeft}${EscapedSingleQuote}${infer TRight}`
    ? `${RemovePlaceholders<TLeft>}\\'${RemovePlaceholders<TRight>}`
    : TString;

type RemoveWhitespace<TExpression extends string> =
  TExpression extends `${infer TLeft}${'"'}${infer TQuoted}${'"'}${infer TRight}`
    ? `${RemoveWhitespace<TLeft>}${'"'}${TQuoted}${'"'}${RemoveWhitespace<TRight>}`
    : TExpression extends `${infer TLeft}${"'"}${infer TQuoted}${"'"}${infer TRight}`
    ? `${RemoveWhitespace<TLeft>}${"'"}${TQuoted}${"'"}${RemoveWhitespace<TRight>}`
    : TExpression extends `${infer TLeft}${"\n"}${infer TRight}`
    ? `${RemoveWhitespace<TLeft>}${RemoveWhitespace<TRight>}`
    : TExpression extends `${infer TLeft}${"\t"}${infer TRight}`
    ? `${RemoveWhitespace<TLeft>}${RemoveWhitespace<TRight>}`
    : TExpression extends `${infer TLeft}${"     "}${infer TRight}`
    ? `${RemoveWhitespace<TLeft>}${RemoveWhitespace<TRight>}`
    : TExpression extends `${infer TLeft}${" "}${infer TRight}`
    ? `${RemoveWhitespace<TLeft>}${RemoveWhitespace<TRight>}`
    : TExpression;

export type CleanGROQ<TExpression extends string> = RemovePlaceholders<
  RemoveWhitespace<AddPlaceholders<TExpression>>
>;

type ParseInner<TExpression extends string> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  Expression<TExpression>;

export type Parse<TExpression extends string> = ParseInner<
  CleanGROQ<TExpression>
>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Evaluate()
 */
export type Evaluate<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  EvaluateExpression<TNode, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Boolean
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Null
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Number
 */
type Primitives<TExpression extends string> = TExpression extends `+${number}`
  ? never
  : TExpression extends `-${number}`
  ? never
  : TExpression extends `.${string}`
  ? never
  : TExpression extends `${infer TValue extends boolean | number | null}`
  ? {
      type: "Value";
      value: TValue;
    }
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#SingleEscapeSequence
 */
type SingleEscapeSequence =
  | '"'
  | "'"
  | "/"
  | "\\"
  | "b"
  | "f"
  | "n"
  | "r"
  | "t";

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EscapeSequence
 */
type EscapeSequence = // TODO https://github.com/saiichihashimoto/sanity-typed/issues/331
  SingleEscapeSequence;

type ReplaceInString<
  TString extends string,
  TReplace extends string,
  TReplaceWith extends string = ""
> = TString extends `${infer TLeft}${TReplace}${infer TRight}`
  ? `${TLeft}${TReplaceWith}${ReplaceInString<TRight, TReplace, TReplaceWith>}`
  : TString;

type IfStringHas<
  TString extends string,
  THas extends string
> = TString extends `${string}${THas}${string}` ? true : false;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#String
 */
type StringType<TExpression extends string> =
  | (TExpression extends `'${infer TString}'`
      ? IfStringHas<
          ReplaceInString<TString, `\\${EscapeSequence}`>,
          "'"
        > extends true
        ? never
        : {
            type: "Value";
            value: ReplaceInString<
              TString,
              `\\'`, // TODO https://github.com/saiichihashimoto/sanity-typed/issues/331
              "'"
            >;
          }
      : never)
  | (TExpression extends `"${infer TString}"`
      ? IfStringHas<
          ReplaceInString<TString, `\\${EscapeSequence}`>,
          '"'
        > extends true
        ? never
        : {
            type: "Value";
            value: ReplaceInString<
              TString,
              `\\"`, // TODO https://github.com/saiichihashimoto/sanity-typed/issues/331
              '"'
            >;
          }
      : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElement
 */
type ArrayElement<TArrayElement extends string> =
  TArrayElement extends `...${infer TExpression}`
    ? ParseInner<TExpression> extends never
      ? never
      : { isSplat: true; type: "ArrayElement"; value: ParseInner<TExpression> }
    : ParseInner<TArrayElement> extends never
    ? never
    : {
        isSplat: false;
        type: "ArrayElement";
        value: ParseInner<TArrayElement>;
      };

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElements
 */
type ArrayElements<
  TArrayElements extends string,
  _Prefix extends string = ""
> = `${_Prefix}${TArrayElements}` extends ""
  ? []
  :
      | (ArrayElement<`${_Prefix}${TArrayElements}`> extends never
          ? never
          : [ArrayElement<`${_Prefix}${TArrayElements}`>])
      | (TArrayElements extends `${infer TArrayElement},${infer TRemaininingElements}`
          ?
              | ArrayElements<
                  TRemaininingElements,
                  `${_Prefix}${TArrayElement},`
                >
              | (ArrayElement<`${_Prefix}${TArrayElement}`> extends never
                  ? never
                  : ArrayElements<TRemaininingElements> extends never
                  ? never
                  : [
                      ArrayElement<`${_Prefix}${TArrayElement}`>,
                      ...ArrayElements<TRemaininingElements>
                    ])
          : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Array
 */
type ArrayType<TExpression extends string> =
  TExpression extends `[${infer TArrayElements}]`
    ? ArrayElements<TArrayElements> extends never
      ? never
      : {
          elements: ArrayElements<TArrayElements>;
          type: "Array";
        }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#DetermineName()
 */
type DetermineName<TNode extends ExprNode> =
  | Extract<TNode, AccessAttributeNode>["name"]
  | (TNode extends
      | AccessElementNode
      | ArrayCoerceNode
      | DerefNode
      | FilterNode
      | MapNode
      | ProjectionNode
      | SliceNode
      ? DetermineName<TNode["base"]>
      : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ObjectAttribute
 */
type ObjectAttribute<TObjectAttribute extends string> =
  TObjectAttribute extends `...${infer TExpression}`
    ? TExpression extends ""
      ? { type: "ObjectSplat"; value: { type: "This" } }
      : ParseInner<TExpression> extends never
      ? never
      : { type: "ObjectSplat"; value: ParseInner<TExpression> }
    : TObjectAttribute extends `${infer TName}:${infer TExpression}`
    ? StringType<TName> extends never
      ? never
      : ParseInner<TExpression> extends never
      ? never
      : {
          name: StringType<TName>["value"];
          type: "ObjectAttributeValue";
          value: ParseInner<TExpression>;
        }
    : ParseInner<TObjectAttribute> extends never
    ? never
    : DetermineName<ParseInner<TObjectAttribute>> extends never
    ? never
    : {
        name: DetermineName<ParseInner<TObjectAttribute>>;
        type: "ObjectAttributeValue";
        value: ParseInner<TObjectAttribute>;
      };

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ObjectAttributes
 */
type ObjectAttributes<
  TObjectAttributes extends string,
  _Prefix extends string = ""
> = `${_Prefix}${TObjectAttributes}` extends ""
  ? []
  :
      | (ObjectAttribute<`${_Prefix}${TObjectAttributes}`> extends never
          ? never
          : [ObjectAttribute<`${_Prefix}${TObjectAttributes}`>])
      | (TObjectAttributes extends `${infer TObjectAttribute},${infer TRemaininingAttributes}`
          ?
              | ObjectAttributes<
                  TRemaininingAttributes,
                  `${_Prefix}${TObjectAttribute},`
                >
              | (ObjectAttribute<`${_Prefix}${TObjectAttribute}`> extends never
                  ? never
                  : ObjectAttributes<TRemaininingAttributes> extends never
                  ? never
                  : [
                      ObjectAttribute<`${_Prefix}${TObjectAttribute}`>,
                      ...ObjectAttributes<TRemaininingAttributes>
                    ])
          : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Object
 */
type ObjectType<TExpression extends string> =
  TExpression extends `{${infer TObjectAttributes}}`
    ? ObjectAttributes<TObjectAttributes> extends never
      ? never
      : { attributes: ObjectAttributes<TObjectAttributes>; type: "Object" }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Literal
 */
type Literal<TExpression extends string> =
  | ArrayType<TExpression>
  | ObjectType<TExpression>
  | Primitives<TExpression>
  | StringType<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#This
 */
type This<TExpression extends string> = TExpression extends "@"
  ? { type: "This" }
  : never;

type AlphaLower =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
type AlphaUpper = Uppercase<AlphaLower>;
type Alpha = AlphaLower | AlphaUpper;
type Numeric = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type IdentifierRest<TIdentiferRest extends string> = TIdentiferRest extends ""
  ? true
  : TIdentiferRest extends `${
      | Alpha
      | Numeric
      | "_"}${infer TIdentifierRestInner}`
  ? IdentifierRest<TIdentifierRestInner>
  : false;

type Identifier<TIdentifer extends string> = TIdentifer extends `${
  | Alpha
  | "_"}${infer TIdentifierRest}`
  ? IdentifierRest<TIdentifierRest> extends true
    ? TIdentifer
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ThisAttribute
 */
type ThisAttribute<TExpression extends string> = TExpression extends `${
  | boolean
  | number
  | null}`
  ? never
  : Identifier<TExpression> extends never
  ? never
  : { name: TExpression; type: "AccessAttribute" };

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Everything
 */
type Everything<TExpression extends string> = TExpression extends "*"
  ? { type: "Everything" }
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parent
 */
type Parent<
  TExpression extends string,
  Levels extends null[] = [null]
> = TExpression extends "^"
  ? { n: Levels["length"]; type: "Parent" }
  : TExpression extends `^.${infer TParents}`
  ? Parent<TParents, [null, ...Levels]>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-geo-type
 */
export type Geo =
  | GeometryCollection
  | LineString
  | MultiLineString
  | MultiPoint
  | MultiPolygon
  | Point
  | Polygon
  | Position;

type Functions<
  TArgs extends any[],
  TScope extends Scope<Context<any[], any>>
> = {
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Array-namespace
   */
  array: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#array_compact()
     */
    compact: TArgs extends [infer TArr]
      ? TArr extends any[]
        ? TArr extends null[] | []
          ? []
          : TArr extends [infer THead, ...infer TTail]
          ? THead extends null
            ? Functions<[TTail], TScope>["array"]["compact"]
            : [THead, ...Functions<[TTail], TScope>["array"]["compact"]]
          : TArr extends (infer TElement)[]
          ? NonNullable<TElement>[]
          : never
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#array_join()
     */
    join: TArgs extends [infer TArr, infer TSep]
      ? TArr extends any[]
        ? TSep extends string
          ? Functions<[TArr[number]], TScope>["global"]["string"] extends string
            ? Join<TArr, TSep>
            : null
          : null
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#array_unique()
     */
    unique: TArgs extends [infer TArr]
      ? TArr extends any[]
        ? TArr extends null[] | []
          ? []
          : TArr extends [...infer TInitial, infer TLast]
          ? TLast extends boolean | number | string
            ? TLast extends Functions<
                [TInitial],
                TScope
              >["array"]["unique"][number]
              ? Functions<[TInitial], TScope>["array"]["unique"]
              : [...Functions<[TInitial], TScope>["array"]["unique"], TLast]
            : [...Functions<[TInitial], TScope>["array"]["unique"], TLast]
          : TArr
        : null
      : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Date-time-namespace
   */
  dateTime: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#dateTime_now()
     */
    now: TArgs extends [] ? DateTime : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Delta-namespace
   */
  delta: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#delta_operation()
     */
    operation: TArgs extends []
      ? TScope extends {
          context: { delta: { after: infer TAfter; before: infer TBefore } };
        }
        ? TBefore extends null
          ? TAfter extends null
            ? null
            : "create"
          : TAfter extends null
          ? "delete"
          : "update"
        : never
      : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Geography-Extension
   */
  geo: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#geo_contains()
     */
    contains: TArgs extends [infer TFirst, infer TSecond]
      ? TFirst extends Geo
        ? TSecond extends Geo
          ? boolean
          : null
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#geo_distance()
     */
    distance: TArgs extends [infer TFirst, infer TSecond]
      ? TFirst extends Point
        ? TSecond extends Point
          ? number
          : null
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#geo_intersects()
     */
    intersects: TArgs extends [infer TFirst, infer TSecond]
      ? TFirst extends Geo
        ? TSecond extends Geo
          ? boolean
          : null
        : null
      : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Global-namespace
   */
  global: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#boost()
     */
    boost: never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_coalesce()
     */
    coalesce: TArgs extends []
      ? null
      : TArgs extends [infer THead, ...infer TTail]
      ? null extends THead
        ? Functions<TTail, TScope>["global"]["coalesce"] | NonNullable<THead>
        : THead
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_count()
     */
    count: TArgs extends [infer TBase]
      ? TBase extends any[]
        ? TBase["length"]
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_dateTime()
     */
    dateTime: TArgs extends [infer TBase]
      ? TBase extends DateTime | string
        ? DateTime
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_defined()
     */
    defined: TArgs extends [infer TBase]
      ? TBase extends null
        ? false
        : true
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_geo()
     */
    geo: TArgs extends [infer TBase]
      ? TBase extends Geo
        ? TBase
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-identity-
     */
    identity: TArgs extends []
      ? TScope extends { context: { identity: infer TIdentity } }
        ? TIdentity
        : never
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_length()
     */
    length: TArgs extends [infer TBase]
      ? TBase extends any[] | string
        ? TBase["length"]
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_lower()
     */
    lower: TArgs extends [infer TValue]
      ? TValue extends string
        ? Lowercase<TValue>
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_now()
     */
    now: TArgs extends [] ? string : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-path-
     * @link https://www.sanity.io/docs/groq-functions#0ecd1b7eac78
     */
    path: TArgs extends (infer TBase)[]
      ? TBase extends string
        ? Path
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_pt()
     */
    pt: TArgs extends (infer TBase)[]
      ? TBase extends PortableTextBlock | PortableTextBlock[]
        ? TBase
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_references()
     */
    references: TArgs extends (infer TElement)[]
      ? Extract<Exclude<TElement, []>, string[] | string> extends never
        ? false
        : boolean
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_round()
     */
    round: TArgs extends [infer TNum, infer TPrec] | [infer TNum]
      ? TNum extends number
        ? IsUnknown<TPrec> extends true
          ? number
          : TPrec extends number
          ? number
          : null
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_string()
     */
    string: TArgs extends [infer TVal]
      ? TVal extends boolean | number | string
        ? `${TVal}`
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_upper()
     */
    upper: TArgs extends [infer TValue]
      ? TValue extends string
        ? Uppercase<TValue>
        : null
      : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Math-namespace
   */
  math: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_avg()
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_max()
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_min()
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_sum()
     */
    [mathFn in "avg" | "max" | "min" | "sum"]: TArgs extends [infer TArr]
      ? TArr extends null[] | []
        ? mathFn extends "sum"
          ? 0
          : null
        : TArr extends (number | null)[]
        ? mathFn extends "max" | "min"
          ? Exclude<TArr[number], null>
          : number
        : null
      : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Portable-Text-Extension
   */
  pt: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#pt_text()
     */
    text: TArgs extends (infer TBase)[]
      ? TBase extends PortableTextBlock | PortableTextBlock[]
        ? string
        : null
      : never;
  };
  /**
   * @link https://www.sanity.io/docs/groq-functions#61e2649fc0d8
   */
  sanity: {
    /**
     * @link https://www.sanity.io/docs/groq-functions#48b1e793d6b9
     */
    dataset: TArgs extends [] ? TScope["context"]["client"]["dataset"] : never;
    /**
     * @link https://www.sanity.io/docs/groq-functions#b89053823742
     */
    projectId: TArgs extends []
      ? TScope["context"]["client"]["projectId"]
      : never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-String-namespace
   */
  string: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#string_split()
     */
    split: TArgs extends [infer TStr, infer TSep]
      ? TStr extends string
        ? TSep extends string
          ? Split<TStr, TSep>
          : null
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#string_startsWith()
     */
    startsWith: TArgs extends [infer TStr, infer TPrefix]
      ? TStr extends string
        ? TPrefix extends string
          ? TStr extends `${TPrefix}${string}`
            ? true
            : false
          : null
        : null
      : never;
  };
};

type Asc<TExpression extends string> = TExpression extends `${infer TBase} asc`
  ? ParseInner<TBase> extends never
    ? never
    : {
        base: ParseInner<TBase>;
        type: "Asc";
      }
  : never;

type Desc<TExpression extends string> =
  TExpression extends `${infer TBase} desc`
    ? ParseInner<TBase> extends never
      ? never
      : {
          base: ParseInner<TBase>;
          type: "Desc";
        }
    : never;

type Pair<TExpression extends string> =
  TExpression extends `${infer TCondition}=>${infer TValue}`
    ? ParseInner<TCondition> extends never
      ? never
      : ParseInner<TValue> extends never
      ? never
      : {
          condition: ParseInner<TCondition>;
          type: "SelectAlternative";
          value: ParseInner<TValue>;
        }
    : never;

type FuncArgParse<TExpression extends string, TFuncFullName extends string> =
  | ParseInner<TExpression>
  | (TFuncFullName extends "order"
      ? Asc<TExpression> | Desc<TExpression>
      : never)
  | (TFuncFullName extends "select" ? Pair<TExpression> : never);

type FuncArgs<
  TArgs extends string,
  TFuncFullName extends string,
  _Prefix extends string = ""
> = `${_Prefix}${TArgs}` extends ""
  ? []
  :
      | (FuncArgParse<`${_Prefix}${TArgs}`, TFuncFullName> extends never
          ? never
          : [FuncArgParse<`${_Prefix}${TArgs}`, TFuncFullName>])
      | (TArgs extends `${infer TFuncArg},${infer TFuncArgs}`
          ?
              | FuncArgs<TFuncArgs, TFuncFullName, `${_Prefix}${TFuncArg},`>
              | (FuncArgParse<
                  `${_Prefix}${TFuncArg}`,
                  TFuncFullName
                > extends never
                  ? never
                  : FuncArgs<TFuncArgs, TFuncFullName> extends never
                  ? never
                  : [
                      FuncArgParse<`${_Prefix}${TFuncArg}`, TFuncFullName>,
                      ...FuncArgs<TFuncArgs, TFuncFullName>
                    ])
          : never);

// https://github.com/sanity-io/groq-js/blob/28dee3d75e9e32722dfb2291e1f58e1418e11bb8/src/parser.ts#L382
// before() and after() return ContextNodes instead
type FunctionsToOtherNodes<
  TFuncName extends string,
  TFuncArgs extends any[]
> = TFuncName extends "after" | "before"
  ? {
      key: TFuncName;
      type: "Context";
    }
  : TFuncName extends "select"
  ? TFuncArgs extends [
      ...infer TAlternatives extends SelectAlternativeNode[],
      infer TFallback extends ExprNode
    ]
    ? {
        alternatives: TAlternatives;
        fallback: TFallback;
        type: "Select";
      }
    : TFuncArgs extends infer TAlternatives extends SelectAlternativeNode[]
    ? {
        alternatives: TAlternatives;
        type: "Select";
      }
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#FuncCall
 */
type FuncCall<TExpression extends string> =
  TExpression extends `${infer TFuncFullName}(${infer TFuncCallArgs})`
    ? TFuncFullName extends `${infer TFuncNamespace}::${infer TFuncName}`
      ? TFuncNamespace extends keyof Functions<any, any>
        ? FuncArgs<TFuncCallArgs, TFuncNamespace> extends never
          ? never
          : TFuncName extends keyof Functions<any, any>[TFuncNamespace]
          ? {
              args: Simplify<FuncArgs<TFuncCallArgs, TFuncNamespace>>;
              func: GroqFunction;
              name: TFuncName;
              namespace: TFuncNamespace;
              type: "FuncCall";
            }
          : FunctionsToOtherNodes<
              TFuncName,
              Simplify<FuncArgs<TFuncCallArgs, TFuncNamespace>>
            >
        : never
      : FuncArgs<TFuncCallArgs, TFuncFullName> extends never
      ? never
      : TFuncFullName extends keyof Functions<any, any>["global"]
      ? {
          args: Simplify<FuncArgs<TFuncCallArgs, TFuncFullName>>;
          func: GroqFunction;
          name: TFuncFullName;
          namespace: "global";
          type: "FuncCall";
        }
      : FunctionsToOtherNodes<
          TFuncFullName,
          Simplify<FuncArgs<TFuncCallArgs, TFuncFullName>>
        >
    : never;

/**
 * @link https://www.sanity.io/docs/groq-parameters
 */
type Parameter<TExpression extends string> =
  TExpression extends `$${infer TIdentifier}`
    ? Identifier<TIdentifier> extends never
      ? never
      : {
          name: TIdentifier;
          type: "Parameter";
        }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#SimpleExpression
 */
type SimpleExpression<TExpression extends string> =
  | Everything<TExpression>
  | FuncCall<TExpression>
  | Parameter<TExpression>
  | Parent<TExpression>
  | This<TExpression>
  | ThisAttribute<TExpression>;

type Level1 = SelectAlternativeNode;

type Level2 = Level1 | OrNode;

type Level3 = AndNode | Level2;

type Level4 =
  | AscNode
  | DescNode
  | Level3
  | (OpCallNode & {
      op: "!=" | "<" | "<=" | "==" | ">" | ">=" | "in" | "match";
    });

type Level5 = Level4;

type Level6 = Level5 | (OpCallNode & { op: "-" | "+" });

type Level7 = Level6 | (OpCallNode & { op: "*" | "/" | "%" });

type Level8 = Level7 | NegNode;

type Level9 = Level8 | (OpCallNode & { op: "**" });

type Level10 = Level9 | NotNode | PosNode;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parenthesis
 */
type Parenthesis<TExpression extends string> =
  TExpression extends `(${infer TInnerExpression})`
    ? ParseInner<TInnerExpression> extends never
      ? never
      : { base: ParseInner<TInnerExpression>; type: "Group" }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayPostfix
 */
type ArrayPostfix<TExpression extends string> =
  TExpression extends `${infer TBase}[]`
    ? Exclude<ParseInner<TBase>, Level10> extends never
      ? never
      : { base: Exclude<ParseInner<TBase>, Level10>; type: "ArrayCoerce" }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ConstantEvaluate()
 */
type ConstantEvaluate<TNode extends ExprNode> =
  // HACK Not sure if giving a never scope works! https://github.com/sanity-io/groq-js/blob/main/src/evaluator/constantEvaluate.ts#L48
  Evaluate<TNode, never>;

type KnownArrayNode =
  | ArrayCoerceNode
  | ArrayNode
  | EverythingNode
  | FilterNode
  | MapNode
  | PipeFuncCallNode
  | SliceNode;

type MaybeMapBase<TBase extends ExprNode> = TBase extends never
  ? never
  : TBase extends KnownArrayNode
  ? { type: "This" }
  : TBase;

type MaybeMap<
  TBase extends ExprNode,
  TNode extends ExprNode
> = TBase extends never
  ? never
  : TNode extends never
  ? never
  : TBase extends KnownArrayNode
  ? {
      base: TBase;
      expr: TNode;
      type: "Map";
    }
  : TNode;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Range
 */
type Range<TExpression extends string> = {
  [TOp in
    | "..."
    | ".."]: TExpression extends `${infer TStart}${TOp}${infer TEnd}`
    ? ParseInner<TStart> extends never
      ? never
      : ParseInner<TEnd> extends never
      ? never
      : {
          isInclusive: TOp extends ".." ? true : false;
          left: ParseInner<TStart>;
          right: ParseInner<TEnd>;
          type: "Range";
        }
    : never;
}["..." | ".."];

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#SquareBracketTraversal
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#AttributeAccess
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ElementAccess
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Filter
 */
type SquareBracketTraversal<
  TExpression extends string,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}[${infer TBracketExpression}]`
  ?
      | SquareBracketTraversal<`${TBracketExpression}]`, `${_Prefix}${TBase}[`>
      | (Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10> extends never
          ? never
          :
              | (ConstantEvaluate<ParseInner<TBracketExpression>> extends never
                  ? never
                  : ConstantEvaluate<
                      ParseInner<TBracketExpression>
                    > extends string
                  ? // @ts-expect-error -- Type instantiation is excessively deep and possibly infinite.
                    MaybeMap<
                      Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>,
                      {
                        base: MaybeMapBase<
                          Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>
                        >;
                        name: ConstantEvaluate<ParseInner<TBracketExpression>>;
                        type: "AccessAttribute";
                      }
                    >
                  : ConstantEvaluate<
                      ParseInner<TBracketExpression>
                    > extends number
                  ? {
                      base: Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>;
                      index: ConstantEvaluate<ParseInner<TBracketExpression>>;
                      type: "AccessElement";
                    }
                  : {
                      base: Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>;
                      expr: ParseInner<TBracketExpression>;
                      type: "Filter";
                    })
              | (Range<TBracketExpression> extends never
                  ? never
                  : ConstantEvaluate<
                      Range<TBracketExpression>["left"]
                    > extends number
                  ? ConstantEvaluate<
                      Range<TBracketExpression>["right"]
                    > extends number
                    ? {
                        base: Exclude<
                          ParseInner<`${_Prefix}${TBase}`>,
                          Level10
                        >;
                        isInclusive: Range<TBracketExpression>["isInclusive"];
                        left: ConstantEvaluate<
                          Range<TBracketExpression>["left"]
                        >;
                        right: ConstantEvaluate<
                          Range<TBracketExpression>["right"]
                        >;
                        type: "Slice";
                      }
                    : never
                  : never))
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#AttributeAccess
 */
type AttributeAccess<
  TExpression extends string,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}.${infer TIdentifier}`
  ?
      | AttributeAccess<TIdentifier, `${_Prefix}${TBase}.`>
      | (Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10> extends never
          ? never
          : Identifier<TIdentifier> extends never
          ? never
          : MaybeMap<
              Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>,
              {
                base: MaybeMapBase<
                  Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>
                >;
                name: TIdentifier;
                type: "AccessAttribute";
              }
            >)
  : never;

type ProjectionInner<
  TBase extends string,
  TProjection extends string
> = Exclude<ParseInner<TBase>, Level10> extends never
  ? never
  : ObjectType<`{${TProjection}}`> extends never
  ? never
  : MaybeMap<
      Exclude<ParseInner<TBase>, Level10>,
      {
        base: MaybeMapBase<Exclude<ParseInner<TBase>, Level10>>;
        expr: ObjectType<`{${TProjection}}`>;
        type: "Projection";
      }
    >;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Projection
 */
type Projection<
  TExpression extends string,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}|{${infer TProjection}}`
  ?
      | Projection<`${TProjection}}`, `${_Prefix}${TBase}|{`>
      | ProjectionInner<`${_Prefix}${TBase}`, TProjection>
  : TExpression extends `${infer TBase}{${infer TProjection}}`
  ?
      | Projection<`${TProjection}}`, `${_Prefix}${TBase}{`>
      | ProjectionInner<`${_Prefix}${TBase}`, TProjection>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Dereference
 */
type Dereference<
  TExpression extends string,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}->${infer TIdentifier}`
  ?
      | Dereference<TIdentifier, `${_Prefix}${TBase}->`>
      | (Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10> extends never
          ? never
          : TIdentifier extends ""
          ? {
              base: Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>;
              type: "Deref";
            }
          : Identifier<TIdentifier> extends never
          ? never
          : MaybeMap<
              Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>,
              {
                base: {
                  base: MaybeMapBase<
                    Exclude<ParseInner<`${_Prefix}${TBase}`>, Level10>
                  >;
                  type: "Deref";
                };
                name: TIdentifier;
                type: "AccessAttribute";
              }
            >)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalExpression
 */
type TraversalExpression<TExpression extends string> =
  | ArrayPostfix<TExpression>
  | AttributeAccess<TExpression>
  | Dereference<TExpression>
  | Projection<TExpression>
  | SquareBracketTraversal<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#PipeFuncCall
 */
type PipeFuncCall<TExpression extends string> =
  TExpression extends `${infer TBase}|${infer TFuncFullName}(${infer TFuncCallArgs})`
    ? Parse<TBase> extends never
      ? never
      : FuncArgs<TFuncCallArgs, TFuncFullName> extends never
      ? never
      : TFuncFullName extends `${infer TFuncNamespace}::${infer TFuncIdentifier}`
      ? Identifier<TFuncNamespace> extends never
        ? never
        : Identifier<TFuncIdentifier> extends never
        ? never
        : {
            args: Simplify<FuncArgs<TFuncCallArgs, TFuncFullName>>;
            base: Parse<TBase>;
            func: GroqPipeFunction;
            name: TFuncNamespace extends "global"
              ? TFuncIdentifier
              : TFuncFullName;
            type: "PipeFuncCall";
          }
      : Identifier<TFuncFullName> extends never
      ? never
      : {
          args: Simplify<FuncArgs<TFuncCallArgs, TFuncFullName>>;
          base: Parse<TBase>;
          func: GroqPipeFunction;
          name: TFuncFullName;
          type: "PipeFuncCall";
        }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#CompoundExpression
 */
type CompoundExpression<TExpression extends string> =
  | Parenthesis<TExpression>
  | PipeFuncCall<TExpression>
  | TraversalExpression<TExpression>;

type BooleanOperators = {
  "&&": {
    leftLevel: Level2;
    rightLevel: Level3;
    stronger: false;
    type: "And";
    weaker: true;
  };
  "||": {
    leftLevel: Level1;
    rightLevel: Level2;
    stronger: true;
    type: "Or";
    weaker: false;
  };
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#And
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Or
 */
type BooleanOperator<
  TExpression extends string,
  TOp extends keyof BooleanOperators | null = null,
  _Prefix extends string = ""
> = TOp extends null
  ? {
      [TOp in keyof BooleanOperators]: BooleanOperator<TExpression, TOp>;
    }[keyof BooleanOperators]
  : TExpression extends `${infer TLeft}${TOp}${infer TRight}`
  ?
      | BooleanOperator<TRight, TOp, `${_Prefix}${TLeft}${TOp}`>
      | (Exclude<
          ParseInner<`${_Prefix}${TLeft}`>,
          BooleanOperators[NonNullable<TOp>]["leftLevel"]
        > extends never
          ? never
          : Exclude<
              ParseInner<TRight>,
              BooleanOperators[NonNullable<TOp>]["rightLevel"]
            > extends never
          ? never
          : {
              left: Exclude<
                ParseInner<`${_Prefix}${TLeft}`>,
                BooleanOperators[NonNullable<TOp>]["leftLevel"]
              >;
              right: Exclude<
                ParseInner<TRight>,
                BooleanOperators[NonNullable<TOp>]["rightLevel"]
              >;
              type: BooleanOperators[NonNullable<TOp>]["type"];
            })
  : never;

type PrefixOperators = {
  "!": { level: Exclude<Level9, NegNode>; type: "Not" };
  "+": { level: Exclude<Level9, NegNode>; type: "Pos" };
  "-": { level: Level7; type: "Neg" };
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Not
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#UnaryPlus
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#UnaryMinus
 */
type PrefixOperator<
  TExpression extends string,
  TOp extends keyof PrefixOperators | null = null
> = TOp extends null
  ? {
      [TOp in keyof PrefixOperators]: PrefixOperator<TExpression, TOp>;
    }[keyof PrefixOperators]
  : TExpression extends `${TOp}${infer TBase}`
  ? Exclude<
      ParseInner<TBase>,
      PrefixOperators[NonNullable<TOp>]["level"]
    > extends never
    ? never
    : {
        base: Exclude<
          ParseInner<TBase>,
          PrefixOperators[NonNullable<TOp>]["level"]
        >;
        type: PrefixOperators[NonNullable<TOp>]["type"];
      }
  : never;

type Operators = {
  "!=": { leftLevel: Level4; rightLevel: Level4 };
  "%": { leftLevel: Level6; rightLevel: Level7 };
  "*": {
    leftLevel: Level6;
    rightLevel: // HACK https://github.com/sanity-io/GROQ/issues/112
    EverythingNode | Level7;
  };
  "**": {
    leftLevel: Level9;
    rightLevel: // HACK Should be Level8, but NegNode on the right is fine
    Level7;
  };
  "+": { leftLevel: Level5; rightLevel: Level6 };
  "-": { leftLevel: Level5; rightLevel: Level6 };
  "/": { leftLevel: Level6; rightLevel: Level7 };
  "<": { leftLevel: Level4; rightLevel: Level4 };
  "<=": { leftLevel: Level4; rightLevel: Level4 };
  "==": { leftLevel: Level4; rightLevel: Level4 };
  ">": { leftLevel: Level4; rightLevel: Level4 };
  ">=": { leftLevel: Level4; rightLevel: Level4 };
  "match": { leftLevel: Level4; rightLevel: Level4; withSpaces: true };
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Equality
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Comparison
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Match
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Plus
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Minus
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Star
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Slash
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Percent
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#StarStar
 */
type OpCall<
  TExpression extends string,
  TOp extends keyof Operators | null = null,
  _Prefix extends string = ""
> = TOp extends null
  ? { [TOp in keyof Operators]: OpCall<TExpression, TOp> }[keyof Operators]
  : TExpression extends `${infer TLeft}${Operators[NonNullable<TOp>] extends {
      withSpaces: true;
    }
      ? ` ${TOp} `
      : TOp}${infer TRight}`
  ?
      | OpCall<
          TRight,
          TOp,
          `${_Prefix}${TLeft}${Operators[NonNullable<TOp>] extends {
            withSpaces: true;
          }
            ? ` ${TOp} `
            : TOp}`
        >
      | (Exclude<
          ParseInner<`${_Prefix}${TLeft}`>,
          Operators[NonNullable<TOp>]["leftLevel"]
        > extends never
          ? never
          : Exclude<
              ParseInner<TRight>,
              Operators[NonNullable<TOp>]["rightLevel"]
            > extends never
          ? never
          : {
              left: Exclude<
                ParseInner<`${_Prefix}${TLeft}`>,
                Operators[NonNullable<TOp>]["leftLevel"]
              >;
              op: TOp;
              right: Exclude<
                ParseInner<TRight>,
                Operators[NonNullable<TOp>]["rightLevel"]
              >;
              type: "OpCall";
            })
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#In
 */

type InOperator<
  TExpression extends string,
  _Prefix extends string = ""
> = TExpression extends `${infer TLeft} in ${infer TRight}`
  ? // | InOperator<TRight, `${_Prefix}${TLeft} in `>
    Exclude<ParseInner<`${_Prefix}${TLeft}`>, Level4> extends never
    ? never
    : Exclude<ParseInner<TRight>, Level4> extends never
    ? // TODO https://github.com/sanity-io/GROQ/issues/116
      Range<TRight> extends never
      ? never
      : {
          base: Exclude<ParseInner<`${_Prefix}${TLeft}`>, Level4>;
          isInclusive: Range<TRight>["isInclusive"];
          left: Range<TRight>["left"];
          right: Range<TRight>["right"];
          type: "InRange";
        }
    : {
        left: Exclude<ParseInner<`${_Prefix}${TLeft}`>, Level4>;
        op: "in";
        right: Exclude<ParseInner<TRight>, Level4>;
        type: "OpCall";
      }
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#OperatorCall
 */
type OperatorCall<TExpression extends string> =
  | BooleanOperator<TExpression>
  | InOperator<TExpression>
  | OpCall<TExpression>
  | PrefixOperator<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Expression
 */
type Expression<TExpression extends string> =
  | CompoundExpression<TExpression>
  | Literal<TExpression>
  | OperatorCall<TExpression>
  | SimpleExpression<TExpression>;

type EvaluateBaseOrThis<
  TNode extends AccessAttributeNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends { base: infer TBase extends ExprNode }
  ? Evaluate<TBase, TScope>
  : TScope["this"];

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateAttributeAccess()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateThisAttribute()
 */
type EvaluateAccessAttribute<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends AccessAttributeNode
  ? EvaluateBaseOrThis<TNode, TScope> extends object
    ? EvaluateBaseOrThis<TNode, TScope> extends {
        [name in TNode["name"]]: infer TValue;
      }
      ? TValue
      : EvaluateBaseOrThis<TNode, TScope> extends {
          [name in TNode["name"]]?: infer TValue;
        }
      ? TValue | undefined
      : null
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateElementAccess()
 */
type EvaluateAccessElement<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends AccessElementNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? TNode["index"] extends keyof Evaluate<TNode["base"], TScope>
      ? Evaluate<TNode["base"], TScope>[TNode["index"]]
      : null
    : null
  : never;

type FlattenDoubleArray<TArray extends any[][]> = TArray extends []
  ? []
  : TArray extends [infer THead extends any[], ...infer TTail extends any[][]]
  ? [...THead, ...FlattenDoubleArray<TTail>]
  : TArray extends (infer TElement extends any[])[]
  ? TElement[number][]
  : never;

type EvaluateArrayElement<
  TElement extends ArrayElementNode,
  TScope extends Scope<Context<any[], any>>
> = TElement["isSplat"] extends true
  ? Evaluate<TElement["value"], TScope> extends any[]
    ? Evaluate<TElement["value"], TScope>
    : [Evaluate<TElement["value"], TScope>]
  : [Evaluate<TElement["value"], TScope>];

type EvaluateArrayElements<
  TElements extends ArrayElementNode[],
  TScope extends Scope<Context<any[], any>>
> = FlattenDoubleArray<{
  [Index in keyof TElements]: EvaluateArrayElement<TElements[Index], TScope>;
}>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateArray()
 */
type EvaluateArray<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ArrayNode
  ? EvaluateArrayElements<TNode["elements"], TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateArrayPostfix()
 */
type EvaluateArrayPostfix<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ArrayCoerceNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? Evaluate<TNode["base"], TScope>
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateAnd()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateOr()
 */
type EvaluateBooleanOperator<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends AndNode | OrNode
  ? TNode extends {
      left: infer TLeft extends ExprNode;
      right: infer TRight extends ExprNode;
      type: infer TType;
    }
    ? Extract<
        BooleanOperators[keyof BooleanOperators],
        { type: TType }
      > extends {
        stronger: infer TStronger;
        weaker: infer TWeaker;
      }
      ? Evaluate<TLeft, TScope> extends TStronger
        ? TStronger
        : Evaluate<TRight, TScope> extends TStronger
        ? TStronger
        : Evaluate<TLeft, TScope> extends TWeaker
        ? Evaluate<TRight, TScope> extends TWeaker
          ? TWeaker
          : null
        : null
      : never
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateComparison()
 */
type EvaluateComparison<TNode extends ExprNode> = TNode extends OpCallNode & {
  op: "<" | "<=" | ">" | ">=";
}
  ? boolean
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_after()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_before()
 */
type EvaluateContext<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ContextNode
  ? TNode extends { key: infer TKey extends "after" | "before" }
    ? TScope extends { context: { delta: { [key in TKey]: infer TValue } } }
      ? TValue
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateDereference()
 */
type EvaluateDereference<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends DerefNode
  ? Evaluate<TNode["base"], TScope> extends SetOptional<
      ReferenceValue<infer TReferenced>,
      typeof referenced
    > & { _ref: infer TRef }
    ? TScope["context"]["dataset"] extends (infer TDataset)[]
      ? IsNever<
          Extract<TDataset, { _id: TRef; _type: TReferenced }>
        > extends true
        ? null
        : Extract<TDataset, { _id: TRef; _type: TReferenced }>
      : null
    : null
  : never;

type Not<TBoolean, Enabled extends boolean = true> = TBoolean extends boolean
  ? Enabled extends false
    ? TBoolean
    : TBoolean extends true
    ? false
    : true
  : null;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateEquality()
 */
type EvaluateEquality<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends OpCallNode & { op: "!=" | "==" }
  ? Not<
      Evaluate<TNode["left"], TScope> extends Evaluate<TNode["right"], TScope>
        ? true
        : Evaluate<TNode["right"], TScope> extends Evaluate<
            TNode["left"],
            TScope
          >
        ? true
        : false,
      TNode["op"] extends "!=" ? true : false
    >
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateEverything()
 */
type EvaluateEverything<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends EverythingNode ? TScope["context"]["dataset"] : never;

type EvaluateFilterElement<
  TElement,
  TFilterExpression extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TElement extends never
  ? never
  : Evaluate<TFilterExpression, NestedScope<TElement, TScope>> extends never
  ? never
  : Evaluate<TFilterExpression, NestedScope<TElement, TScope>> extends true
  ? [TElement]
  : [];

type EvaluateFilterElements<
  TBase extends any[],
  TFilterExpression extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = FlattenDoubleArray<{
  [Index in keyof TBase]: EvaluateFilterElement<
    TBase[Index],
    TFilterExpression,
    TScope
  >;
}>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateFilter()
 */
type EvaluateFilter<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends FilterNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? EvaluateFilterElements<
        Evaluate<TNode["base"], TScope>,
        TNode["expr"],
        TScope
      >
    : Evaluate<TNode["base"], TScope>
  : never;

type EvaluateFuncArgs<
  TArgs extends ExprNode[],
  TScope extends Scope<Context<any[], any>>
> = {
  [key in keyof TArgs]: Evaluate<TArgs[key], TScope>;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateFuncCall()
 */
type EvaluateFuncCall<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends FuncCallNode
  ? TNode extends {
      name: infer TFuncName;
      namespace: infer TFuncNamespace;
    }
    ? TFuncNamespace extends keyof Functions<any, any>
      ? TFuncName extends keyof Functions<any, any>[TFuncNamespace]
        ? EvaluateFuncArgs<TNode["args"], TScope> extends any[]
          ? Functions<
              EvaluateFuncArgs<TNode["args"], TScope>,
              TScope
            >[TFuncNamespace][TFuncName]
          : never
        : never
      : never
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateIn()
 */
type EvaluateIn<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends OpCallNode & { op: "in" }
  ? Evaluate<TNode["right"], TScope> extends any[]
    ? Evaluate<TNode["left"], TScope> extends Evaluate<
        TNode["right"],
        TScope
      >[number]
      ? true
      : false
    : Evaluate<TNode["right"], TScope> extends Path
    ? Evaluate<TNode["left"], TScope> extends string
      ? boolean
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateIn()
 */
type EvaluateInRange<TNode extends ExprNode> = TNode extends InRangeNode
  ? boolean
  : never;

type EmptyObject = { [key: string]: never };

type EvaluateMapElements<
  TBases extends any[],
  TExpression extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = {
  [index in keyof TBases]: Evaluate<
    TExpression,
    NestedScope<TBases[index], TScope>
  >;
};

type EvaluateMap<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends MapNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? EvaluateMapElements<
        Evaluate<TNode["base"], TScope>,
        TNode["expr"],
        TScope
      >
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateMatch()
 */
type EvaluateMatch<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends OpCallNode & { op: "match" }
  ? Evaluate<TNode["left"], TScope> extends string[] | string
    ? Evaluate<TNode["right"], TScope> extends string[] | string
      ? boolean
      : never
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluatePlus()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateMinus()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateStar()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateSlash()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluatePercent()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateStarStar()
 */
type EvaluateMath<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends OpCallNode
  ?
      | (TNode extends { op: "-" }
          ? Evaluate<TNode["left"], TScope> extends DateTime
            ? Evaluate<TNode["right"], TScope> extends DateTime
              ? number
              : Evaluate<TNode["right"], TScope> extends number
              ? DateTime
              : null
            : Evaluate<TNode["left"], TScope> extends number
            ? Evaluate<TNode["right"], TScope> extends number
              ? number
              : null
            : null
          : never)
      | (TNode extends { op: "*" | "**" | "/" | "%" }
          ? Evaluate<TNode["left"], TScope> extends number
            ? Evaluate<TNode["right"], TScope> extends number
              ? number
              : null
            : null
          : never)
      | (TNode extends { op: "+" }
          ? Evaluate<TNode["left"], TScope> extends DateTime
            ? Evaluate<TNode["right"], TScope> extends number
              ? DateTime
              : null
            : Evaluate<TNode["left"], TScope> extends string
            ? Evaluate<TNode["right"], TScope> extends string
              ? // @ts-expect-error -- Type instantiation is excessively deep and possibly infinite.
                `${Evaluate<TNode["left"], TScope>}${Evaluate<
                  TNode["right"],
                  TScope
                >}`
              : null
            : Evaluate<TNode["left"], TScope> extends number
            ? Evaluate<TNode["right"], TScope> extends number
              ? number
              : null
            : Evaluate<TNode["left"], TScope> extends any[]
            ? Evaluate<TNode["right"], TScope> extends any[]
              ? [
                  ...Evaluate<TNode["left"], TScope>,
                  ...Evaluate<TNode["right"], TScope>
                ]
              : null
            : Evaluate<TNode["left"], TScope> extends object
            ? Evaluate<TNode["right"], TScope> extends object
              ? Simplify<
                  EmptyObject extends Evaluate<TNode["right"], TScope>
                    ? Evaluate<TNode["left"], TScope>
                    : Evaluate<TNode["right"], TScope> &
                        Omit<
                          Evaluate<TNode["left"], TScope>,
                          keyof Evaluate<TNode["right"], TScope>
                        >
                >
              : null
            : null
          : never)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateNeg()
 */
type EvaluateNeg<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends NegNode
  ? Evaluate<TNode["base"], TScope> extends number
    ? `-${Evaluate<
        TNode["base"],
        TScope
      >}` extends `${infer TNum extends number}`
      ? TNum
      : `${Evaluate<
          TNode["base"],
          TScope
        >}` extends `-${infer TNum extends number}`
      ? TNum
      : Evaluate<TNode["base"], TScope>
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateNot()
 */
type EvaluateNot<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends NotNode ? Not<Evaluate<TNode["base"], TScope>> : never;

type EvaluateObjectAttribute<
  TAttribute extends ObjectAttributeNode,
  TScope extends Scope<Context<any[], any>>
> =
  | (TAttribute extends ObjectAttributeValueNode
      ? {
          [key in TAttribute["name"]]: undefined extends Evaluate<
            TAttribute["value"],
            TScope
          >
            ? NonNullable<Evaluate<TAttribute["value"], TScope>> | null
            : Evaluate<TAttribute["value"], TScope>;
        }
      : never)
  | (TAttribute extends ObjectSplatNode
      ? Evaluate<TAttribute["value"], TScope>
      : never);

type EvaluateObjectAttributes<
  TAttributes extends ObjectAttributeNode[],
  TScope extends Scope<Context<any[], any>>
> = {
  [Index in keyof TAttributes]-?: EvaluateObjectAttribute<
    TAttributes[Index],
    TScope
  >;
}[number] extends never
  ? NonNullable<unknown>
  : UnionToIntersection<
      {
        [Index in keyof TAttributes]-?: EvaluateObjectAttribute<
          TAttributes[Index],
          TScope
        >;
      }[number]
    >;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateObject()
 */
type EvaluateObject<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ObjectNode
  ? Simplify<EvaluateObjectAttributes<TNode["attributes"], TScope>>
  : never;

/**
 * @link https://www.sanity.io/docs/groq-parameters
 */
type EvaluateParameter<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ParameterNode
  ? TScope["context"]["parameters"][TNode["name"]]
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateParent()
 */
type EvaluateParent<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>,
  Level extends number = Extract<TNode, ParentNode>["n"]
> = TNode extends ParentNode
  ? Level extends 0
    ? TScope["this"]
    : TScope["parent"] extends null
    ? null
    : EvaluateParent<
        TNode,
        NonNullable<TScope["parent"]>,
        TupleOfLength<null, Level, Level> extends [any, ...infer Rest]
          ? Rest["length"]
          : never
      >
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateParenthesis()
 */
type EvaluateParenthesis<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends GroupNode ? Evaluate<TNode["base"], TScope> : never;

/**
 * Whenever a tuple is reordered, we can't be certain what the types are.
 * So each member is a union of all members.
 * We also map instead of TArray[number][] to ensure the length of the tuple is perserved.
 */
type TupleToUnionArray<TArray extends any[]> = {
  [Index in keyof TArray]: TArray[number];
};

type PipeFunctions<TBase extends any[], TArgs extends any[]> = {
  global: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#order()
     */
    order: TArgs extends [] ? never : TupleToUnionArray<TBase>;
    // HACK As long as the args evaluate, we don't actually use them so... why bother evaluating boost at all?
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#score()
     */
    score: TArgs extends []
      ? never
      : TBase extends (infer Element)[]
      ? (IsPlainObject<Element> extends false
          ? never
          : Element & { _score: number })[]
      : never;
  };
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluatePipeFuncCall()
 */
type EvaluatePipeFuncCall<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends PipeFuncCallNode
  ? TNode["name"] extends `${infer TFuncNamespace}::${infer TFuncIdentifier}`
    ? TFuncNamespace extends keyof PipeFunctions<any, any>
      ? TFuncIdentifier extends keyof PipeFunctions<any, any>[TFuncNamespace]
        ? EvaluateFuncArgs<TNode["args"], TScope> extends any[]
          ? Evaluate<TNode["base"], TScope> extends any[]
            ? // @ts-expect-error -- Type instantiation is excessively deep and possibly infinite.
              PipeFunctions<
                Evaluate<TNode["base"], TScope>,
                EvaluateFuncArgs<TNode["args"], TScope>
              >[TFuncNamespace][TFuncIdentifier]
            : null
          : never
        : never
      : never
    : TNode["name"] extends keyof PipeFunctions<any, any>["global"]
    ? EvaluateFuncArgs<TNode["args"], TScope> extends any[]
      ? Evaluate<TNode["base"], TScope> extends any[]
        ? PipeFunctions<
            Evaluate<TNode["base"], TScope>,
            EvaluateFuncArgs<TNode["args"], TScope>
          >["global"][TNode["name"]]
        : null
      : never
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluatePos()
 */
type EvaluatePos<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends PosNode
  ? Evaluate<TNode["base"], TScope> extends number
    ? Evaluate<TNode["base"], TScope>
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateProjection()
 */
type EvaluateProjection<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ProjectionNode
  ? Evaluate<
      TNode["expr"],
      NestedScope<Evaluate<TNode["base"], TScope>, TScope>
    >
  : never;

type EvaluateSelectAlternatives<
  TAlternatives extends SelectAlternativeNode[],
  TFallback extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TAlternatives extends []
  ? Evaluate<TFallback, TScope>
  : TAlternatives extends [
      infer TFirstAlternative extends SelectAlternativeNode,
      ...infer TRemainingAlternatives extends SelectAlternativeNode[]
    ]
  ?
      | (Evaluate<TFirstAlternative["condition"], TScope> extends true
          ? never
          : EvaluateSelectAlternatives<
              TRemainingAlternatives,
              TFallback,
              TScope
            >)
      | (true extends Evaluate<TFirstAlternative["condition"], TScope>
          ? Evaluate<TFirstAlternative["value"], TScope>
          : never)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_select()
 */
type EvaluateSelect<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends SelectNode
  ? TNode extends {
      alternatives: infer TAlternatives extends SelectAlternativeNode[];
      fallback: infer TFallback extends ExprNode;
    }
    ? EvaluateSelectAlternatives<TAlternatives, TFallback, TScope>
    : TNode extends {
        alternatives: infer TAlternatives extends SelectAlternativeNode[];
      }
    ? EvaluateSelectAlternatives<
        TAlternatives,
        { type: "Value"; value: null },
        TScope
      >
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateSlice()
 */
type EvaluateSlice<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends SliceNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? // HACK Since literally slicing a tuple in typescript isn't feasible, the most correct type is an array of unions
      Evaluate<TNode["base"], TScope>[number][]
    : null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateThis()
 */
type EvaluateThis<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ThisNode ? TScope["this"] : never;

type EvaluateValue<TNode extends ExprNode> = Extract<TNode, ValueNode>["value"];

type EvaluateExpression<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> =
  | EvaluateAccessAttribute<TNode, TScope>
  | EvaluateAccessElement<TNode, TScope>
  | EvaluateArray<TNode, TScope>
  | EvaluateArrayPostfix<TNode, TScope>
  | EvaluateBooleanOperator<TNode, TScope>
  | EvaluateComparison<TNode>
  | EvaluateContext<TNode, TScope>
  | EvaluateDereference<TNode, TScope>
  | EvaluateEquality<TNode, TScope>
  | EvaluateEverything<TNode, TScope>
  | EvaluateFilter<TNode, TScope>
  | EvaluateFuncCall<TNode, TScope>
  | EvaluateIn<TNode, TScope>
  | EvaluateInRange<TNode>
  | EvaluateMap<TNode, TScope>
  | EvaluateMatch<TNode, TScope>
  | EvaluateMath<TNode, TScope>
  | EvaluateNeg<TNode, TScope>
  | EvaluateNot<TNode, TScope>
  | EvaluateObject<TNode, TScope>
  | EvaluateParameter<TNode, TScope>
  | EvaluateParent<TNode, TScope>
  | EvaluateParenthesis<TNode, TScope>
  | EvaluatePipeFuncCall<TNode, TScope>
  | EvaluatePos<TNode, TScope>
  | EvaluateProjection<TNode, TScope>
  | EvaluateSelect<TNode, TScope>
  | EvaluateSlice<TNode, TScope>
  | EvaluateThis<TNode, TScope>
  | EvaluateValue<TNode>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewRootScope()
 */
export type RootScope<TContext extends Context<any[], any>> = {
  context: TContext;
  parent: null;
  this: null;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ExecuteQuery()
 */
export type ExecuteQuery<
  TQuery extends string,
  TScope extends Scope<Context<any[], any>> = RootScope<Context<never[], never>>
> = Simplify<Evaluate<Parse<TQuery>, TScope>>;

type Defaults<Value, PartialValue extends Partial<Value>> = {
  [Key in keyof Value]: Key extends keyof PartialValue
    ? NonNullable<PartialValue[Key]>
    : Value[Key];
};

export type ScopeFromPartialContext<
  TContext extends Partial<Context<any[], any>>
> = RootScope<Defaults<Context<any[], any>, TContext>>;

export type ScopeFromPartialScope<
  TScope extends Partial<Scope<Context<any[], any>>>
> = Defaults<Scope<Context<any[], any>>, TScope>;
