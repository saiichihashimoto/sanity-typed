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

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElement
 */
type ArrayElement<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `...${infer TArrayElement}`
  ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
    Evaluate<TArrayElement, TScope> extends any[]
    ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
      Evaluate<TArrayElement, TScope>
    : [
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
        Evaluate<TArrayElement, TScope>
      ]
  : [
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
      Evaluate<TExpression, TScope>
    ];

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElements
 */
type ArrayElements<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  TPrefix extends string = ""
> = TExpression extends `${infer TArrayElement},${infer TArrayElements}`
  ? ArrayElement<`${TPrefix}${TArrayElement}`, TScope> extends [never]
    ? ArrayElements<TArrayElements, TScope, `${TPrefix}${TArrayElement},`>
    : [
        ...ArrayElement<`${TPrefix}${TArrayElement}`, TScope>,
        ...ArrayElements<TArrayElements, TScope>
      ]
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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#String
 */
type StringType<TExpression extends string> = TExpression extends  // FIXME Should check for specific characters
  | `'${infer TString extends string}'`
  | `"${infer TString extends string}"`
  ? TString
  : never;

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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Literal
 *
 * @todo Object
 */
type Literal<TExpression extends string, TScope extends Scope<any, any, any>> =
  | ArrayType<TExpression, TScope>
  | Primitives<TExpression>
  | StringType<TExpression>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-count-
 */
type Count<TArgs extends string, TScope extends Scope<any, any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
  Evaluate<TArgs, TScope> extends never
    ? never
    : // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
    Evaluate<TArgs, TScope> extends any[]
    ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
      Evaluate<TArgs, TScope>["length"]
    : null;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-global-defined-
 */
type Defined<TArgs extends string, TScope extends Scope<any, any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
  Evaluate<TArgs, TScope> extends never
    ? never
    : // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
    Evaluate<TArgs, TScope> extends null
    ? false
    : true;

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
   * @todo length
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
> = TExpression extends "*"
  ? TScope extends Scope<Context<infer Dataset, any>, any, any>
    ? Dataset
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parent
 */
type Parent<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends "^"
  ? TScope extends Scope<any, any, Scope<any, infer Value, any>>
    ? Value
    : never
  : TExpression extends `^.${infer TParents}`
  ? TScope extends Scope<
      any,
      any,
      infer TParentScope extends Scope<any, any, any>
    >
    ? Parent<TParents, TParentScope>
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#This
 */
type This<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends "@"
  ? TScope extends Scope<any, infer Value, any>
    ? Value
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ThisAttribute
 */
type ThisAttribute<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TScope extends Scope<any, infer Value, any>
  ? TExpression extends keyof Value
    ? Value[TExpression]
    : never
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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Parenthesis
 */
type Parenthesis<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `(${infer TInnerExpression})`
  ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursion
    Evaluate<TInnerExpression, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#CompoundExpression
 *
 * @todo PipeFuncCall
 * @todo TraversalExpression
 */
type CompoundExpression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = Parenthesis<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Expression
 *
 * @todo OperatorCall
 */
type Expression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
  | CompoundExpression<TExpression, TScope>
  | Literal<TExpression, TScope>
  | SimpleExpression<TExpression, TScope>;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Evaluate()
 */
type Evaluate<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = Expression<TExpression, TScope>;

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
