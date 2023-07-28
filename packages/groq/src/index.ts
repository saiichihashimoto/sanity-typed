import type {
  AccessAttributeNode,
  AccessElementNode,
  ArrayCoerceNode,
  ArrayElementNode,
  ArrayNode,
  DerefNode,
  EverythingNode,
  ExprNode,
  FilterNode,
  FuncCallNode,
  GroqFunction,
  GroupNode,
  MapNode,
  ObjectAttributeNode,
  ObjectAttributeValueNode,
  ObjectNode,
  ObjectSplatNode,
  ParentNode,
  ProjectionNode,
  SliceNode,
  ThisNode,
  ValueNode,
} from "groq-js";
import type { Simplify } from "type-fest";

import type { ReferenceValue } from "@sanity-typed/types";

import type { TupleOfLength } from "./utils";

// FIXME Handle Whitespace

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Query-context
 */
export type Context<
  Dataset,
  Client extends { dataset: string; projectId: string } = {
    dataset: string;
    projectId: string;
  }
> = {
  client: Client;
  dataset: Dataset;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Scope
 */
export type Scope<
  TContext extends Context<any, any>,
  Value,
  ParentScope extends Scope<any, any, any> | null
> = {
  context: TContext;
  parent: ParentScope;
  this: Value;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewRootScope()
 */
type RootScope<TContext extends Context<any, any>> = Scope<
  TContext,
  null,
  null
>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewNestedScope()
 */
type NestedScope<Value, TScope extends Scope<any, any, any>> = Scope<
  TScope["context"],
  Value,
  TScope
>;

export type Parse<TExpression extends string> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  Expression<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Evaluate()
 */
export type Evaluate<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  EvaluateExpression<TNode, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Boolean
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Null
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Number
 */
type Primitives<TExpression extends string> =
  TExpression extends `${infer TValue extends boolean | number | null}`
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

type ExcludeFromString<
  TString extends string,
  TExclude extends string
> = TString extends `${infer TLeft}${TExclude}${infer TRight}`
  ? ExcludeFromString<`${TLeft}${TRight}`, TExclude>
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
          ExcludeFromString<TString, `\\${EscapeSequence}`>,
          "'"
        > extends true
        ? never
        : { type: "Value"; value: TString }
      : never)
  | (TExpression extends `"${infer TString}"`
      ? IfStringHas<
          ExcludeFromString<TString, `\\${EscapeSequence}`>,
          '"'
        > extends true
        ? never
        : { type: "Value"; value: TString }
      : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElement
 */
type ArrayElement<TArrayElement extends string> =
  TArrayElement extends `...${infer TExpression}`
    ? Parse<TExpression> extends never
      ? never
      : { isSplat: true; type: "ArrayElement"; value: Parse<TExpression> }
    : Parse<TArrayElement> extends never
    ? never
    : {
        isSplat: false;
        type: "ArrayElement";
        value: Parse<TArrayElement>;
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
      : { elements: ArrayElements<TArrayElements>; type: "Array" }
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
      : Parse<TExpression> extends never
      ? never
      : { type: "ObjectSplat"; value: Parse<TExpression> }
    : TObjectAttribute extends `${infer TName}:${infer TExpression}`
    ? StringType<TName> extends never
      ? never
      : Parse<TExpression> extends never
      ? never
      : {
          name: StringType<TName>["value"];
          type: "ObjectAttributeValue";
          value: Parse<TExpression>;
        }
    : Parse<TObjectAttribute> extends never
    ? never
    : DetermineName<Parse<TObjectAttribute>> extends never
    ? never
    : {
        name: DetermineName<Parse<TObjectAttribute>>;
        type: "ObjectAttributeValue";
        value: Parse<TObjectAttribute>;
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

type Functions<TArgs extends any[], TScope extends Scope<any, any, any>> = {
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Array-namespace
   */
  array: {
    /**
     * TODO array::compact
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#array_compact()
     */
    compact: never;
    /**
     * TODO array::join
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#array_join()
     */
    join: never;
    /**
     * TODO array::unique
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#array_unique()
     */
    unique: never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-DateTime-namespace
   */
  dateTime: {
    /**
     * TODO dateTime::now
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#dateTime_now()
     */
    now: never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Delta-namespace
   */
  delta: {
    /**
     * TODO delta::changedAny
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#delta_changedAny()
     */
    changedAny: never;
    /**
     * TODO delta::changedOnly
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#delta_changedOnly()
     */
    changedOnly: never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Diff-namespace
   */
  diff: {
    /**
     * TODO diff::changedAny
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#diff_changedAny()
     */
    changedAny: never;
    /**
     * TODO diff::changedOnly
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#diff_changedOnly()
     */
    changedOnly: never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Geography-Extension
   */
  geo: {
    /**
     * TODO geo::contains
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#geo_contains()
     */
    contains: never;
    /**
     * TODO geo::distance
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#geo_distance()
     */
    distance: never;
    /**
     * TODO geo::intersects
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#geo_intersects()
     */
    intersects: never;
  };
  /**
   * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Global-namespace
   */
  global: {
    /**
     * TODO global::after
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_after()
     */
    after: never;
    /**
     * TODO global::before
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_before()
     */
    before: never;
    /**
     * TODO global::boost
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_boost()
     */
    boost: never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_coalesce()
     */
    coalesce: TArgs extends []
      ? null
      : TArgs extends [infer TFirst, ...infer TRest]
      ? null extends TFirst
        ? Functions<TRest, TScope>["global"]["coalesce"] | NonNullable<TFirst>
        : TFirst
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
     * TODO global::dateTime
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_dateTime()
     */
    dateTime: never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_defined()
     */
    defined: TArgs extends [infer TBase]
      ? TBase extends null
        ? false
        : true
      : never;
    /**
     * TODO global::geo
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_geo()
     */
    geo: never;
    /**
     * TODO global::identity
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-identity-
     */
    identity: never;
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
     * TODO global::operation
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_operation()
     */
    operation: never;
    /**
     * TODO global::path
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_path()
     */
    path: never;
    /**
     * TODO global::pt
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_pt()
     */
    pt: never;
    /**
     * TODO global::references
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_references()
     */
    references: never;
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
     * TODO global::select
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_select()
     */
    select: never;
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
     * TODO pt::text
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#pt_text()
     */
    text: never;
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
     * TODO string::split
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#string_split()
     */
    split: never;
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

type FuncArgs<
  TArgs extends string,
  _Prefix extends string = ""
> = `${_Prefix}${TArgs}` extends ""
  ? []
  :
      | (Parse<`${_Prefix}${TArgs}`> extends never
          ? never
          : [Parse<`${_Prefix}${TArgs}`>])
      | (TArgs extends `${infer TFuncArg},${infer TFuncArgs}`
          ?
              | FuncArgs<TFuncArgs, `${_Prefix}${TFuncArg},`>
              | (Parse<`${_Prefix}${TFuncArg}`> extends never
                  ? never
                  : FuncArgs<TFuncArgs> extends never
                  ? never
                  : [Parse<`${_Prefix}${TFuncArg}`>, ...FuncArgs<TFuncArgs>])
          : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#FuncCall
 */
type FuncCall<TExpression extends string> =
  TExpression extends `${infer TFuncFullName}(${infer TFuncCallArgs})`
    ? FuncArgs<TFuncCallArgs> extends never
      ? never
      : TFuncFullName extends `${infer TFuncNamespace}::${infer TFuncIdentifier}`
      ? TFuncNamespace extends keyof Functions<any, any>
        ? TFuncIdentifier extends keyof Functions<any, any>[TFuncNamespace]
          ? {
              args: Simplify<FuncArgs<TFuncCallArgs>>;
              func: GroqFunction;
              name: TFuncFullName;
              type: "FuncCall";
            }
          : never
        : never
      : TFuncFullName extends keyof Functions<any, any>["global"]
      ? {
          args: Simplify<FuncArgs<TFuncCallArgs>>;
          func: GroqFunction;
          name: `global::${TFuncFullName}`;
          type: "FuncCall";
        }
      : never
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#SimpleExpression
 */
type SimpleExpression<TExpression extends string> =
  | Everything<TExpression>
  | FuncCall<TExpression>
  | Parent<TExpression>
  | This<TExpression>
  | ThisAttribute<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parenthesis
 */
type Parenthesis<TExpression extends string> =
  TExpression extends `(${infer TInnerExpression})`
    ? { base: Parse<TInnerExpression>; type: "Group" }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayPostfix
 */
type ArrayPostfix<TExpression extends string> =
  TExpression extends `${infer TBase}[]`
    ? Parse<TBase> extends never
      ? never
      : { base: Parse<TBase>; type: "ArrayCoerce" }
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ConstantEvaluate()
 */
type ConstantEvaluate<TNode extends ExprNode> =
  // HACK Not sure if giving a never scope works! https://github.com/sanity-io/groq-js/blob/main/src/evaluator/constantEvaluate.ts#L48
  Evaluate<TNode, never>;

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
      | (Parse<`${_Prefix}${TBase}`> extends never
          ? never
          :
              | {
                  [TOp in
                    | "..."
                    | ".."]: TBracketExpression extends `${infer TStart}${TOp}${infer TEnd}`
                    ? ConstantEvaluate<Parse<TStart>> extends never
                      ? never
                      : ConstantEvaluate<Parse<TEnd>> extends never
                      ? never
                      : ConstantEvaluate<Parse<TStart>> extends number
                      ? ConstantEvaluate<Parse<TEnd>> extends number
                        ? {
                            base: Parse<`${_Prefix}${TBase}`>;
                            isInclusive: TOp extends ".." ? true : false;
                            left: ConstantEvaluate<Parse<TStart>>;
                            right: ConstantEvaluate<Parse<TEnd>>;
                            type: "Slice";
                          }
                        : never
                      : never
                    : never;
                }["..." | ".."]
              | (ConstantEvaluate<Parse<TBracketExpression>> extends never
                  ? never
                  : ConstantEvaluate<Parse<TBracketExpression>> extends string
                  ? {
                      base: Parse<`${_Prefix}${TBase}`>;
                      name: ConstantEvaluate<Parse<TBracketExpression>>;
                      type: "AccessAttribute";
                    }
                  : ConstantEvaluate<Parse<TBracketExpression>> extends number
                  ? {
                      base: Parse<`${_Prefix}${TBase}`>;
                      index: ConstantEvaluate<Parse<TBracketExpression>>;
                      type: "AccessElement";
                    }
                  : {
                      base: Parse<`${_Prefix}${TBase}`>;
                      expr: Parse<TBracketExpression>;
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
      | (Parse<`${_Prefix}${TBase}`> extends never
          ? never
          : Identifier<TIdentifier> extends never
          ? never
          : {
              base: Parse<`${_Prefix}${TBase}`>;
              name: TIdentifier;
              type: "AccessAttribute";
            })
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
      | (Parse<`${_Prefix}${TBase}`> extends never
          ? never
          : TIdentifier extends ""
          ? { base: Parse<`${_Prefix}${TBase}`>; type: "Deref" }
          : Identifier<TIdentifier> extends never
          ? never
          : {
              base: { base: Parse<`${_Prefix}${TBase}`>; type: "Deref" };
              name: TIdentifier;
              type: "AccessAttribute";
            })
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalExpression
 */
type TraversalExpression<TExpression extends string> =
  | ArrayPostfix<TExpression>
  | AttributeAccess<TExpression>
  | Dereference<TExpression>
  // TODO Projection<TExpression>
  | SquareBracketTraversal<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#CompoundExpression
 */
type CompoundExpression<TExpression extends string> =
  | Parenthesis<TExpression>
  // TODO PipeFuncCall
  | TraversalExpression<TExpression>;

type Op =
  | "-"
  | "!="
  | "*"
  | "**"
  | "/"
  | "%"
  | "+"
  | "<"
  | "<="
  | "=="
  | ">"
  | ">="
  | "in"
  | "match";

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Equality
 */
type OpCall<
  TExpression extends string,
  TOp extends Op,
  _Prefix extends string = ""
> = TExpression extends `${infer TLeft}${TOp}${infer TRight}`
  ?
      | OpCall<TRight, TOp, `${_Prefix}${TLeft}${TOp}`>
      | (Parse<`${_Prefix}${TLeft}`> extends never
          ? never
          : Parse<TRight> extends never
          ? never
          : {
              left: Parse<`${_Prefix}${TLeft}`>;
              op: TOp;
              right: Parse<TRight>;
              type: "OpCall";
            })
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#OperatorCall
 */
type OperatorCall<TExpression extends string> =
  // TODO And
  // TODO Asc
  // TODO Comparison
  // TODO Desc
  // TODO In
  // TODO Match
  // TODO Minus
  // TODO Not
  // TODO Or
  // TODO Percent
  // TODO Plus
  // TODO Slash
  // TODO Star
  // TODO StarStar
  // TODO UnaryMinus
  // TODO UnaryPlus
  | OpCall<TExpression, "-">
  | OpCall<TExpression, "!=">
  | OpCall<TExpression, "*">
  | OpCall<TExpression, "**">
  | OpCall<TExpression, "/">
  | OpCall<TExpression, "%">
  | OpCall<TExpression, "+">
  | OpCall<TExpression, "<">
  | OpCall<TExpression, "<=">
  | OpCall<TExpression, "==">
  | OpCall<TExpression, ">">
  | OpCall<TExpression, ">=">
  | OpCall<TExpression, "in">
  | OpCall<TExpression, "match">;

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
  TScope extends Scope<any, any, any>
> = TNode extends { base: infer TBase extends ExprNode }
  ? Evaluate<TBase, TScope>
  : TScope["this"];

type EvaluateAccessAttributeElement<
  TBase,
  TName extends string
> = TBase extends {
  [key in TName]: infer TValue;
}
  ? TValue
  : null;

type EvaluateAccessAttributeElements<
  TBases extends any[],
  TName extends string
> = {
  [index in keyof TBases]: EvaluateAccessAttributeElement<TBases[index], TName>;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateAttributeAccess()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateThisAttribute()
 */
type EvaluateAccessAttribute<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends AccessAttributeNode
  ? EvaluateBaseOrThis<TNode, TScope> extends any[]
    ? EvaluateAccessAttributeElements<
        EvaluateBaseOrThis<TNode, TScope>,
        TNode["name"]
      >
    : EvaluateAccessAttributeElement<
        EvaluateBaseOrThis<TNode, TScope>,
        TNode["name"]
      >
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateElementAccess()
 */
type EvaluateAccessElement<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends AccessElementNode
  ? Evaluate<TNode["base"], TScope> extends (infer TValue)[]
    ? // TODO Use TNode["index"] to be more specific
      TValue
    : // FIXME ProjectionTraversal ArraySource Should InnerMap https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalArraySource
      null
  : never;

type EvaluateArrayElement<
  TElement extends ArrayElementNode,
  TScope extends Scope<any, any, any>
> = TElement["isSplat"] extends true
  ? Evaluate<TElement["value"], TScope> extends any[]
    ? Evaluate<TElement["value"], TScope>
    : [Evaluate<TElement["value"], TScope>]
  : [Evaluate<TElement["value"], TScope>];

type EvaluateArrayElements<
  TElements extends ArrayElementNode[],
  TScope extends Scope<any, any, any>
> = TElements extends []
  ? []
  : TElements extends [
      infer THead extends ArrayElementNode,
      ...infer TRest extends ArrayElementNode[]
    ]
  ? // @ts-expect-error -- FIXME Type instantiation is excessively deep and possibly infinite.
    [
      ...EvaluateArrayElement<THead, TScope>,
      ...EvaluateArrayElements<TRest, TScope>
    ]
  : TElements extends (infer TElement extends ArrayElementNode)[]
  ? EvaluateArrayElement<TElement, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateArray()
 */
type EvaluateArray<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = EvaluateArrayElements<Extract<TNode, ArrayNode>["elements"], TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateArrayPostfix()
 */
type EvaluateArrayPostfix<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends ArrayCoerceNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? Evaluate<TNode["base"], TScope>
    : null
  : never;

type EvaluateDereferenceElement<
  TRef,
  TScope extends Scope<any, any, any>
> = TRef extends ReferenceValue<infer TReferenced>
  ? TScope["context"]["dataset"] extends (infer TDataset)[]
    ?
        | Extract<TDataset, { _type: TReferenced }>
        | (TRef extends { weak: true } ? null : never)
    : null
  : null;

type EvaluateDereferenceElements<
  TRefs extends any[],
  TScope extends Scope<any, any, any>
> = {
  [index in keyof TRefs]: EvaluateDereferenceElement<TRefs[index], TScope>;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateDereference()
 */
type EvaluateDereference<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends DerefNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? EvaluateDereferenceElements<Evaluate<TNode["base"], TScope>, TScope>
    : EvaluateDereferenceElement<Evaluate<TNode["base"], TScope>, TScope>
  : never;

type Negate<
  TBoolean extends boolean,
  Enabled extends boolean
> = Enabled extends false ? TBoolean : TBoolean extends true ? false : true;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateEquality()
 */
type EvaluateEquality<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends { op: "!=" | "=="; type: "OpCall" }
  ? Negate<
      // TODO Test Equality cases in https://sanity-io.github.io/GROQ/GROQ-1.revision1/#PartialCompare()
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
  TScope extends Scope<any, any, any>
> = TNode extends EverythingNode ? TScope["context"]["dataset"] : never;

type EvaluateFilterElements<
  TBase extends any[],
  TFilterExpression extends ExprNode,
  TScope extends Scope<any, any, any>
> = TBase extends []
  ? []
  : TBase extends [infer TFirst, ...infer TRest]
  ? Evaluate<TFilterExpression, NestedScope<TFirst, TScope>> extends never
    ? never
    : EvaluateFilterElements<TRest, TFilterExpression, TScope> extends never
    ? never
    : Evaluate<TFilterExpression, NestedScope<TFirst, TScope>> extends true
    ? [TFirst, ...EvaluateFilterElements<TRest, TFilterExpression, TScope>]
    : EvaluateFilterElements<TRest, TFilterExpression, TScope>
  : TBase extends (infer TArrayElement)[]
  ? Evaluate<
      TFilterExpression,
      NestedScope<TArrayElement, TScope>
    > extends never
    ? never
    : (TArrayElement extends never
        ? never
        : Evaluate<
            TFilterExpression,
            NestedScope<TArrayElement, TScope>
          > extends true
        ? TArrayElement
        : never)[]
  : [];

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateFilter()
 */
type EvaluateFilter<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
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
  TScope extends Scope<any, any, any>
> = {
  [key in keyof TArgs]: Evaluate<TArgs[key], TScope>;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateFuncCall()
 */
type EvaluateFuncCall<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
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
    : never
  : never;

type EvaluateObjectAttribute<
  TAttribute extends ObjectAttributeNode,
  TScope extends Scope<any, any, any>
> =
  | (TAttribute extends ObjectAttributeValueNode
      ? { [key in TAttribute["name"]]: Evaluate<TAttribute["value"], TScope> }
      : never)
  | (TAttribute extends ObjectSplatNode
      ? Evaluate<TAttribute["value"], TScope>
      : never);

type EmptyObject = { [key: string]: never };

type EvaluateObjectAttributes<
  TAttributes extends ObjectAttributeNode[],
  TScope extends Scope<any, any, any>
> = TAttributes extends []
  ? EmptyObject
  : TAttributes extends [
      infer TFirst extends ObjectAttributeNode,
      ...infer TRest extends ObjectAttributeNode[]
    ]
  ? EvaluateObjectAttributes<TRest, TScope> extends EmptyObject
    ? EvaluateObjectAttribute<TFirst, TScope>
    : EvaluateObjectAttributes<TRest, TScope> &
        Omit<
          EvaluateObjectAttribute<TFirst, TScope>,
          keyof EvaluateObjectAttributes<TRest, TScope>
        >
  : TAttributes extends (infer TAttribute extends ObjectAttributeNode)[]
  ? EvaluateObjectAttribute<TAttribute, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateObject()
 */
type EvaluateObject<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = Simplify<
  EvaluateObjectAttributes<Extract<TNode, ObjectNode>["attributes"], TScope>
>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateParent()
 */
type EvaluateParent<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>,
  Level extends number = Extract<TNode, ParentNode>["n"]
> = TNode extends ParentNode
  ? Level extends 0
    ? TScope["this"]
    : EvaluateParent<
        TNode,
        TScope["parent"],
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
  TScope extends Scope<any, any, any>
> = TNode extends GroupNode ? Evaluate<TNode["base"], TScope> : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateSlice()
 */
type EvaluateSlice<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends SliceNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? // TODO Use TNode["left"] & TNode["right"] to be more specific
      Evaluate<TNode["base"], TScope>
    : // FIXME ProjectionTraversal ArraySource Should InnerMap https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalArraySource
      null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateThis()
 */
type EvaluateThis<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> = TNode extends ThisNode ? TScope["this"] : never;

type EvaluateValue<TNode extends ExprNode> = Extract<TNode, ValueNode>["value"];

type EvaluateExpression<
  TNode extends ExprNode,
  TScope extends Scope<any, any, any>
> =
  | EvaluateAccessAttribute<TNode, TScope>
  | EvaluateAccessElement<TNode, TScope>
  | EvaluateArray<TNode, TScope>
  | EvaluateArrayPostfix<TNode, TScope>
  | EvaluateDereference<TNode, TScope>
  | EvaluateEquality<TNode, TScope>
  | EvaluateEverything<TNode, TScope>
  | EvaluateFilter<TNode, TScope>
  | EvaluateFuncCall<TNode, TScope>
  | EvaluateObject<TNode, TScope>
  | EvaluateParent<TNode, TScope>
  | EvaluateParenthesis<TNode, TScope>
  | EvaluateSlice<TNode, TScope>
  | EvaluateThis<TNode, TScope>
  | EvaluateValue<TNode>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ExecuteQuery()
 */
export type ExecuteQuery<
  TQuery extends string,
  ContextOrScope extends
    | Context<any, any>
    | Scope<any, any, any> = Context<never>
> = Simplify<
  Evaluate<
    Parse<TQuery>,
    ContextOrScope extends Context<any, any>
      ? RootScope<ContextOrScope>
      : ContextOrScope
  >
>;
