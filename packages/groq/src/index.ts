// FIXME Handle Whitespace

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Query-context
 */
export type Context<Dataset> = {
  dataset: Dataset;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Scope
 */
export type Scope<
  TContext extends Context<any>,
  Value,
  ParentScope extends Scope<any, any, any> | null
> = {
  context: TContext;
  parent: ParentScope;
  this: Value;
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#NewNestedScope()
 */
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
        : TString
      : never)
  | (TExpression extends `"${infer TString}"`
      ? IfStringHas<
          ExcludeFromString<TString, `\\${EscapeSequence}`>,
          '"'
        > extends true
        ? never
        : TString
      : never);

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
  _Prefix extends string = ""
> = `${_Prefix}${TExpression}` extends ""
  ? []
  :
      | ArrayElement<`${_Prefix}${TExpression}`, TScope>
      | (TExpression extends `${infer TArrayElement},${infer TArrayElements}`
          ?
              | ArrayElements<
                  TArrayElements,
                  TScope,
                  `${_Prefix}${TArrayElement},`
                >
              | (ArrayElement<
                  `${_Prefix}${TArrayElement}`,
                  TScope
                > extends never
                  ? never
                  : ArrayElements<TArrayElements, TScope> extends never
                  ? never
                  : [
                      ...ArrayElement<`${_Prefix}${TArrayElement}`, TScope>,
                      ...ArrayElements<TArrayElements, TScope>
                    ])
          : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Array
 */
type ArrayType<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `[${infer TArrayElements}]`
  ? ArrayElements<TArrayElements, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Literal
 */
type Literal<TExpression extends string, TScope extends Scope<any, any, any>> =
  | ArrayType<TExpression, TScope>
  // TODO Object
  | Primitives<TExpression>
  | StringType<TExpression>;

type Negate<
  TBoolean extends boolean,
  Enabled extends boolean = true
> = Enabled extends false ? TBoolean : TBoolean extends true ? false : true;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Equality
 */
type Equality<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Negated extends boolean = boolean,
  _Prefix extends string = ""
> = boolean extends _Negated
  ?
      | Equality<TExpression, TScope, false, _Prefix>
      | Equality<TExpression, TScope, true, _Prefix>
  : TExpression extends `${infer TLeft}${_Negated extends true
      ? "!"
      : "="}=${infer TRight}`
  ?
      | Equality<
          TRight,
          TScope,
          _Negated,
          `${_Prefix}${TLeft}${_Negated extends true ? "!" : "="}=`
        >
      | (Evaluate<`${_Prefix}${TLeft}`, TScope> extends never
          ? never
          : Evaluate<TRight, TScope> extends never
          ? never
          : Negate<
              // TODO Test Equality cases in https://sanity-io.github.io/GROQ/GROQ-1.revision1/#PartialCompare()
              Evaluate<`${_Prefix}${TLeft}`, TScope> extends Evaluate<
                TRight,
                TScope
              >
                ? true
                : Evaluate<TRight, TScope> extends Evaluate<
                    `${_Prefix}${TLeft}`,
                    TScope
                  >
                ? true
                : false,
              _Negated
            >)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#OperatorCall
 */
type OperatorCall<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
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
  Equality<TExpression, TScope>;

type FuncArgs<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = `${_Prefix}${TExpression}` extends ""
  ? []
  :
      | (Evaluate<`${_Prefix}${TExpression}`, TScope> extends never
          ? never
          : [Evaluate<`${_Prefix}${TExpression}`, TScope>])
      | (TExpression extends `${infer TFuncArg},${infer TFuncArgs}`
          ?
              | FuncArgs<TFuncArgs, TScope, `${_Prefix}${TFuncArg},`>
              | (Evaluate<`${_Prefix}${TFuncArg}`, TScope> extends never
                  ? never
                  : FuncArgs<TFuncArgs, TScope> extends never
                  ? never
                  : [
                      Evaluate<`${_Prefix}${TFuncArg}`, TScope>,
                      ...FuncArgs<TFuncArgs, TScope>
                    ])
          : never);

type CoalesceArgs<TArgs extends any[]> = TArgs extends []
  ? null
  : TArgs extends [infer TFirst, ...infer TRest]
  ? TFirst extends null
    ? CoalesceArgs<TRest> | NonNullable<TFirst>
    : TFirst
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_coalesce()
 */
type Coalesce<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}coalesce(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : CoalesceArgs<FuncArgs<TArgs, TScope>>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_count()
 */
type Count<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}count(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TBase]
    ? TBase extends any[]
      ? TBase["length"]
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_defined()
 */
type Defined<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}defined(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TBase]
    ? TBase extends null
      ? false
      : true
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_length()
 */
type Length<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}length(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TBase]
    ? TBase extends any[] | string
      ? TBase["length"]
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_lower()
 */
type Lower<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}lower(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TValue]
    ? TValue extends string
      ? Lowercase<TValue>
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_now()
 */
type Now<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}now(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends []
    ? string
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_upper()
 */
type Upper<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}upper(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TValue]
    ? TValue extends string
      ? Uppercase<TValue>
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#FuncCall
 */
type FuncCall<TExpression extends string, TScope extends Scope<any, any, any>> =
  // TODO array::
  // TODO dateTime::
  // TODO delta::
  // TODO diff::
  // TODO math::
  // TODO string::
  // TODO After<TExpression, TScope>
  // TODO Before<TExpression, TScope>
  // TODO Boost<TExpression, TScope>
  | Coalesce<TExpression, TScope>
  | Count<TExpression, TScope>
  // TODO DateTime<TExpression, TScope>
  | Defined<TExpression, TScope>
  | Length<TExpression, TScope>
  | Lower<TExpression, TScope>
  | Now<TExpression, TScope>
  // TODO Operation<TExpression, TScope>
  // TODO References<TExpression, TScope>
  // TODO Round<TExpression, TScope>
  // TODO Select<TExpression, TScope>
  // TODO String<TExpression, TScope>
  | Upper<TExpression, TScope>;

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

type AttributeAccessOverArray<TBase extends any[], TAttribute> = {
  [K in keyof TBase]: TBase[K][TAttribute & keyof TBase[K]];
};

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#AttributeAccess
 */
type AttributeAccess<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}.${infer TIdentifier}`
  ?
      | AttributeAccess<TIdentifier, TScope, `${_Prefix}${TBase}.`>
      | (Evaluate<`${_Prefix}${TBase}`, TScope> extends never
          ? never
          : Evaluate<`${_Prefix}${TBase}`, TScope> extends any[]
          ? AttributeAccessOverArray<
              Evaluate<`${_Prefix}${TBase}`, TScope>,
              TIdentifier
            >
          : Evaluate<`${_Prefix}${TBase}`, TScope>[TIdentifier &
              keyof Evaluate<`${_Prefix}${TBase}`, TScope>])
  : TExpression extends `${infer TBase}[${infer TAttributeAccessExpression}]`
  ?
      | AttributeAccess<
          `${TAttributeAccessExpression}]`,
          TScope,
          `${_Prefix}${TBase}[`
        >
      | (Evaluate<`${_Prefix}${TBase}`, TScope> extends never
          ? never
          : Evaluate<TAttributeAccessExpression, TScope> extends never
          ? never
          : Evaluate<TAttributeAccessExpression, TScope> extends string
          ? Evaluate<`${_Prefix}${TBase}`, TScope> extends any[]
            ? AttributeAccessOverArray<
                Evaluate<`${_Prefix}${TBase}`, TScope>,
                Evaluate<TAttributeAccessExpression, TScope>
              >
            : Evaluate<
                TAttributeAccessExpression,
                TScope
              > extends infer TAttr extends keyof Evaluate<
                `${_Prefix}${TBase}`,
                TScope
              >
            ? Evaluate<`${_Prefix}${TBase}`, TScope>[TAttr]
            : never
          : never)
  : never;

type ElementAccess<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}[${infer TElementAccessExpression}]`
  ?
      | ElementAccess<
          `${TElementAccessExpression}]`,
          TScope,
          `${_Prefix}${TBase}[`
        >
      | (Evaluate<`${_Prefix}${TBase}`, TScope> extends never
          ? never
          : Evaluate<TElementAccessExpression, TScope> extends never
          ? never
          : Evaluate<TElementAccessExpression, TScope> extends number
          ? Evaluate<`${_Prefix}${TBase}`, TScope> extends any[]
            ? Evaluate<`${_Prefix}${TBase}`, TScope>[number]
            : // TODO TraversalArrayTarget
              never
          : never)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Range
 */
type Range<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Exclusive extends boolean = boolean,
  _Prefix extends string = ""
> = boolean extends _Exclusive
  ?
      | Range<TExpression, TScope, false, _Prefix>
      | Range<TExpression, TScope, true, _Prefix>
  : TExpression extends `${infer TLeft}${_Exclusive extends true
      ? "."
      : ""}..${infer TRight}`
  ?
      | Range<
          TRight,
          TScope,
          _Exclusive,
          `${_Prefix}${TLeft}${_Exclusive extends true ? "." : ""}..`
        >
      | (Evaluate<`${_Prefix}${TLeft}`, TScope> extends never
          ? never
          : Evaluate<TRight, TScope> extends never
          ? never
          : Evaluate<`${_Prefix}${TLeft}`, TScope> extends number
          ? Evaluate<TRight, TScope> extends number
            ? {
                exclusive: _Exclusive;
                left: Evaluate<`${_Prefix}${TLeft}`, TScope>;
                right: Evaluate<TRight, TScope>;
              }
            : never
          : never)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Slice
 */
type Slice<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}[${infer TRange}]`
  ?
      | Slice<`${TRange}]`, TScope, `${_Prefix}${TBase}[`>
      | (Evaluate<`${_Prefix}${TBase}`, TScope> extends never
          ? never
          : Range<TRange, TScope> extends never
          ? never
          : Evaluate<`${_Prefix}${TBase}`, TScope> extends any[]
          ? // TODO Is there a way to incoporate the range in this result
            Evaluate<`${_Prefix}${TBase}`, TScope>
          : // TODO TraversalArrayTarget
            null)
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#EvaluateFilter()
 */
type EvaluateFilter<
  TBase,
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TBase extends []
  ? []
  : TBase extends [infer TFirst, ...infer TRest]
  ? Evaluate<TExpression, NestedScope<TFirst, TScope>> extends never
    ? never
    : Evaluate<TExpression, NestedScope<TFirst, TScope>> extends boolean
    ? Evaluate<TExpression, NestedScope<TFirst, TScope>> extends true
      ? [TFirst, ...EvaluateFilter<TRest, TExpression, TScope>]
      : EvaluateFilter<TRest, TExpression, TScope>
    : never
  : TBase extends (infer TArrayElement)[]
  ? Evaluate<TExpression, NestedScope<TArrayElement, TScope>> extends never
    ? never
    : Evaluate<TExpression, NestedScope<TArrayElement, TScope>> extends boolean
    ? (TArrayElement extends never
        ? never
        : Evaluate<TExpression, NestedScope<TArrayElement, TScope>> extends true
        ? TArrayElement
        : never)[]
    : never
  : Evaluate<TExpression, NestedScope<TBase, TScope>> extends never
  ? never
  : Evaluate<TExpression, NestedScope<TBase, TScope>> extends boolean
  ? // TODO TraversalArrayTarget
    TBase
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Filter
 */
type Filter<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = TExpression extends `${infer TBase}[${infer TFilterExpression}]`
  ?
      | EvaluateFilter<
          Evaluate<`${_Prefix}${TBase}`, TScope>,
          TFilterExpression,
          TScope
        >
      | Filter<`${TFilterExpression}]`, TScope, `${_Prefix}${TBase}[`>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayPostfix
 */
type ArrayPostfix<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${infer TBase}[]`
  ? Evaluate<TBase, TScope> extends never
    ? never
    : Evaluate<TBase, TScope> extends any[]
    ? Evaluate<TBase, TScope>
    : // TODO TraversalArrayTarget
      null
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#TraversalExpression
 *
 * In the documentation, GROQ is defined as a CFG, which makes sense.
 * And, if typescript allowed for direct recursive types, we could type GROQ as a CFG,
 * ie. type TraversalArray = BasicTraversalArray | `${BasicTraversalArray}${TraversalArray}` | ...;
 *
 * But we can't 😭 The way we're doing recursion, is to flip it, where everything attempts to infer correctly,
 * then returns `never` on failure. This is generally fine, but we lose a few things:
 *
 * 1. We won't get autocomplete.
 * 2. We can't type as a CFG directly.
 * 3. We need to evaluate right to left NOT left to right like the CFG.
 *
 * 1 & 2 is unfortunate, but 3 is a problem. TraversalArray, TraversalPlain, etc mapping to the EvaluateTraversal*
 * needs to be figured out.
 *
 * Luckily, most of the traversals can just identify which of these it is internally, and array-ify or un-array-ify it.
 *
 * Regardless, the Traversal*s won't make direct sense as much sense. We'll find the correct traversal, then evaluate.
 *
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#sec-Traversal-operators
 */
type TraversalExpression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
  | ArrayPostfix<TExpression, TScope>
  | AttributeAccess<TExpression, TScope>
  // TODO Dereference<TExpression, TScope>
  | ElementAccess<TExpression, TScope>
  | Filter<TExpression, TScope>
  // TODO Projection<TExpression, TScope>
  | Slice<TExpression, TScope>;

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
 */
type CompoundExpression<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
  | Parenthesis<TExpression, TScope>
  // TODO PipeFuncCall
  | TraversalExpression<TExpression, TScope>;

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
  ContextOrScope extends Context<any> | Scope<any, any, any> = Context<never>
> = Evaluate<
  TQuery,
  ContextOrScope extends Context<any>
    ? Scope<ContextOrScope, null, null>
    : ContextOrScope
>;
