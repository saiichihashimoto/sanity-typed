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
  PipeFuncCallNode,
  PosNode,
  ProjectionNode,
  SliceNode,
  ThisNode,
  ValueNode,
} from "groq-js";
import type {
  IsStringLiteral,
  Join,
  Simplify as SimplifyNative,
  Split,
  UnionToIntersection,
} from "type-fest";

import type { ReferenceValue } from "@sanity-typed/types";

import type { TupleOfLength } from "./utils";

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

/** @private */
export type CleanGROQ<TExpression extends string> = RemovePlaceholders<
  RemoveWhitespace<AddPlaceholders<TExpression>>
>;

type _Parse<TExpression extends string> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  Expression<TExpression>;

export type Parse<TExpression extends string> = _Parse<CleanGROQ<TExpression>>;

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
type EscapeSequence = // TODO UnicodeEscapeSequence
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
              `\\'`, // TODO Replace all EscapeSequences
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
              `\\"`, // TODO Replace all EscapeSequences
              '"'
            >;
          }
      : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElement
 */
type ArrayElement<TArrayElement extends string> =
  TArrayElement extends `...${infer TExpression}`
    ? _Parse<TExpression> extends never
      ? never
      : { isSplat: true; type: "ArrayElement"; value: _Parse<TExpression> }
    : _Parse<TArrayElement> extends never
    ? never
    : {
        isSplat: false;
        type: "ArrayElement";
        value: _Parse<TArrayElement>;
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
      : _Parse<TExpression> extends never
      ? never
      : { type: "ObjectSplat"; value: _Parse<TExpression> }
    : TObjectAttribute extends `${infer TName}:${infer TExpression}`
    ? StringType<TName> extends never
      ? never
      : _Parse<TExpression> extends never
      ? never
      : {
          name: StringType<TName>["value"];
          type: "ObjectAttributeValue";
          value: _Parse<TExpression>;
        }
    : _Parse<TObjectAttribute> extends never
    ? never
    : DetermineName<_Parse<TObjectAttribute>> extends never
    ? never
    : {
        name: DetermineName<_Parse<TObjectAttribute>>;
        type: "ObjectAttributeValue";
        value: _Parse<TObjectAttribute>;
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

type Asc<TExpression extends string> = TExpression extends `${infer TBase} asc`
  ? _Parse<TBase> extends never
    ? never
    : {
        base: _Parse<TBase>;
        type: "Asc";
      }
  : never;

type Desc<TExpression extends string> =
  TExpression extends `${infer TBase} desc`
    ? _Parse<TBase> extends never
      ? never
      : {
          base: _Parse<TBase>;
          type: "Desc";
        }
    : never;

type FuncParse<TExpression extends string, TFuncFullName extends string> =
  | _Parse<TExpression>
  | (TFuncFullName extends "order"
      ? Asc<TExpression> | Desc<TExpression>
      : never);

type FuncArgs<
  TArgs extends string,
  TFuncFullName extends string = never,
  _Prefix extends string = ""
> = `${_Prefix}${TArgs}` extends ""
  ? []
  :
      | (FuncParse<`${_Prefix}${TArgs}`, TFuncFullName> extends never
          ? never
          : [FuncParse<`${_Prefix}${TArgs}`, TFuncFullName>])
      | (TArgs extends `${infer TFuncArg},${infer TFuncArgs}`
          ?
              | FuncArgs<TFuncArgs, TFuncFullName, `${_Prefix}${TFuncArg},`>
              | (FuncParse<`${_Prefix}${TFuncArg}`, TFuncFullName> extends never
                  ? never
                  : FuncArgs<TFuncArgs, TFuncFullName> extends never
                  ? never
                  : [
                      FuncParse<`${_Prefix}${TFuncArg}`, TFuncFullName>,
                      ...FuncArgs<TFuncArgs, TFuncFullName>
                    ])
          : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#FuncCall
 */
type FuncCall<TExpression extends string> =
  TExpression extends `${infer TFuncFullName}(${infer TFuncCallArgs})`
    ? FuncArgs<TFuncCallArgs> extends never
      ? never
      : TFuncFullName extends `${infer TFuncNamespace}::${infer TFuncIdentifier}`
      ? Identifier<TFuncNamespace> extends never
        ? never
        : Identifier<TFuncIdentifier> extends never
        ? never
        : {
            args: Simplify<FuncArgs<TFuncCallArgs>>;
            func: GroqFunction;
            name: TFuncNamespace extends "global"
              ? TFuncIdentifier
              : TFuncFullName;
            type: "FuncCall";
          }
      : Identifier<TFuncFullName> extends never
      ? never
      : {
          args: Simplify<FuncArgs<TFuncCallArgs>>;
          func: GroqFunction;
          name: TFuncFullName;
          type: "FuncCall";
        }
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

type Level1 =
  // TODO Pair
  { _TODO: "Pair" };

type Level2 = Level1 | OrNode;

type Level3 = AndNode | Level2;

type Level4 =
  | AscNode
  | DescNode
  | Level3
  | (OpCallNode & { op: "!=" | "<" | "<=" | "==" | ">" | ">=" });

type Level5 = // TODO https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Precedence-and-associativity
  Level4;

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
    ? { base: _Parse<TInnerExpression>; type: "Group" }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayPostfix
 */
type ArrayPostfix<TExpression extends string> =
  TExpression extends `${infer TBase}[]`
    ? Exclude<_Parse<TBase>, Level10> extends never
      ? never
      : { base: Exclude<_Parse<TBase>, Level10>; type: "ArrayCoerce" }
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
      | (Exclude<_Parse<`${_Prefix}${TBase}`>, Level10> extends never
          ? never
          :
              | {
                  [TOp in
                    | "..."
                    | ".."]: TBracketExpression extends `${infer TStart}${TOp}${infer TEnd}`
                    ? ConstantEvaluate<_Parse<TStart>> extends never
                      ? never
                      : ConstantEvaluate<_Parse<TEnd>> extends never
                      ? never
                      : ConstantEvaluate<_Parse<TStart>> extends number
                      ? ConstantEvaluate<_Parse<TEnd>> extends number
                        ? {
                            base: Exclude<
                              _Parse<`${_Prefix}${TBase}`>,
                              Level10
                            >;
                            isInclusive: TOp extends ".." ? true : false;
                            left: ConstantEvaluate<_Parse<TStart>>;
                            right: ConstantEvaluate<_Parse<TEnd>>;
                            type: "Slice";
                          }
                        : never
                      : never
                    : never;
                }["..." | ".."]
              | (ConstantEvaluate<_Parse<TBracketExpression>> extends never
                  ? never
                  : ConstantEvaluate<_Parse<TBracketExpression>> extends string
                  ? // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
                    MaybeMap<
                      Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>,
                      {
                        base: MaybeMapBase<
                          Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>
                        >;
                        name: ConstantEvaluate<_Parse<TBracketExpression>>;
                        type: "AccessAttribute";
                      }
                    >
                  : ConstantEvaluate<_Parse<TBracketExpression>> extends number
                  ? {
                      base: Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>;
                      index: ConstantEvaluate<_Parse<TBracketExpression>>;
                      type: "AccessElement";
                    }
                  : {
                      base: Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>;
                      expr: _Parse<TBracketExpression>;
                      type: "Filter";
                    }))
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
      | (Exclude<_Parse<`${_Prefix}${TBase}`>, Level10> extends never
          ? never
          : Identifier<TIdentifier> extends never
          ? never
          : MaybeMap<
              Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>,
              {
                base: MaybeMapBase<
                  Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>
                >;
                name: TIdentifier;
                type: "AccessAttribute";
              }
            >)
  : never;

type ProjectionInner<
  TBase extends string,
  TProjection extends string
> = Exclude<_Parse<TBase>, Level10> extends never
  ? never
  : ObjectType<`{${TProjection}}`> extends never
  ? never
  : MaybeMap<
      Exclude<_Parse<TBase>, Level10>,
      {
        base: MaybeMapBase<Exclude<_Parse<TBase>, Level10>>;
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
      | (Exclude<_Parse<`${_Prefix}${TBase}`>, Level10> extends never
          ? never
          : TIdentifier extends ""
          ? {
              base: Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>;
              type: "Deref";
            }
          : Identifier<TIdentifier> extends never
          ? never
          : MaybeMap<
              Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>,
              {
                base: {
                  base: MaybeMapBase<
                    Exclude<_Parse<`${_Prefix}${TBase}`>, Level10>
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
          _Parse<`${_Prefix}${TLeft}`>,
          BooleanOperators[NonNullable<TOp>]["leftLevel"]
        > extends never
          ? never
          : Exclude<
              _Parse<TRight>,
              BooleanOperators[NonNullable<TOp>]["rightLevel"]
            > extends never
          ? never
          : {
              left: Exclude<
                _Parse<`${_Prefix}${TLeft}`>,
                BooleanOperators[NonNullable<TOp>]["leftLevel"]
              >;
              right: Exclude<
                _Parse<TRight>,
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
      _Parse<TBase>,
      PrefixOperators[NonNullable<TOp>]["level"]
    > extends never
    ? never
    : {
        base: Exclude<
          _Parse<TBase>,
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
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Equality
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Comparison
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#In
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
  : TExpression extends `${infer TLeft}${TOp}${infer TRight}`
  ?
      | OpCall<TRight, TOp, `${_Prefix}${TLeft}${TOp}`>
      | (Exclude<
          _Parse<`${_Prefix}${TLeft}`>,
          Operators[NonNullable<TOp>]["leftLevel"]
        > extends never
          ? never
          : Exclude<
              _Parse<TRight>,
              Operators[NonNullable<TOp>]["rightLevel"]
            > extends never
          ? never
          : {
              left: Exclude<
                _Parse<`${_Prefix}${TLeft}`>,
                Operators[NonNullable<TOp>]["leftLevel"]
              >;
              op: TOp;
              right: Exclude<
                _Parse<TRight>,
                Operators[NonNullable<TOp>]["rightLevel"]
              >;
              type: "OpCall";
            })
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#OperatorCall
 */
type OperatorCall<TExpression extends string> =
  | BooleanOperator<TExpression>
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
  ?
      | (NonNullable<EvaluateBaseOrThis<TNode, TScope>> extends {
          [name in TNode["name"]]: infer TValue;
        }
          ? TValue
          : NonNullable<EvaluateBaseOrThis<TNode, TScope>> extends {
              [name in TNode["name"]]?: infer TValue;
            }
          ? TValue | undefined
          : null)
      | (null extends EvaluateBaseOrThis<TNode, TScope> ? null : never)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateElementAccess()
 */
type EvaluateAccessElement<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends AccessElementNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      Evaluate<TNode["base"], TScope>[TNode["index"]]
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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateDereference()
 */
type EvaluateDereference<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends DerefNode
  ? Evaluate<TNode["base"], TScope> extends ReferenceValue<infer TReferenced>
    ? TScope["context"]["dataset"] extends (infer TDataset)[]
      ?
          | Extract<TDataset, { _type: TReferenced }>
          | (Evaluate<TNode["base"], TScope> extends { weak: true }
              ? null
              : never)
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
            ? IsStringLiteral<TSep> extends false
              ? string
              : Join<TArr, TSep>
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
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_after()
     */
    after: TArgs extends []
      ? TScope extends {
          context: { delta: { after: infer TAfter } };
        }
        ? TAfter
        : null
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_before()
     */
    before: TArgs extends []
      ? TScope extends {
          context: { delta: { before: infer TBefore } };
        }
        ? TBefore
        : null
      : never;
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
    // TODO https://github.com/sanity-io/groq-js/issues/140
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_operation()
     */
    operation: TArgs extends []
      ? TScope extends {
          context: { delta: { after: infer TAfter; before: infer TBefore } };
        }
        ? TBefore extends null
          ? TAfter extends null
            ? never
            : "create"
          : TAfter extends null
          ? "delete"
          : "update"
        : never
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
        ? unknown extends TPrec
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
        ? number
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
          ? string extends TStr
            ? string[]
            : string extends TSep
            ? string[]
            : Split<TStr, TSep>
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
  ? TNode["name"] extends `${infer TFuncNamespace}::${infer TFuncIdentifier}`
    ? TFuncNamespace extends keyof Functions<any, any>
      ? TFuncIdentifier extends keyof Functions<any, any>[TFuncNamespace]
        ? EvaluateFuncArgs<TNode["args"], TScope> extends any[]
          ? Functions<
              EvaluateFuncArgs<TNode["args"], TScope>,
              TScope
            >[TFuncNamespace][TFuncIdentifier]
          : never
        : never
      : never
    : TNode["name"] extends keyof Functions<any, any>["global"]
    ? EvaluateFuncArgs<TNode["args"], TScope> extends any[]
      ? Functions<
          EvaluateFuncArgs<TNode["args"], TScope>,
          TScope
        >["global"][TNode["name"]]
      : never
    : never
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
              ? // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
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
      ? // ? undefined extends Evaluate<TAttribute["value"], TScope>
        //   ? {
        //       [key in TAttribute["name"]]?: Evaluate<TAttribute["value"], TScope>;
        //     }
        //   : { [key in TAttribute["name"]]: Evaluate<TAttribute["value"], TScope> }
        { [key in TAttribute["name"]]: Evaluate<TAttribute["value"], TScope> }
      : never)
  | (TAttribute extends ObjectSplatNode
      ? Evaluate<TAttribute["value"], TScope>
      : never);

type PartialOnUndefined<T> = Simplify<
  {
    [Key in keyof T as undefined extends T[Key] ? Key : never]?: T[Key];
  } & {
    [Key in keyof T as undefined extends T[Key] ? never : Key]: T[Key];
  }
>;

type EvaluateObjectAttributes<
  TAttributes extends ObjectAttributeNode[],
  TScope extends Scope<Context<any[], any>>
> = PartialOnUndefined<
  UnionToIntersection<
    {
      [Index in keyof TAttributes]: EvaluateObjectAttribute<
        TAttributes[Index],
        TScope
      >;
    }[number]
  >
>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateObject()
 */
type EvaluateObject<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends ObjectNode
  ? // Simplify<EvaluateObjectAttributes<TNode["attributes"], TScope>>
    EvaluateObjectAttributes<TNode["attributes"], TScope>
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

type PipeFunctions<TBase extends any[], TArgs extends any[]> = {
  global: {
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#order()
     */
    order: TArgs extends [] ? never : TBase[number][];
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
            ? // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
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

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateSlice()
 */
type EvaluateSlice<
  TNode extends ExprNode,
  TScope extends Scope<Context<any[], any>>
> = TNode extends SliceNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? Evaluate<TNode["base"], TScope>
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
  | EvaluateDereference<TNode, TScope>
  | EvaluateEquality<TNode, TScope>
  | EvaluateEverything<TNode, TScope>
  | EvaluateFilter<TNode, TScope>
  | EvaluateFuncCall<TNode, TScope>
  | EvaluateMap<TNode, TScope>
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

/** @private */
export type _ScopeFromPartialContext<
  TContext extends Partial<Context<any[], any>>
> = RootScope<Defaults<Context<any[], any>, TContext>>;

/** @private */
export type _ScopeFromPartialScope<
  TScope extends Partial<Scope<Context<any[], any>>>
> = Defaults<Scope<Context<any[], any>>, TScope>;
