import type { Merge } from "type-fest";

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
  TArrayElement extends string,
  TScope extends Scope<any, any, any>
> = TArrayElement extends `...${infer TExpression}`
  ? Evaluate<TExpression, TScope> extends never
    ? never
    : Evaluate<TExpression, TScope> extends any[]
    ? Evaluate<TExpression, TScope>
    : [Evaluate<TExpression, TScope>]
  : Evaluate<TArrayElement, TScope> extends never
  ? never
  : [Evaluate<TArrayElement, TScope>];

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ArrayElements
 */
type ArrayElements<
  TArrayElements extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = `${_Prefix}${TArrayElements}` extends ""
  ? []
  :
      | ArrayElement<`${_Prefix}${TArrayElements}`, TScope>
      | (TArrayElements extends `${infer TArrayElement},${infer TRemaininingElements}`
          ?
              | ArrayElements<
                  TRemaininingElements,
                  TScope,
                  `${_Prefix}${TArrayElement},`
                >
              | (ArrayElement<
                  `${_Prefix}${TArrayElement}`,
                  TScope
                > extends never
                  ? never
                  : ArrayElements<TRemaininingElements, TScope> extends never
                  ? never
                  : [
                      ...ArrayElement<`${_Prefix}${TArrayElement}`, TScope>,
                      ...ArrayElements<TRemaininingElements, TScope>
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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ThisAttribute
 */
type ThisAttribute<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends keyof TScope["this"]
  ? TScope["this"][TExpression]
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#DetermineName()
 */
type DetermineName<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> =
  | (TExpression extends `${
      // This might be too wide https://sanity-io.github.io/GROQ/GROQ-1.revision1/#DetermineName()
      infer TName
    }${"[" | "{" | "|"}}${string}`
      ? TName
      : never)
  | (ThisAttribute<TExpression, TScope> extends never ? never : TExpression);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ObjectAttribute
 */
type ObjectAttribute<
  TObjectAttribute extends string,
  TScope extends Scope<any, any, any>
> = TObjectAttribute extends `...${infer TExpression}`
  ? TExpression extends ""
    ? TScope["this"]
    : Evaluate<TExpression, TScope>
  : TObjectAttribute extends `${infer TName}:${infer TExpression}`
  ? StringType<TName> extends never
    ? never
    : Evaluate<TExpression, TScope> extends never
    ? never
    : { [name in StringType<TName>]: Evaluate<TExpression, TScope> }
  : Evaluate<TObjectAttribute, TScope> extends never
  ? never
  : DetermineName<TObjectAttribute, TScope> extends never
  ? never
  : {
      [key in DetermineName<TObjectAttribute, TScope>]: Evaluate<
        TObjectAttribute,
        TScope
      >;
    };

type EmptyObject = { [key: string]: never };

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#ObjectAttributes
 */
type ObjectAttributes<
  TObjectAttributes extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = `${_Prefix}${TObjectAttributes}` extends ""
  ? EmptyObject
  :
      | ObjectAttribute<`${_Prefix}${TObjectAttributes}`, TScope>
      | (TObjectAttributes extends `${infer TObjectAttribute},${infer TRemaininingAttributes}`
          ?
              | ObjectAttributes<
                  TRemaininingAttributes,
                  TScope,
                  `${_Prefix}${TObjectAttribute},`
                >
              | (ObjectAttribute<
                  `${_Prefix}${TObjectAttribute}`,
                  TScope
                > extends never
                  ? never
                  : ObjectAttributes<
                      TRemaininingAttributes,
                      TScope
                    > extends never
                  ? never
                  : ObjectAttributes<
                      TRemaininingAttributes,
                      TScope
                    > extends EmptyObject
                  ? ObjectAttribute<`${_Prefix}${TObjectAttribute}`, TScope>
                  : Merge<
                      ObjectAttribute<`${_Prefix}${TObjectAttribute}`, TScope>,
                      ObjectAttributes<TRemaininingAttributes, TScope>
                    >)
          : never);

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Object
 */
type ObjectType<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `{${infer TObjectAttributes}}`
  ? ObjectAttributes<TObjectAttributes, TScope>
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#Literal
 */
type Literal<TExpression extends string, TScope extends Scope<any, any, any>> =
  | ArrayType<TExpression, TScope>
  | ObjectType<TExpression, TScope>
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
  TArgs extends string,
  TScope extends Scope<any, any, any>,
  _Prefix extends string = ""
> = `${_Prefix}${TArgs}` extends ""
  ? []
  :
      | (Evaluate<`${_Prefix}${TArgs}`, TScope> extends never
          ? never
          : [Evaluate<`${_Prefix}${TArgs}`, TScope>])
      | (TArgs extends `${infer TFuncArg},${infer TFuncArgs}`
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
type Now<TExpression extends string> = TExpression extends `${
  | ""
  | "global::"}now()`
  ? string
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_round()
 */
type Round<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}round(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TNum, infer TPrec] | [infer TNum]
    ? TNum extends number
      ? unknown extends TPrec
        ? number
        : TPrec extends number
        ? number
        : null
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#global_string()
 */
type StringFunc<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `${"" | "global::"}string(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TVal]
    ? TVal extends boolean | number | string
      ? `${TVal}`
      : null
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
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_avg()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_max()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_min()
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#math_sum()
 */
type MathFuncs<
  TExpression extends string,
  TScope extends Scope<any, any, any>,
  TFuncs extends string,
  TDefault
> = TExpression extends `math::${TFuncs}(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TArr]
    ? TArr extends null[] | []
      ? TDefault
      : TArr extends (number | null)[]
      ? number
      : null
    : never
  : never;

/**
 * @link https://www.sanity.io/docs/groq-functions#48b1e793d6b9
 */
type Sanity_Dataset<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `sanity::dataset()`
  ? TScope["context"]["client"]["dataset"]
  : never;

/**
 * @link https://www.sanity.io/docs/groq-functions#b89053823742
 */
type Sanity_ProjectId<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `sanity::projectId()`
  ? TScope["context"]["client"]["projectId"]
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#string_startsWith()
 */
type String_StartsWith<
  TExpression extends string,
  TScope extends Scope<any, any, any>
> = TExpression extends `string::startsWith(${infer TArgs})`
  ? FuncArgs<TArgs, TScope> extends never
    ? never
    : FuncArgs<TArgs, TScope> extends [infer TStr, infer TPrefix]
    ? TStr extends string
      ? TPrefix extends string
        ? TStr extends `${TPrefix}${string}`
          ? true
          : false
        : null
      : null
    : never
  : never;

/**
 * @link https://sanity-io.github.io/GROQ/GROQ-1.revision1/#FuncCall
 */
type FuncCall<TExpression extends string, TScope extends Scope<any, any, any>> =
  // TODO After<TExpression, TScope>
  // TODO Array_Compact<TExpression, TScope>
  // TODO Array_Join<TExpression, TScope>
  // TODO Array_Unique<TExpression, TScope>
  // TODO Before<TExpression, TScope>
  // TODO Boost<TExpression, TScope>
  | Coalesce<TExpression, TScope>
  | Count<TExpression, TScope>
  // TODO DateTime_Now<TExpression, TScope>
  // TODO DateTime<TExpression, TScope>
  | Defined<TExpression, TScope>
  // TODO Delta_ChangedAny<TExpression, TScope>
  // TODO Delta_ChangedOnly<TExpression, TScope>
  // TODO Diff_ChangedAny<TExpression, TScope>
  // TODO Diff_ChangedOnly<TExpression, TScope>
  // TODO Geo_Contains<TExpression, TScope>
  // TODO Geo_Distance<TExpression, TScope>
  // TODO Geo_Intersects<TExpression, TScope>
  // TODO Geo<TExpression, TScope>
  // TODO Identify<TExpression, TScope>
  | Length<TExpression, TScope>
  | Lower<TExpression, TScope>
  | MathFuncs<TExpression, TScope, "avg" | "max" | "min", null>
  | MathFuncs<TExpression, TScope, "sum", 0>
  | Now<TExpression>
  // TODO Operation<TExpression, TScope>
  // TODO Path<TExpression, TScope>
  // TODO Pt_Text<TExpression, TScope>
  // TODO Pt<TExpression, TScope>
  // TODO References<TExpression, TScope>
  | Round<TExpression, TScope>
  | Sanity_Dataset<TExpression, TScope>
  | Sanity_ProjectId<TExpression, TScope>
  // TODO Select<TExpression, TScope>
  // TODO String_Split<TExpression, TScope>
  | String_StartsWith<TExpression, TScope>
  | StringFunc<TExpression, TScope>
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
  TRange extends string,
  TScope extends Scope<any, any, any>,
  _Exclusive extends boolean = boolean,
  _Prefix extends string = ""
> = boolean extends _Exclusive
  ? Range<TRange, TScope, false, _Prefix> | Range<TRange, TScope, true, _Prefix>
  : TRange extends `${infer TLeft}${_Exclusive extends true
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
  ContextOrScope extends
    | Context<any, any>
    | Scope<any, any, any> = Context<never>
> = Evaluate<
  TQuery,
  ContextOrScope extends Context<any, any>
    ? Scope<ContextOrScope, null, null>
    : ContextOrScope
>;
