import type { DocumentValue, InferSchemaValues } from "@sanity-typed/types";

// FIXME Handle Whitespace

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Query-context
 */
type Context<Dataset, Mode extends "delta" | "normal"> = {
  dataset: Dataset;
  mode: Mode;
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

type NestedScope<Value, TScope extends Scope<any, any, any>> = Scope<
  TScope["context"],
  Value,
  TScope
>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Evaluate()
 */
type Evaluate<TExpression extends string, TScope extends Scope<any, any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Evaluate should be at the bottom but, because of recursion, it's cleanest to put it here
  Expression<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Boolean
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Null
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Number
 */
type Primitives<TExpression extends string> =
  TExpression extends `${infer TBoolean extends boolean | number | null}`
    ? TBoolean
    : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#String
 */
type StringType<TExpression extends string> = TExpression extends  // FIXME Should check for specific characters
  | `'${infer TString extends string}'`
  | `"${infer TString extends string}"`
  ? TString
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElement
 */
type ArrayElement<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `...${infer TArrayElement}`
  ? Evaluate<TArrayElement, TScope> extends never
    ? never
    : Evaluate<TArrayElement, TScope> extends any[]
    ? Evaluate<TArrayElement, TScope>
    : [Evaluate<TArrayElement, TScope>]
  : Evaluate<TExpression, TScope> extends never
  ? never
  : [Evaluate<TExpression, TScope>];

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElements
 */
type ArrayElements<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  TPrefix extends string = ""
> = TExpression extends `${infer TArrayElement},${infer TArrayElements}`
  ?
      | ArrayElements<TArrayElements, TScope, `${TPrefix}${TArrayElement},`>
      | (
          | ArrayElement<`${TPrefix}${TArrayElement}`, TScope>
          | ArrayElements<TArrayElements, TScope> extends never
          ? never
          : [
              ...ArrayElement<`${TPrefix}${TArrayElement}`, TScope>,
              ...ArrayElements<TArrayElements, TScope>
            ])
  : ArrayElement<`${TPrefix}${TExpression}`, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Array
 */
type ArrayType<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `[${infer TArrayElements}${"," | ""}]`
  ? TArrayElements extends ""
    ? []
    : ArrayElements<TArrayElements, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Literal
 *
 * @todo Object
 */
type Literal<TExpression extends string, TScope extends Scope<any, any, any>> =
  | ArrayType<TExpression, TScope>
  | Primitives<TExpression>
  | StringType<TExpression>;

type Negate<TBoolean extends boolean> = TBoolean extends true ? false : true;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Equality
 *
 * @todo Test Equality cases in https://sanity-io.github.io/GROQ/GROQ-1.revision1/#PartialCompare()
 */
type Equality<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  TOperator extends "!=" | "==" | null = null,
  TPrefix extends string = ""
> = TOperator extends null
  ?
      | Equality<TExpression, TScope, "==">
      | Negate<Equality<TExpression, TScope, "!=">>
  : TExpression extends `${infer TLeft}${TOperator}${infer TRight}`
  ?
      | Equality<TRight, TScope, TOperator, `${TPrefix}${TLeft}${TOperator}`>
      | (
          | Evaluate<`${TPrefix}${TLeft}`, TScope>
          | Evaluate<TRight, TScope> extends never
          ? never
          : Evaluate<`${TPrefix}${TLeft}`, TScope> extends Evaluate<
              TRight,
              TScope
            >
          ? true
          : Evaluate<TRight, TScope> extends Evaluate<
              `${TPrefix}${TLeft}`,
              TScope
            >
          ? true
          : false)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#OperatorCall
 *
 * @todo And
 * @todo Asc
 * @todo Comparison
 * @todo Desc
 * @todo In
 * @todo Match
 * @todo Minus
 * @todo Not
 * @todo Or
 * @todo Percent
 * @todo Plus
 * @todo Slash
 * @todo Star
 * @todo StarStar
 * @todo UnaryMinus
 * @todo UnaryPlus
 */
type OperatorCall<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = Equality<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-count-
 */
type Count<
  TArgs extends string,
  TScope extends Scope<any, any, any>
> = Evaluate<TArgs, TScope> extends any[]
  ? Evaluate<TArgs, TScope>["length"]
  : null;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-defined-
 */
type Defined<
  TArgs extends string,
  TScope extends Scope<any, any, any>
> = Evaluate<TArgs, TScope> extends null ? false : true;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-length-
 */
type Length<
  TArgs extends string,
  TScope extends Scope<any, any, any>
> = Evaluate<TArgs, TScope> extends any[] | string
  ? Evaluate<TArgs, TScope>["length"]
  : null;

/**
 * @todo array
 * @todo dateTime
 * @todo delta
 * @todo diff
 * @todo math
 * @todo string
 */
type Functions<TArgs extends string, TScope extends Scope<any, any, any>> = {
  /**
   * @todo after
   * @todo before
   * @todo boost
   * @todo coalesce
   * @todo dateTime
   * @todo lower
   * @todo now
   * @todo operation
   * @todo references
   * @todo round
   * @todo select
   * @todo string
   * @todo upper
   */
  global: {
    count: Count<TArgs, TScope>;
    defined: Defined<TArgs, TScope>;
    length: Length<TArgs, TScope>;
  };
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#FuncCall
 */
type FuncCall<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${infer TFunction extends keyof Functions<
  any,
  TScope
>["global"]}(${infer TArgs})`
  ? Functions<TArgs, TScope>["global"][TFunction]
  : TExpression extends `${infer TNamespace extends keyof Functions<
      any,
      TScope
    >}::${infer TFuncCall}`
  ? TFuncCall extends `${infer TFunction extends string &
      keyof Functions<any, TScope>[TNamespace]}(${infer TArgs})`
    ? Functions<TArgs, TScope>[TNamespace][TFunction]
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Everything
 */
type Everything<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends "*" ? TScope["context"]["dataset"] : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parent
 */
type Parent<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends "^"
  ? TScope["parent"]["this"]
  : TExpression extends `^.${infer TParents}`
  ? Parent<TParents, TScope["parent"]>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#This
 */
type This<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends "@" ? TScope["this"] : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ThisAttribute
 */
type ThisAttribute<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends keyof TScope["this"]
  ? TScope["this"][TExpression]
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#SimpleExpression
 */
type SimpleExpression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
  | Everything<TExpression, TScope>
  | FuncCall<TExpression, TScope>
  | Parent<TExpression, TScope>
  | This<TExpression, TScope>
  | ThisAttribute<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Filter
 */
type Filter<
  TBase extends any[],
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TBase extends []
  ? []
  : TBase extends [infer TFirst, ...infer TRest]
  ? Evaluate<TExpression, NestedScope<TFirst, TScope>> extends true
    ? [TFirst, ...Filter<TRest, TExpression, TScope>]
    : Filter<TRest, TExpression, TScope>
  : TBase extends (infer TArrayElement)[]
  ? (TArrayElement extends never
      ? never
      : Evaluate<TExpression, NestedScope<TArrayElement, TScope>> extends true
      ? TArrayElement
      : never)[]
  : [];

type BasicTraversalFilter<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  TPrefix extends string = ""
> = TExpression extends `${infer TBase}[${infer TFilterExpression}]`
  ?
      | BasicTraversalFilter<
          `${TFilterExpression}]`,
          TScope,
          `${TPrefix}${TBase}[`
        >
      | (Evaluate<`${TPrefix}${TBase}`, TScope> extends any[]
          ? Filter<
              Evaluate<`${TPrefix}${TBase}`, TScope>,
              TFilterExpression,
              TScope
            >
          : Evaluate<`${TPrefix}${TBase}`, TScope>)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#BasicTraversalArray
 *
 * @todo Slice
 * @todo ArrayPostfix
 */
type BasicTraversalArray<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = BasicTraversalFilter<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalArray
 *
 * @todo BasicTraversalArray TraversalArray
 * @todo ElementAccess TraversalArray
 * @todo ElementAccess TraversalArrayTarget
 * @todo BasicTraversalArray TraversalPlain
 * @todo BasicTraversalArray TraversalArrayTarget
 * @todo Projection TraversalArray
 */
type TraversalArray<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = BasicTraversalArray<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalExpression
 *
 * @todo TraversalPlain
 * @todo TraversalArraySource
 * @todo TraversalArrayTarget
 */
type TraversalExpression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TraversalArray<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parenthesis
 */
type Parenthesis<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `(${infer TInnerExpression})`
  ? Evaluate<TInnerExpression, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#CompoundExpression
 *
 * @todo PipeFuncCall
 */
type CompoundExpression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = Parenthesis<TExpression, TScope> | TraversalExpression<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Expression
 */
type Expression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
  | CompoundExpression<TExpression, TScope>
  | Literal<TExpression, TScope>
  | OperatorCall<TExpression, TScope>
  | SimpleExpression<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ExecuteQuery()
 */
export type ExecuteQuery<
  TQuery extends string,
  ValuesOrScope extends InferSchemaValues<any> | Scope<any, any, any>
> = Evaluate<
  TQuery,
  ValuesOrScope extends Scope<any, any, any>
    ? ValuesOrScope
    : Scope<
        Context<
          Extract<
            ValuesOrScope[keyof ValuesOrScope],
            // TODO Is is true that we should only use documents?
            DocumentValue<string, any>
          >[],
          "normal"
        >,
        null,
        null
      >
>;
