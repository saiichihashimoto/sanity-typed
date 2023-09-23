import { Faker } from "@faker-js/faker";

import type {
  _ArrayMemberDefinition,
  _ConfigBase,
  _FieldDefinition,
  _TypeDefinition,
} from "@sanity-typed/types";

import type { MaybeArray } from "./utils";

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

type FakerOrFakerFn = Faker | (() => Faker);

const constantFakers = {
  boolean: (faker: Faker) => faker.datatype.boolean(),
};

const stringFaker =
  <TSchemaType extends _SchemaTypeDefinition<"string", string, any>>(
    schemaType: TSchemaType
  ) =>
  (faker: Faker) =>
    faker.lorem.words({ min: 3, max: 10 });

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
) => ReturnType<
  SchemaTypeToFaker<TMemberDefinitions[number], TAliasedFakers>
>[];

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
    ) => schemaTypeToFaker(member, getFakers)
  );

  return (faker) =>
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

type SchemaTypeToFaker<
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = TSchemaType["type"] extends keyof typeof constantFakers
  ? (typeof constantFakers)[TSchemaType["type"]]
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
    : (undefined as never)) as SchemaTypeToFaker<TSchemaType, TAliasedFakers>;

const getFaker = (faker: FakerOrFakerFn) =>
  faker instanceof Faker ? faker : faker();

const lazyFaker = <MaybeFaker extends FakerOrFakerFn | undefined, Value>(
  maybeFaker: MaybeFaker,
  fn: (faker: Faker) => Value
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
    );
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
            SchemaTypeToFaker<
              Extract<TTypeDefinition, { name: Name }>,
              SanityConfigFakers<TConfig, MaybeFaker> &
                SanityConfigFakers<TPluginOptions, MaybeFaker>
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
            schemaTypeToFaker(type, () => ({
              ...pluginsFakers,
              ...fakers,
            }))
          ),
        ])
      )
    : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
      (undefined as never);

  return fakers;
};
