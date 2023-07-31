import type {
  AccessAttributeNode,
  AccessElementNode,
  AndNode,
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
  NegNode,
  NotNode,
  ObjectAttributeNode,
  ObjectAttributeValueNode,
  ObjectNode,
  ObjectSplatNode,
  OpCallNode,
  OrNode,
  ParentNode,
  PosNode,
  ProjectionNode,
  SliceNode,
  ThisNode,
  ValueNode,
} from "groq-js";
import type { Merge, Simplify } from "type-fest";

import type { ReferenceValue } from "@sanity-typed/types";

import type { TupleOfLength } from "./utils";

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Query-context
 */
type Context<Dataset extends any[], DeltaElement extends Dataset[number]> = {
  client: { dataset: string; identity: string; projectId: string };
  dataset: Dataset;
  delta:
    | { after: DeltaElement; before: DeltaElement }
    | { after: DeltaElement; before: null }
    | { after: null; before: DeltaElement }
    | null;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Scope
 */
type Scope<TContext extends Context<any, any>> = {
  context: TContext;
  parent: Scope<TContext> | null;
  this: any;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewNestedScope()
 */
type NestedScope<Value, TScope extends Scope<any>> = {
  context: TScope["context"];
  parent: TScope;
  this: Value;
};

export type Parse<TExpression extends string> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  Expression<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Evaluate()
 */
export type Evaluate<TNode extends ExprNode, TScope extends Scope<any>> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursion
  EvaluateExpression<TNode, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Boolean
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Null
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Number
 */
type Primitives<TExpression extends string> =
  TExpression extends `+${infer TValue extends number}`
    ? {
        type: "Value";
        value: TValue;
      }
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
      ? Identifier<TFuncNamespace> extends never
        ? never
        : Identifier<TFuncIdentifier> extends never
        ? never
        : {
            args: Simplify<FuncArgs<TFuncCallArgs>>;
            func: GroqFunction;
            name: TFuncFullName;
            type: "FuncCall";
          }
      : Identifier<TFuncFullName> extends never
      ? never
      : {
          args: Simplify<FuncArgs<TFuncCallArgs>>;
          func: GroqFunction;
          name: `global::${TFuncFullName}`;
          type: "FuncCall";
        }
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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Projection
 */
type Projection<
  TExpression extends string,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}|{${infer TProjection}}`
  ?
      | Projection<`${TProjection}}`, `${_Prefix}${TBase}|{`>
      | (Parse<`${_Prefix}${TBase}`> extends never
          ? never
          : ObjectType<`{${TProjection}}`> extends never
          ? never
          : {
              base: Parse<`${_Prefix}${TBase}`>;
              expr: ObjectType<`{${TProjection}}`>;
              type: "Projection";
            })
  : TExpression extends `${infer TBase}{${infer TProjection}}`
  ?
      | Projection<`${TProjection}}`, `${_Prefix}${TBase}{`>
      | (Parse<`${_Prefix}${TBase}`> extends never
          ? never
          : ObjectType<`{${TProjection}}`> extends never
          ? never
          : {
              base: Parse<`${_Prefix}${TBase}`>;
              expr: ObjectType<`{${TProjection}}`>;
              type: "Projection";
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
  | Projection<TExpression>
  | SquareBracketTraversal<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#CompoundExpression
 */
type CompoundExpression<TExpression extends string> =
  | Parenthesis<TExpression>
  // TODO PipeFuncCall
  | TraversalExpression<TExpression>;

type BooleanOperators = {
  "&&": { stronger: false; type: "And"; weaker: true };
  "||": { stronger: true; type: "Or"; weaker: false };
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
      | (Parse<`${_Prefix}${TLeft}`> extends never
          ? never
          : Parse<TRight> extends never
          ? never
          : {
              left: Parse<`${_Prefix}${TLeft}`>;
              right: Parse<TRight>;
              type: BooleanOperators[NonNullable<TOp>]["type"];
            })
  : never;

type PrefixOperators = {
  "!": { excludeNumbers: false; type: "Not" };
  "+": { excludeNumbers: true; type: "Pos" };
  "-": { excludeNumbers: true; type: "Neg" };
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
  ? (
      TBase extends `${number}`
        ? PrefixOperators[NonNullable<TOp>]["excludeNumbers"] extends true
          ? false
          : true
        : true
    ) extends false
    ? never
    : Parse<TBase> extends never
    ? never
    : {
        base: Parse<TBase>;
        type: PrefixOperators[NonNullable<TOp>]["type"];
      }
  : never;

type Operators = {
  "!=": true;
  "%": true;
  "*": true;
  "**": true;
  "+": true;
  "-": true;
  "/": true;
  "<": true;
  "<=": true;
  "==": true;
  ">": true;
  ">=": true;
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
  TScope extends Scope<any>
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
  TScope extends Scope<any>
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
  TScope extends Scope<any>
> = TNode extends AccessElementNode
  ? Evaluate<TNode["base"], TScope> extends (infer TValue)[]
    ? // TODO Use TNode["index"] to be more specific
      TValue
    : // FIXME ProjectionTraversal ArraySource Should InnerMap https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalArraySource
      null
  : never;

type EvaluateArrayElement<
  TElement extends ArrayElementNode,
  TScope extends Scope<any>
> = TElement["isSplat"] extends true
  ? Evaluate<TElement["value"], TScope> extends any[]
    ? Evaluate<TElement["value"], TScope>
    : [Evaluate<TElement["value"], TScope>]
  : [Evaluate<TElement["value"], TScope>];

type EvaluateArrayElements<
  TElements extends ArrayElementNode[],
  TScope extends Scope<any>
> = TElements extends []
  ? []
  : TElements extends [
      infer THead extends ArrayElementNode,
      ...infer TTail extends ArrayElementNode[]
    ]
  ? // @ts-expect-error -- FIXME Type instantiation is excessively deep and possibly infinite.
    [
      ...EvaluateArrayElement<THead, TScope>,
      ...EvaluateArrayElements<TTail, TScope>
    ]
  : TElements extends (infer TElement extends ArrayElementNode)[]
  ? EvaluateArrayElement<TElement, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateArray()
 */
type EvaluateArray<
  TNode extends ExprNode,
  TScope extends Scope<any>
> = EvaluateArrayElements<Extract<TNode, ArrayNode>["elements"], TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateArrayPostfix()
 */
type EvaluateArrayPostfix<
  TNode extends ExprNode,
  TScope extends Scope<any>
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
  TScope extends Scope<any>
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
type EvaluateComparison<TNode extends ExprNode> = TNode extends OpCallNode
  ? TNode extends { op: "<" | "<=" | ">" | ">=" }
    ? // TODO comparison can return null
      boolean
    : never
  : never;

type EvaluateDereferenceElement<
  TRef,
  TScope extends Scope<any>
> = TRef extends ReferenceValue<infer TReferenced>
  ? TScope["context"]["dataset"] extends (infer TDataset)[]
    ?
        | Extract<TDataset, { _type: TReferenced }>
        | (TRef extends { weak: true } ? null : never)
    : null
  : null;

type EvaluateDereferenceElements<
  TRefs extends any[],
  TScope extends Scope<any>
> = {
  [index in keyof TRefs]: EvaluateDereferenceElement<TRefs[index], TScope>;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateDereference()
 */
type EvaluateDereference<
  TNode extends ExprNode,
  TScope extends Scope<any>
> = TNode extends DerefNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? EvaluateDereferenceElements<Evaluate<TNode["base"], TScope>, TScope>
    : EvaluateDereferenceElement<Evaluate<TNode["base"], TScope>, TScope>
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
  TScope extends Scope<any>
> = TNode extends { op: "!=" | "=="; type: "OpCall" }
  ? Not<
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
  TScope extends Scope<any>
> = TNode extends EverythingNode ? TScope["context"]["dataset"] : never;

type EvaluateFilterElements<
  TBase extends any[],
  TFilterExpression extends ExprNode,
  TScope extends Scope<any>
> = TBase extends []
  ? []
  : TBase extends [infer THead, ...infer TTail]
  ? Evaluate<TFilterExpression, NestedScope<THead, TScope>> extends never
    ? never
    : EvaluateFilterElements<TTail, TFilterExpression, TScope> extends never
    ? never
    : Evaluate<TFilterExpression, NestedScope<THead, TScope>> extends true
    ? [THead, ...EvaluateFilterElements<TTail, TFilterExpression, TScope>]
    : EvaluateFilterElements<TTail, TFilterExpression, TScope>
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
  TScope extends Scope<any>
> = TNode extends FilterNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? EvaluateFilterElements<
        Evaluate<TNode["base"], TScope>,
        TNode["expr"],
        TScope
      >
    : Evaluate<TNode["base"], TScope>
  : never;

type EvaluateFuncArgs<TArgs extends ExprNode[], TScope extends Scope<any>> = {
  [key in keyof TArgs]: Evaluate<TArgs[key], TScope>;
};

type Functions<TArgs extends any[], TScope extends Scope<any>> = {
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
          ? TArr extends []
            ? ""
            : Functions<
                [TArr[number]],
                TScope
              >["global"]["string"] extends string
            ? TArr extends [infer TElement]
              ? Functions<[TElement], TScope>["global"]["string"]
              : // FIXME RangeError: Maximum call stack size exceeded
                // TArr extends [infer THead, ...infer TTail]
                // ? `${Functions<
                //     [THead],
                //     TScope
                //   >["global"]["string"]}${TSep}${Functions<
                //     [TTail, TSep],
                //     TScope
                //   >["array"]["join"]}`
                // : // Once it's reduced to Element[], a literal can't be determined
                //   string
                string
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
        : never
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_before()
     */
    before: TArgs extends []
      ? TScope extends {
          context: { delta: { before: infer TBefore } };
        }
        ? TBefore
        : never
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
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_defined()
     */
    defined: TArgs extends [infer TBase]
      ? TBase extends null
        ? false
        : true
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
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_operation()
     */
    operation: TArgs extends []
      ? TScope extends {
          context: { delta: { after: infer TAfter; before: infer TBefore } };
        }
        ? TBefore extends null
          ? "create"
          : TAfter extends null
          ? "delete"
          : "update"
        : never
      : never;
    /**
     * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_references()
     */
    references: TArgs extends (infer TElement)[]
      ? Extract<Exclude<TElement, []>, string[] | string> extends never
        ? false
        : // Once we're certain there's a string or string[] argument, we can't do better
          // Whether or not the ids exist in a dataset is impossible to figure out
          // TODO We could check only for docs that have ReferenceValues.
          boolean
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
            ? // There's no splitting an unknown string
              string[]
            : string extends TSep
            ? // There's no splitting with an unknown string
              string[]
            : TStr extends `${infer TLeft}${TSep}${infer TRight}`
            ? TRight extends ""
              ? TSep extends ""
                ? [TLeft]
                : [TLeft, TRight]
              : [TLeft, ...Functions<[TRight, TSep], TScope>["string"]["split"]]
            : [TStr]
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

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateFuncCall()
 */
type EvaluateFuncCall<
  TNode extends ExprNode,
  TScope extends Scope<any>
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

type EmptyObject = { [key: string]: never };

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
  TScope extends Scope<any>
> = TNode extends OpCallNode
  ?
      | (TNode extends { op: "-" | "*" | "**" | "/" | "%" }
          ? Evaluate<TNode["left"], TScope> extends number
            ? Evaluate<TNode["right"], TScope> extends number
              ? number
              : null
            : null
          : never)
      | (TNode extends { op: "+" }
          ? Evaluate<TNode["left"], TScope> extends string
            ? Evaluate<TNode["right"], TScope> extends string
              ? // @ts-expect-error -- FIXME Type instantiation is excessively deep and possibly infinite.
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
  TScope extends Scope<any>
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
  TScope extends Scope<any>
> = TNode extends NotNode ? Not<Evaluate<TNode["base"], TScope>> : never;

type EvaluateObjectAttribute<
  TAttribute extends ObjectAttributeNode,
  TScope extends Scope<any>
> =
  | (TAttribute extends ObjectAttributeValueNode
      ? { [key in TAttribute["name"]]: Evaluate<TAttribute["value"], TScope> }
      : never)
  | (TAttribute extends ObjectSplatNode
      ? Evaluate<TAttribute["value"], TScope>
      : never);

type EvaluateObjectAttributes<
  TAttributes extends ObjectAttributeNode[],
  TScope extends Scope<any>
> = TAttributes extends []
  ? EmptyObject
  : TAttributes extends [
      infer THead extends ObjectAttributeNode,
      ...infer TTail extends ObjectAttributeNode[]
    ]
  ? EmptyObject extends EvaluateObjectAttributes<TTail, TScope>
    ? EvaluateObjectAttribute<THead, TScope>
    : EvaluateObjectAttributes<TTail, TScope> &
        Omit<
          EvaluateObjectAttribute<THead, TScope>,
          keyof EvaluateObjectAttributes<TTail, TScope>
        >
  : TAttributes extends (infer TAttribute extends ObjectAttributeNode)[]
  ? EvaluateObjectAttribute<TAttribute, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateObject()
 */
type EvaluateObject<
  TNode extends ExprNode,
  TScope extends Scope<any>
> = Simplify<
  EvaluateObjectAttributes<Extract<TNode, ObjectNode>["attributes"], TScope>
>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateParent()
 */
type EvaluateParent<
  TNode extends ExprNode,
  TScope extends Scope<any>,
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
  TScope extends Scope<any>
> = TNode extends GroupNode ? Evaluate<TNode["base"], TScope> : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluatePos()
 */
type EvaluatePos<
  TNode extends ExprNode,
  TScope extends Scope<any>
> = TNode extends PosNode
  ? Evaluate<TNode["base"], TScope> extends number
    ? Evaluate<TNode["base"], TScope>
    : null
  : never;

type EvaluateProjectionElement<
  TBase,
  TExpression extends ExprNode,
  TScope extends Scope<any>
> = Evaluate<TExpression, NestedScope<TBase, TScope>>;

type EvaluateProjectionElements<
  TBases extends any[],
  TExpression extends ExprNode,
  TScope extends Scope<any>
> = {
  [index in keyof TBases]: EvaluateProjectionElement<
    TBases[index],
    TExpression,
    TScope
  >;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateProjection()
 */
type EvaluateProjection<
  TNode extends ExprNode,
  TScope extends Scope<any>
> = TNode extends ProjectionNode
  ? Evaluate<TNode["base"], TScope> extends any[]
    ? EvaluateProjectionElements<
        Evaluate<TNode["base"], TScope>,
        TNode["expr"],
        TScope
      >
    : EvaluateProjectionElement<
        Evaluate<TNode["base"], TScope>,
        TNode["expr"],
        TScope
      >
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateSlice()
 */
type EvaluateSlice<
  TNode extends ExprNode,
  TScope extends Scope<any>
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
  TScope extends Scope<any>
> = TNode extends ThisNode ? TScope["this"] : never;

type EvaluateValue<TNode extends ExprNode> = Extract<TNode, ValueNode>["value"];

type EvaluateExpression<TNode extends ExprNode, TScope extends Scope<any>> =
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
  | EvaluateMath<TNode, TScope>
  | EvaluateNeg<TNode, TScope>
  | EvaluateNot<TNode, TScope>
  | EvaluateObject<TNode, TScope>
  | EvaluateParent<TNode, TScope>
  | EvaluateParenthesis<TNode, TScope>
  | EvaluatePos<TNode, TScope>
  | EvaluateProjection<TNode, TScope>
  | EvaluateSlice<TNode, TScope>
  | EvaluateThis<TNode, TScope>
  | EvaluateValue<TNode>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ExecuteQuery()
 */
export type ExecuteQuery<
  TQuery extends string,
  ContextOrScope extends
    | Partial<Context<any, any>>
    | Partial<Scope<any>> = never
> = Simplify<
  Evaluate<
    Parse<TQuery>,
    ContextOrScope extends Partial<Context<any, any>>
      ? /**
         * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewRootScope()
         */
        {
          context: Merge<
            {
              client: {
                dataset: string;
                projectId: string;
              };
              dataset: any[];
              delta: null;
            },
            Required<ContextOrScope>
          >;
          parent: null;
          this: null;
        }
      : Merge<
          {
            context: {
              client: {
                dataset: string;
                projectId: string;
              };
              dataset: any[];
              delta: null;
            };
            parent: null;
            this: null;
          },
          Required<ContextOrScope>
        >
  >
>;
