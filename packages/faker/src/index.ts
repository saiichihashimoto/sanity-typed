import { Faker } from "@faker-js/faker";
import type {
  IsNumericLiteral,
  IsStringLiteral,
  OmitIndexSignature,
  Simplify,
  UnionToIntersection,
} from "type-fest";

import type {
  IntrinsicTypeName,
  _ArrayMemberDefinition,
  _ConfigBase,
  _FieldDefinition,
  _GetOriginalRule,
  _TypeDefinition,
} from "@sanity-typed/types";

import type { MaybeArray } from "./utils";

type IsObject<T> = T extends any[] ? false : T extends object ? true : false;

type _SchemaTypeDefinition<
  TType extends string,
  TOptionsHelper,
  TReferenced extends string
> =
  | _ArrayMemberDefinition<
      TType,
      any,
      any,
      any,
      TOptionsHelper,
      TReferenced,
      any,
      any,
      any
    >
  | _FieldDefinition<
      TType,
      any,
      any,
      any,
      TOptionsHelper,
      TReferenced,
      any,
      any,
      any
    >
  | _TypeDefinition<
      TType,
      any,
      any,
      any,
      TOptionsHelper,
      TReferenced,
      any,
      any
    >;

type RuleOf<TSchemaType extends _SchemaTypeDefinition<any, any, any>> =
  _GetOriginalRule<TSchemaType>;

type RuleMap<TType extends IntrinsicTypeName, TReturnType> = {
  [TName in keyof OmitIndexSignature<
    UnionToIntersection<
      RuleOf<_SchemaTypeDefinition<IntrinsicTypeName, any, any>>
    >
  >]?: (
    current: TReturnType,
    args: RuleOf<_SchemaTypeDefinition<TType, any, any>> extends {
      [name in TName]: (...args: infer TArgs) => any;
    }
      ? TArgs
      : never
  ) => TReturnType;
};

// FIXME traverseValidation should be replace with something that traverses validation and returns an object of the called values
const traverseValidation = <
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TReturnType
>(
  { validation }: TSchemaType,
  initialValue: TReturnType,
  ruleMap: RuleMap<TSchemaType["type"], TReturnType>,
  defaultFn: (current: TReturnType) => TReturnType = (current) => current
) => {
  /* eslint-disable fp/no-let,fp/no-mutation,fp/no-unused-expression -- mutation */
  let value = initialValue;

  const rule = {
    custom: (...args: any[]) => {
      value = ruleMap?.custom?.(value, args as any) ?? value;
      return rule;
    },
    email: (...args: any[]) => {
      value = ruleMap?.email?.(value, args as any) ?? value;
      return rule;
    },
    error: (...args: any[]) => {
      value = ruleMap?.error?.(value, args as any) ?? value;
      return rule;
    },
    greaterThan: (...args: any[]) => {
      value = ruleMap?.greaterThan?.(value, args as any) ?? value;
      return rule;
    },
    integer: (...args: any[]) => {
      value = ruleMap?.integer?.(value, args as any) ?? value;
      return rule;
    },
    length: (...args: any[]) => {
      value = ruleMap?.length?.(value, args as any) ?? value;
      return rule;
    },
    lessThan: (...args: any[]) => {
      value = ruleMap?.lessThan?.(value, args as any) ?? value;
      return rule;
    },
    lowercase: (...args: any[]) => {
      value = ruleMap?.lowercase?.(value, args as any) ?? value;
      return rule;
    },
    max: (...args: any[]) => {
      value = ruleMap?.max?.(value, args as any) ?? value;
      return rule;
    },
    min: (...args: any[]) => {
      value = ruleMap?.min?.(value, args as any) ?? value;
      return rule;
    },
    negative: (...args: any[]) => {
      value = ruleMap?.negative?.(value, args as any) ?? value;
      return rule;
    },
    positive: (...args: any[]) => {
      value = ruleMap?.positive?.(value, args as any) ?? value;
      return rule;
    },
    precision: (...args: any[]) => {
      value = ruleMap?.precision?.(value, args as any) ?? value;
      return rule;
    },
    regex: (...args: any[]) => {
      value = ruleMap?.regex?.(value, args as any) ?? value;
      return rule;
    },
    required: (...args: any[]) => {
      value = ruleMap?.required?.(value, args as any) ?? value;
      return rule;
    },
    unique: (...args: any[]) => {
      value = ruleMap?.unique?.(value, args as any) ?? value;
      return rule;
    },
    uppercase: (...args: any[]) => {
      value = ruleMap?.uppercase?.(value, args as any) ?? value;
      return rule;
    },
    uri: (...args: any[]) => {
      value = ruleMap?.uri?.(value, args as any) ?? value;
      return rule;
    },
    valueOfField: () => ({
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/336
      path: "",
      type: Symbol("TODO"),
    }),
    warning: (...args: any[]) => {
      value = ruleMap?.warning?.(value, args as any) ?? value;
      return rule;
    },
  } as unknown as RuleOf<_SchemaTypeDefinition<IntrinsicTypeName, any, any>>;

  validation?.(
    // @ts-expect-error -- TODO Honestly, idk
    rule
  );

  if (value === initialValue) {
    value = defaultFn?.(value) ?? value;
  }

  /* eslint-enable fp/no-let,fp/no-mutation,fp/no-unused-expression */

  return value;
};

type FakerOrFakerFn = Faker | (() => Faker);

const constantFakers = {
  boolean: (faker: Faker) => faker.datatype.boolean(),
};

const numberFaker =
  <TSchemaType extends _SchemaTypeDefinition<"number", number, any>>(
    schemaType: TSchemaType
  ) =>
  (faker: Faker) =>
    (!schemaType.options?.list?.length
      ? faker.number.float({
          min: -50,
          max: 50,
        })
      : faker.helpers.arrayElement(
          schemaType.options.list.map((maybeTitledListValue) =>
            typeof maybeTitledListValue === "number"
              ? maybeTitledListValue
              : maybeTitledListValue.value!
          )
        )) as TSchemaType extends _SchemaTypeDefinition<
      "number",
      infer TOptionsHelper,
      any
    >
      ? IsNumericLiteral<TOptionsHelper> extends false
        ? number
        : TOptionsHelper
      : never;

const stringFaker =
  <TSchemaType extends _SchemaTypeDefinition<"string", string, any>>(
    schemaType: TSchemaType
  ) =>
  (faker: Faker) =>
    (!schemaType.options?.list?.length
      ? faker.lorem.words({
          min: 3,
          max: 10,
        })
      : faker.helpers.arrayElement(
          schemaType.options.list.map((maybeTitledListValue) =>
            typeof maybeTitledListValue === "string"
              ? maybeTitledListValue
              : maybeTitledListValue.value!
          )
        )) as TSchemaType extends _SchemaTypeDefinition<
      "string",
      infer TOptionsHelper,
      any
    >
      ? IsStringLiteral<TOptionsHelper> extends false
        ? string
        : TOptionsHelper
      : never;

const addType =
  <const Type extends string | undefined, Fn extends (faker: Faker) => any>(
    type: Type,
    fn: Fn
  ) =>
  (faker: Faker) => {
    const value = fn(faker);

    return (
      typeof type !== "string"
        ? value
        : Array.isArray(value)
        ? value
        : // HACK
        typeof value !== "object"
        ? value
        : { ...value, _type: type }
    ) as IsStringLiteral<Type> extends false
      ? ReturnType<Fn>
      : IsObject<ReturnType<Fn>> extends false
      ? ReturnType<Fn>
      : Omit<ReturnType<Fn>, "_type"> & { _type: Type };
  };

const addKey =
  <Fn extends (faker: Faker) => any>(fn: Fn) =>
  (faker: Faker) => {
    const value = fn(faker);

    return (
      Array.isArray(value)
        ? value
        : // HACK
        typeof value !== "object"
        ? value
        : { ...value, _key: faker.database.mongodbObjectId() }
    ) as IsObject<ReturnType<Fn>> extends false
      ? ReturnType<Fn>
      : Omit<ReturnType<Fn>, "_key"> & { _key: string };
  };

type MembersFaker<
  TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[],
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = (
  faker: Faker
) => TMemberDefinitions extends (infer TMemberDefinition extends _ArrayMemberDefinition<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>)[]
  ? (TMemberDefinition extends never
      ? never
      : ReturnType<
          ReturnType<
            typeof addKey<
              ReturnType<
                typeof addType<
                  TMemberDefinition["name"],
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
                  SchemaTypeToFaker<TMemberDefinition, TAliasedFakers>
                >
              >
            >
          >
        >)[]
  : never;

const membersFaker = <
  TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[],
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  members: TMemberDefinitions,
  getFakers: () => TAliasedFakers
): MembersFaker<TMemberDefinitions, TAliasedFakers> => {
  const memberFakers = members.map(
    (
      member: TMemberDefinitions[number] // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    ) => addKey(addType(member.name, schemaTypeToFaker(member, getFakers)))
  );

  return (faker) =>
    // @ts-expect-error -- FIXME
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) })
      .map(
        () =>
          faker.helpers.arrayElement(
            memberFakers
          ) as (typeof memberFakers)[number]
      )
      .map((fn) => fn(faker));
};

type ArrayFaker<
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = TSchemaType extends {
  of: infer TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[];
}
  ? ReturnType<typeof membersFaker<TMemberDefinitions, TAliasedFakers>>
  : never;

const arrayFaker = <
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers
): ArrayFaker<TSchemaType, TAliasedFakers> => {
  type TMemberDefinitions = TSchemaType extends {
    of: infer TMemberDefinitionsInner;
  }
    ? TMemberDefinitionsInner
    : never;

  return membersFaker(
    schemaType.of as TMemberDefinitions,
    getFakers
  ) as ArrayFaker<TSchemaType, TAliasedFakers>;
};

const isFieldRequired = (
  field: _FieldDefinition<any, any, any, any, any, any, any, any, any>
): field is _FieldDefinition<any, any, any, any, any, any, any, any, true> =>
  traverseValidation(field, false as boolean, {
    required: () => true,
  });

type FieldsFaker<
  TSchemaType extends _SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = TSchemaType extends {
  fields?: (infer TFieldDefinition extends _FieldDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >)[];
}
  ? (faker: Faker) => Simplify<
      {
        [Name in Extract<
          TFieldDefinition,
          _FieldDefinition<any, any, any, any, any, any, any, any, false>
        >["name"]]?: ReturnType<
          // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
          SchemaTypeToFaker<
            Extract<TFieldDefinition, { name: Name }>,
            TAliasedFakers
          >
        >;
      } & {
        [Name in Extract<
          TFieldDefinition,
          _FieldDefinition<any, any, any, any, any, any, any, any, true>
        >["name"]]: ReturnType<
          // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
          SchemaTypeToFaker<
            Extract<TFieldDefinition, { name: Name }>,
            TAliasedFakers
          >
        >;
      }
    >
  : never;

const fieldsFaker = <
  TSchemaType extends _SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  { fields = [] }: TSchemaType,
  getFakers: () => TAliasedFakers
): FieldsFaker<TSchemaType, TAliasedFakers> => {
  const fieldsFakers = (
    fields as _FieldDefinition<any, any, any, any, any, any, any, any, any>[]
  ).map(
    (field) =>
      [
        field.name as string,
        isFieldRequired(field)
          ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            schemaTypeToFaker(field, getFakers)
          : (faker: Faker) =>
              faker.datatype.boolean()
                ? undefined
                : // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
                  schemaTypeToFaker(field, getFakers)(faker),
      ] as const
  );

  return ((faker: Faker) =>
    Object.fromEntries(
      fieldsFakers
        .map(([name, fieldFaker]) => [name, fieldFaker(faker)] as const)
        .filter(([, value]) => value !== undefined)
    )) as FieldsFaker<TSchemaType, TAliasedFakers>;
};

type ObjectFaker<
  TSchemaType extends _SchemaTypeDefinition<"object", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>;

const objectFaker = <
  TSchemaType extends _SchemaTypeDefinition<"object", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers
): ObjectFaker<TSchemaType, TAliasedFakers> =>
  fieldsFaker(schema, getFakers) as ObjectFaker<TSchemaType, TAliasedFakers>;

type SchemaTypeToFaker<
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = TSchemaType["type"] extends keyof typeof constantFakers
  ? (typeof constantFakers)[TSchemaType["type"]]
  : TSchemaType["type"] extends "number"
  ? ReturnType<
      typeof numberFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"number", any, any>>
      >
    >
  : TSchemaType["type"] extends "string"
  ? ReturnType<
      typeof stringFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"string", any, any>>
      >
    >
  : TSchemaType["type"] extends "array"
  ? ReturnType<
      typeof arrayFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"array", any, any>>,
        TAliasedFakers
      >
    >
  : TSchemaType["type"] extends "object"
  ? ReturnType<
      typeof objectFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"object", any, any>>,
        TAliasedFakers
      >
    >
  : never;

const schemaTypeToFaker = <
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers
): SchemaTypeToFaker<TSchemaType, TAliasedFakers> =>
  (schema.type in constantFakers
    ? constantFakers[
        schema.type as TSchemaType["type"] & keyof typeof constantFakers
      ]
    : schema.type === "number"
    ? numberFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"number", number, any>
        >
      )
    : schema.type === "string"
    ? stringFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"string", string, any>
        >
      )
    : schema.type === "array"
    ? arrayFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"array", any, any>
        >,
        getFakers
      )
    : schema.type === "object"
    ? objectFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"object", any, any>
        >,
        getFakers
      )
    : (undefined as never)) as SchemaTypeToFaker<TSchemaType, TAliasedFakers>;

const getFaker = (faker: FakerOrFakerFn) =>
  faker instanceof Faker ? faker : faker();

const lazyFaker = <
  MaybeFaker extends FakerOrFakerFn | undefined,
  Fn extends (faker: Faker) => any
>(
  maybeFaker: MaybeFaker,
  fn: Fn
) => {
  // eslint-disable-next-line fp/no-let -- Lazily instantiate faker
  let fakerInstantiated: Faker | undefined;

  // eslint-disable-next-line no-return-assign -- Lazily instantiate faker
  return (
    ...args: undefined extends MaybeFaker
      ? [faker: FakerOrFakerFn]
      : [faker?: FakerOrFakerFn]
  ) =>
    fn(
      (args[0] && getFaker(args[0])) ??
        fakerInstantiated ??
        // eslint-disable-next-line fp/no-mutation -- Lazily instantiate faker
        (fakerInstantiated = getFaker(maybeFaker!))
    ) as ReturnType<Fn>;
};

type SanityConfigFakers<
  TConfig extends MaybeArray<_ConfigBase<any, any>>,
  MaybeFaker extends FakerOrFakerFn | undefined
> = TConfig extends MaybeArray<
  _ConfigBase<infer TTypeDefinition, infer TPluginOptions>
>
  ? {
      [Name in TTypeDefinition["name"]]: ReturnType<
        typeof lazyFaker<
          MaybeFaker,
          ReturnType<
            typeof addType<
              Name,
              SchemaTypeToFaker<
                Extract<TTypeDefinition, { name: Name }>,
                SanityConfigFakers<TConfig, MaybeFaker> &
                  SanityConfigFakers<TPluginOptions, MaybeFaker>
              >
            >
          >
        >
      >;
    }
  : never;

export const sanityConfigToFaker = <
  const TConfig extends _ConfigBase<any, any>,
  const MaybeFaker extends FakerOrFakerFn | undefined
>(
  {
    schema: { types: typesUntyped = [] } = {},
    plugins: pluginsUntyped = [],
  }: TConfig,
  options: {
    faker?: MaybeFaker;
  } = {}
) => {
  type TTypeDefinition = TConfig extends _ConfigBase<infer TTypeDefinition, any>
    ? TTypeDefinition
    : never;

  const types = typesUntyped as NonNullable<
    NonNullable<_ConfigBase<TTypeDefinition, any>["schema"]>["types"]
  >;

  type TPluginOptions = TConfig extends _ConfigBase<any, infer TPluginOptions>
    ? TPluginOptions
    : never;

  const plugins = pluginsUntyped as TPluginOptions[];

  const pluginsFakers = plugins
    .map(
      (plugin) =>
        sanityConfigToFaker(plugin, options) as SanityConfigFakers<
          TPluginOptions,
          MaybeFaker
        >
    )
    .reduce(
      (acc, zods) => ({ ...acc, ...zods }),
      {} as SanityConfigFakers<TPluginOptions, MaybeFaker>
    );

  const fakers: SanityConfigFakers<TConfig, MaybeFaker> = Array.isArray(types)
    ? Object.fromEntries(
        types.map((type) => [
          type.name,
          lazyFaker(
            options.faker,
            addType(
              type.name,
              schemaTypeToFaker(type, () => ({
                ...pluginsFakers,
                ...fakers,
              }))
            )
          ),
        ])
      )
    : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
      (undefined as never);

  return fakers;
};
