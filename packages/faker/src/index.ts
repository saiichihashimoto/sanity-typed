import { Faker } from "@faker-js/faker";
import stringify from "fast-json-stable-stringify";
import { flow } from "lodash/fp";
import RandExp from "randexp";
import type { IsNumericLiteral, IsStringLiteral, Simplify } from "type-fest";

import { traverseValidation } from "@sanity-typed/traverse-validation";
import type {
  MaybeTitledListValue,
  _ArrayMemberDefinition,
  _ConfigBase,
  _FieldDefinition,
  _TypeDefinition,
  _referenced,
} from "@sanity-typed/types";
import { typedTernary } from "@sanity-typed/utils";
import type { MaybeArray } from "@sanity-typed/utils";

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

type FakerOrFakerFn = Faker | (() => Faker);

const constantFakers = {
  boolean: (faker: Faker) => faker.datatype.boolean(),
  // TODO crossDatasetReference
  email: (faker: Faker) => faker.internet.email(),
  geopoint: (faker: Faker) => ({
    _type: "geopoint" as const,
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    ...(faker.datatype.boolean()
      ? {}
      : { alt: faker.number.float({ min: 0, max: 10000, precision: 0.001 }) }),
  }),
  slug: (faker: Faker) => ({
    _type: "slug" as const,
    current: faker.lorem.slug({ min: 1, max: 3 }),
  }),
};

const noInfinity = (value: number) =>
  value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY
    ? undefined
    : value;

const dateAndDatetimeFaker = <
  TSchemaType extends _SchemaTypeDefinition<"date" | "datetime", string, any>
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  return (faker: Faker) =>
    faker.date
      .between({
        from: new Date(
          noInfinity(
            Math.max(
              ...(traversal.min ?? []).map(([minDate]) =>
                new Date(minDate as string).valueOf()
              )
            )
          ) ?? "1990-01-01T00:00:00.000Z"
        ),
        to: new Date(
          noInfinity(
            Math.min(
              ...(traversal.max ?? []).map(([maxDate]) =>
                new Date(maxDate as string).valueOf()
              )
            )
          ) ?? "2030-01-01T00:00:00.000Z"
        ),
      })
      .toISOString();
};

const dateFaker = <
  TSchemaType extends _SchemaTypeDefinition<"date", string, any>
>(
  schemaType: TSchemaType
) => {
  const baseFaker = dateAndDatetimeFaker(schemaType);

  return (faker: Faker) => baseFaker(faker).slice(0, 10);
};

const datetimeFaker = <
  TSchemaType extends _SchemaTypeDefinition<"datetime", string, any>
>(
  schemaType: TSchemaType
) => dateAndDatetimeFaker(schemaType);

const numberFaker = <
  TSchemaType extends _SchemaTypeDefinition<"number", number, any>
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  const epsilon = traversal.integer?.length ? 1 : Number.EPSILON;

  const minChosen = noInfinity(
    Math.max(
      ...(traversal.min ?? []).map(([minNumber]) => minNumber as number),
      ...(traversal.greaterThan ?? []).map(
        ([limit]) => (limit as number) - epsilon
      ),
      ...(!traversal.positive?.length ? [] : [0])
    )
  );
  const maxChosen = noInfinity(
    Math.min(
      ...(traversal.max ?? []).map(([maxNumber]) => maxNumber as number),
      ...(traversal.lessThan ?? []).map(
        ([limit]) => (limit as number) - epsilon
      ),
      ...(!traversal.negative?.length ? [] : [-epsilon])
    )
  );

  const min = minChosen ?? (maxChosen !== undefined ? maxChosen - 100 : -50);
  const max = maxChosen ?? (minChosen !== undefined ? minChosen + 100 : 50);

  type TOptionsHelper = TSchemaType extends _SchemaTypeDefinition<
    "number",
    infer TOptionsHelper,
    any
  >
    ? TOptionsHelper
    : never;

  return typedTernary(
    Boolean(
      schemaType.options?.list?.length
    ) as IsNumericLiteral<TOptionsHelper>,
    () => (faker: Faker) =>
      faker.helpers.arrayElement(
        (
          schemaType.options!.list! as MaybeTitledListValue<TOptionsHelper>[]
        ).map((maybeTitledListValue) =>
          typeof maybeTitledListValue === "number"
            ? maybeTitledListValue
            : maybeTitledListValue.value!
        )
      ),
    () =>
      traversal.integer?.length
        ? (faker: Faker) =>
            faker.number.int({
              min,
              max,
            })
        : (faker: Faker) =>
            faker.number.float({
              min,
              max,
              precision: !traversal.precision?.length
                ? undefined
                : // TODO Handle multiple precisions, somehow
                  10 ** -(traversal.precision[0]![0]! as number),
            })
  );
};

const referenceFaker =
  <TSchemaType extends _SchemaTypeDefinition<"reference", any, any>>(
    schemaType: TSchemaType
  ) =>
  (faker: Faker) => ({
    _ref: faker.string.uuid(),
    _type: "reference" as const,
    ...({} as {
      [_referenced]: TSchemaType extends _SchemaTypeDefinition<
        "reference",
        any,
        infer TReferenced
      >
        ? TReferenced
        : never;
    }),
    ...(true ? {} : { _weak: false }),
    ...(true
      ? {}
      : {
          _strengthenOnPublish: {
            type: "string",
            ...(true ? {} : { weak: false }),
            ...(true
              ? {}
              : {
                  template: {
                    id: "string",
                    params: {} as { [key: string]: boolean | number | string },
                  },
                }),
          },
        }),
  });

const randexpWithFaker = (faker: Faker, regex: RegExp) => {
  const randexp = new RandExp(regex);

  // eslint-disable-next-line fp/no-mutation -- https://www.npmjs.com/package/randexp#custom-prng
  randexp.randInt = (min: number, max: number) =>
    faker.number.int({ min, max });

  return randexp;
};

const stringAndTextFaker = <
  TSchemaType extends _SchemaTypeDefinition<"string" | "text", string, any>
>(
  schemaType: TSchemaType,
  stringFaker: (faker: Faker) => string
) => {
  const traversal = traverseValidation(schemaType);

  // TODO Handle multiple length, somehow
  const length = traversal.length?.[0]?.[0] as number | undefined;

  const minChosen =
    length ??
    noInfinity(
      Math.max(
        ...(traversal.min ?? []).map(([minNumber]) => minNumber as number)
      )
    );
  const maxChosen =
    length ??
    noInfinity(
      Math.min(
        ...(traversal.max ?? []).map(([maxNumber]) => maxNumber as number)
      )
    );

  const min =
    minChosen ?? (maxChosen !== undefined ? Math.max(0, maxChosen - 15) : 5);
  const max = maxChosen ?? (minChosen !== undefined ? minChosen + 15 : 20);

  return traversal.regex?.length
    ? (faker: Faker) =>
        randexpWithFaker(
          faker,
          // TODO Combine multiple regex, somehow
          traversal.regex![0]![0]
        ).gen()
    : traversal.email?.length
    ? (faker: Faker) => faker.internet.email()
    : (faker: Faker) =>
        flow(
          (value: string) => value,
          (value) =>
            !traversal.uppercase?.length ? value : value.toUpperCase(),
          (value) =>
            !traversal.lowercase?.length ? value : value.toLowerCase()
        )(stringFaker(faker).slice(0, faker.number.int({ min, max })));
};

const stringFaker = <
  TSchemaType extends _SchemaTypeDefinition<"string", string, any>
>(
  schemaType: TSchemaType
) => {
  type TOptionsHelper = TSchemaType extends _SchemaTypeDefinition<
    "string",
    infer TOptionsHelper,
    any
  >
    ? TOptionsHelper
    : never;

  return typedTernary(
    Boolean(
      schemaType.options?.list?.length
    ) as IsStringLiteral<TOptionsHelper>,
    () => (faker: Faker) =>
      faker.helpers.arrayElement(
        (
          schemaType.options!.list! as MaybeTitledListValue<TOptionsHelper>[]
        ).map((maybeTitledListValue) =>
          typeof maybeTitledListValue === "string"
            ? maybeTitledListValue
            : maybeTitledListValue.value!
        )
      ),
    () => stringAndTextFaker(schemaType, (faker) => faker.lorem.sentence())
  );
};

const textFaker = <
  TSchemaType extends _SchemaTypeDefinition<"text", string, any>
>(
  schemaType: TSchemaType
) => stringAndTextFaker(schemaType, (faker) => faker.lorem.lines());

const urlFaker = <
  TSchemaType extends _SchemaTypeDefinition<"url", string, any>
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  const {
    allowRelative = false,
    // TODO allowCredentials = false,
    relativeOnly = false,
    // TODO scheme: schemaRaw = ["http", "https"],
  } = traversal.uri?.[0]?.[0] ?? {};

  // const schemes = Array.isArray(schemaRaw) ? schemaRaw : [schemaRaw];

  return (faker: Faker) => {
    const relative =
      relativeOnly || (allowRelative && faker.datatype.boolean());

    return (
      (relative ? "" : faker.internet.url({ appendSlash: false })) +
      faker.system.filePath()
    );
  };
};

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
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = (faker: Faker) => TSchemaType extends {
  of: (infer TMemberDefinition extends _ArrayMemberDefinition<
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
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers
): MembersFaker<TSchemaType, TAliasedFakers> => {
  const memberFakers = schemaType.of.map((member) =>
    addType(
      member.name,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      schemaTypeToFaker(member, getFakers)
    )
  );

  const memberFaker = (faker: Faker) =>
    faker.helpers.arrayElement(memberFakers)(faker) as ReturnType<
      (typeof memberFakers)[number]
    >;

  const traversal = traverseValidation(schemaType);

  // TODO Handle multiple length, somehow
  const length = traversal.length?.[0]?.[0] as number | undefined;

  const minChosen =
    length ??
    noInfinity(
      Math.max(
        ...(traversal.min ?? []).map(([minLength]) => minLength as number)
      )
    );
  const maxChosen =
    length ??
    noInfinity(
      Math.min(
        ...(traversal.max ?? []).map(([maxLength]) => maxLength as number)
      )
    );

  const min =
    minChosen ?? (maxChosen !== undefined ? Math.max(0, maxChosen - 4) : 1);
  const max = maxChosen ?? (minChosen !== undefined ? minChosen + 4 : 5);

  // @ts-expect-error -- FIXME
  return traversal.unique?.length
    ? (faker: Faker) =>
        faker.helpers
          .uniqueArray(
            () => stringify(memberFaker(faker)),
            faker.number.int({ min, max })
          )
          .map((value) => JSON.parse(value))
          .map((value) => addKey(() => value)(faker))
    : (faker: Faker) =>
        Array.from({ length: faker.number.int({ min, max }) }).map(() =>
          addKey(memberFaker)(faker)
        );
};

type ArrayFaker<
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = ReturnType<typeof membersFaker<TSchemaType, TAliasedFakers>>;

const arrayFaker = <
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers
): ArrayFaker<TSchemaType, TAliasedFakers> =>
  membersFaker(schemaType, getFakers) as ArrayFaker<
    TSchemaType,
    TAliasedFakers
  >;

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
        traverseValidation(field).required?.length
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

const documentFieldsFaker = (faker: Faker) => {
  const createdAt = faker.date.between({
    from: "1990-01-01T00:00:00.000Z",
    to: "2030-01-01T00:00:00.000Z",
  });

  return {
    _createdAt: createdAt.toISOString(),
    _id: faker.string.uuid(),
    _rev: faker.string.alphanumeric(22),
    _type: "document" as const,
    _updatedAt: faker.date
      .between({
        from: createdAt,
        to: "2030-01-01T00:00:00.000Z",
      })
      .toISOString(),
  };
};

type DocumentFaker<
  TSchemaType extends _SchemaTypeDefinition<"document", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = (
  faker: Faker
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof documentFieldsFaker>
>;

const documentFaker = <
  TSchemaType extends _SchemaTypeDefinition<"document", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers
): DocumentFaker<TSchemaType, TAliasedFakers> =>
  ((faker: Faker) => ({
    ...documentFieldsFaker(faker),
    ...fieldsFaker(schema, getFakers)(faker),
  })) as DocumentFaker<TSchemaType, TAliasedFakers>;

type SchemaTypeToFaker<
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: FakerOrFakerFn) => any;
  }
> = TSchemaType["type"] extends keyof typeof constantFakers
  ? (typeof constantFakers)[TSchemaType["type"]]
  : TSchemaType["type"] extends "date"
  ? ReturnType<
      typeof dateFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"date", any, any>>
      >
    >
  : TSchemaType["type"] extends "datetime"
  ? ReturnType<
      typeof datetimeFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"datetime", any, any>>
      >
    >
  : TSchemaType["type"] extends "number"
  ? ReturnType<
      typeof numberFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"number", any, any>>
      >
    >
  : TSchemaType["type"] extends "reference"
  ? ReturnType<
      typeof referenceFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"reference", any, any>>
      >
    >
  : TSchemaType["type"] extends "string"
  ? ReturnType<
      typeof stringFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"string", any, any>>
      >
    >
  : TSchemaType["type"] extends "text"
  ? ReturnType<
      typeof textFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"text", any, any>>
      >
    >
  : TSchemaType["type"] extends "url"
  ? ReturnType<
      typeof urlFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"url", any, any>>
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
  : TSchemaType["type"] extends "document"
  ? ReturnType<
      typeof documentFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"document", any, any>>,
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
    : schema.type === "date"
    ? dateFaker(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"date", any, any>>
      )
    : schema.type === "datetime"
    ? datetimeFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"datetime", any, any>
        >
      )
    : schema.type === "number"
    ? numberFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"number", number, any>
        >
      )
    : schema.type === "reference"
    ? referenceFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"reference", any, any>
        >
      )
    : schema.type === "string"
    ? stringFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"string", string, any>
        >
      )
    : schema.type === "text"
    ? textFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"text", string, any>
        >
      )
    : schema.type === "url"
    ? urlFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"url", string, any>
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
    : schema.type === "document"
    ? documentFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"document", any, any>
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
