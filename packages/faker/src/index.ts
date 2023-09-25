import type { Faker } from "@faker-js/faker";
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
import type { IsPlainObject, MaybeArray, Negate } from "@sanity-typed/utils";

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
    () => {
      const literals = (
        schemaType.options!.list! as MaybeTitledListValue<TOptionsHelper>[]
      ).map((maybeTitledListValue) =>
        typeof maybeTitledListValue === "number"
          ? maybeTitledListValue
          : maybeTitledListValue.value!
      );

      return (faker: Faker) => faker.helpers.arrayElement(literals);
    },
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
    schemaType: TSchemaType,
    referencedIdFaker: (
      type: string | undefined
    ) => (faker: Faker, index: number) => string
  ) =>
  (faker: Faker, count: number) => ({
    _ref: referencedIdFaker(
      faker.helpers.arrayElement(schemaType.to.map(({ type }) => type))
    )(faker, count),
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
    // TODO weak references and strengthenOnPublish
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

const regexFaker = (regex: RegExp) => {
  const randexp = new RandExp(regex);

  return (faker: Faker) => {
    // eslint-disable-next-line fp/no-mutation -- https://www.npmjs.com/package/randexp#custom-prng
    randexp.randInt = (min: number, max: number) =>
      faker.number.int({ min, max });

    return randexp.gen();
  };
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
    ? // TODO Combine multiple regex, somehow
      regexFaker(traversal.regex![0]![0])
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
    () => {
      const literals = (
        schemaType.options!.list! as MaybeTitledListValue<TOptionsHelper>[]
      ).map((maybeTitledListValue) =>
        typeof maybeTitledListValue === "string"
          ? maybeTitledListValue
          : maybeTitledListValue.value!
      );

      return (faker: Faker) => faker.helpers.arrayElement(literals);
    },
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
  <const Type extends string | undefined>(type: Type) =>
  <Fn extends (faker: Faker, count: number) => any>(fn: Fn) =>
  (faker: Faker, count: number) => {
    const value: ReturnType<Fn> = fn(faker, count);

    // TODO typedTernary
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
      ? typeof value
      : IsPlainObject<typeof value> extends false
      ? typeof value
      : Omit<typeof value, "_type"> & { _type: Type };
  };

const _addType = <
  const Type extends string | undefined,
  Fn extends (faker: Faker, count: number) => any
>(
  type: Type,
  fn: Fn
) => addType(type)(fn);

const addKey =
  <Fn extends (faker: Faker, count: number) => any>(fn: Fn) =>
  (faker: Faker, count: number) => {
    const value = fn(faker, count);

    // TODO typedTernary
    return (
      Array.isArray(value)
        ? value
        : // HACK
        typeof value !== "object"
        ? value
        : { ...value, _key: faker.database.mongodbObjectId() }
    ) as IsPlainObject<ReturnType<Fn>> extends false
      ? ReturnType<Fn>
      : Omit<ReturnType<Fn>, "_key"> & { _key: string };
  };

type MembersFaker<
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
> = (
  faker: Faker,
  count: number
) => TSchemaType extends {
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
                typeof _addType<
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
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): MembersFaker<TSchemaType, TAliasedFakers> => {
  type TMemberDefinition = TSchemaType extends {
    of: (infer TMemberDefinition)[];
  }
    ? TMemberDefinition
    : never;
  const memberFakers = schemaType.of.map((member: TMemberDefinition) =>
    addType(member.name)(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      schemaTypeToFaker(member, getFakers, documentIdFaker, referencedIdFaker)
    )
  );

  const memberFaker = (faker: Faker, count: number) =>
    faker.helpers.arrayElement(memberFakers)(faker, count);

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
    ? (faker: Faker, count: number) =>
        faker.helpers
          .uniqueArray(
            () => stringify(memberFaker(faker, count)),
            faker.number.int({ min, max })
          )
          .map((value) =>
            addKey(() => JSON.parse(value) as ReturnType<typeof memberFaker>)(
              faker,
              count
            )
          )
    : (faker: Faker, count: number) =>
        Array.from({ length: faker.number.int({ min, max }) }).map(() =>
          addKey(memberFaker)(faker, count)
        );
};

type ArrayFaker<
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
> = ReturnType<typeof membersFaker<TSchemaType, TAliasedFakers>>;

const arrayFaker = <
  TSchemaType extends _SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): ArrayFaker<TSchemaType, TAliasedFakers> =>
  membersFaker(
    schemaType,
    getFakers,
    documentIdFaker,
    referencedIdFaker
  ) as ArrayFaker<TSchemaType, TAliasedFakers>;

type FieldsFaker<
  TSchemaType extends _SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
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
  ? (
      faker: Faker,
      count: number
    ) => Simplify<
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
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  { fields = [] }: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): FieldsFaker<TSchemaType, TAliasedFakers> => {
  const fieldsFakers = (
    fields as _FieldDefinition<any, any, any, any, any, any, any, any, any>[]
  ).map(
    (field) =>
      [
        field.name as string,
        // TODO typedTernary
        traverseValidation(field).required?.length
          ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            schemaTypeToFaker(
              field,
              getFakers,
              documentIdFaker,
              referencedIdFaker
            )
          : (faker: Faker, count: number) =>
              faker.datatype.boolean()
                ? undefined
                : // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
                  schemaTypeToFaker(
                    field,
                    getFakers,
                    documentIdFaker,
                    referencedIdFaker
                  )(faker, count),
      ] as const
  );

  return ((faker: Faker, count: number) =>
    Object.fromEntries(
      fieldsFakers
        .map(([name, fieldFaker]) => [name, fieldFaker(faker, count)] as const)
        .filter(([, value]) => value !== undefined)
    )) as FieldsFaker<TSchemaType, TAliasedFakers>;
};

type ObjectFaker<
  TSchemaType extends _SchemaTypeDefinition<"object", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
> = ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>;

const objectFaker = <
  TSchemaType extends _SchemaTypeDefinition<"object", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): ObjectFaker<TSchemaType, TAliasedFakers> =>
  fieldsFaker(
    schema,
    getFakers,
    documentIdFaker,
    referencedIdFaker
  ) as ObjectFaker<TSchemaType, TAliasedFakers>;

const documentFieldsFaker = (
  faker: Faker,
  count: number,
  documentIdFaker: (faker: Faker, index: number) => string
) => {
  const createdAt = faker.date.between({
    from: "1990-01-01T00:00:00.000Z",
    to: "2030-01-01T00:00:00.000Z",
  });

  return {
    _createdAt: createdAt.toISOString(),
    _id: documentIdFaker(faker, count),
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
    [name: string]: (faker: Faker, count: number) => any;
  }
> = (
  faker: Faker,
  count: number
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof documentFieldsFaker>
>;

const documentFaker = <
  TSchemaType extends _SchemaTypeDefinition<"document", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): DocumentFaker<TSchemaType, TAliasedFakers> =>
  ((faker: Faker, count: number) => ({
    ...documentFieldsFaker(faker, count, documentIdFaker(schema.name)),
    ...fieldsFaker(
      schema,
      getFakers,
      documentIdFaker,
      referencedIdFaker
    )(faker, count),
  })) as DocumentFaker<TSchemaType, TAliasedFakers>;

const assetFaker = (faker: Faker) => ({
  _ref: faker.string.uuid(),
  _type: "reference",
  // TODO weak references and strengthenOnPublish
  ...(true ? {} : { _key: "key" }),
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

const fileFieldsFaker = (faker: Faker) => ({
  _type: "file" as const,
  asset: assetFaker(faker),
});

type FileFaker<
  TSchemaType extends _SchemaTypeDefinition<"file", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
> = (
  faker: Faker,
  count: number
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof fileFieldsFaker>
>;

const fileFaker = <
  TSchemaType extends _SchemaTypeDefinition<"file", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): FileFaker<TSchemaType, TAliasedFakers> =>
  ((faker: Faker, count: number) => ({
    ...fileFieldsFaker(faker),
    ...fieldsFaker(
      schema,
      getFakers,
      documentIdFaker,
      referencedIdFaker
    )(faker, count),
  })) as FileFaker<TSchemaType, TAliasedFakers>;

const imageFieldsFaker = (faker: Faker) => ({
  _type: "image" as const,
  asset: assetFaker(faker),
});

const imageHotspotFaker = (faker: Faker) => ({
  crop: {
    ...(true ? {} : { _type: "sanity.imageCrop" as const }),
    bottom: faker.number.float({ min: 0, max: 0.5 }),
    left: faker.number.float({ min: 0, max: 0.5 }),
    right: faker.number.float({ min: 0, max: 0.5 }),
    top: faker.number.float({ min: 0, max: 0.5 }),
  },
  hotspot: {
    ...(true ? {} : { _type: "sanity.imageHotspot" as const }),
    height: faker.number.float({ min: 0, max: 0.5 }),
    width: faker.number.float({ min: 0, max: 0.5 }),
    x: faker.number.float({ min: 0, max: 0.5 }),
    y: faker.number.float({ min: 0, max: 0.5 }),
  },
});

type ImageFaker<
  TSchemaType extends _SchemaTypeDefinition<"image", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
> = (
  faker: Faker,
  count: number
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof imageFieldsFaker> &
    (TSchemaType extends _SchemaTypeDefinition<"image", infer THotspot, any>
      ? THotspot extends true
        ? ReturnType<typeof imageHotspotFaker>
        : unknown
      : unknown)
>;

const imageFaker = <
  TSchemaType extends _SchemaTypeDefinition<"image", any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
): ImageFaker<TSchemaType, TAliasedFakers> =>
  ((faker: Faker, count: number) => ({
    ...imageFieldsFaker(faker),
    ...typedTernary(
      !schema.options?.hotspot as Negate<
        TSchemaType extends _SchemaTypeDefinition<"image", infer THotspot, any>
          ? THotspot
          : never
      >,
      () => ({}),
      () => imageHotspotFaker(faker)
    ),
    ...fieldsFaker(
      schema,
      getFakers,
      documentIdFaker,
      referencedIdFaker
    )(faker, count),
  })) as unknown as ImageFaker<TSchemaType, TAliasedFakers>;

type SchemaTypeToFaker<
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
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
  : TSchemaType["type"] extends "file"
  ? ReturnType<
      typeof fileFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"file", any, any>>,
        TAliasedFakers
      >
    >
  : TSchemaType["type"] extends "image"
  ? ReturnType<
      typeof imageFaker<
        Extract<TSchemaType, _SchemaTypeDefinition<"image", any, any>>,
        TAliasedFakers
      >
    >
  : never;

const schemaTypeToFaker = <
  TSchemaType extends _SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (faker: Faker, count: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
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
        >,
        referencedIdFaker
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
        getFakers,
        documentIdFaker,
        referencedIdFaker
      )
    : schema.type === "object"
    ? objectFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"object", any, any>
        >,
        getFakers,
        documentIdFaker,
        referencedIdFaker
      )
    : schema.type === "document"
    ? documentFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"document", any, any>
        >,
        getFakers,
        documentIdFaker,
        referencedIdFaker
      )
    : schema.type === "file"
    ? fileFaker(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"file", any, any>>,
        getFakers,
        documentIdFaker,
        referencedIdFaker
      )
    : schema.type === "image"
    ? imageFaker(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"image", any, any>
        >,
        getFakers,
        documentIdFaker,
        referencedIdFaker
      )
    : (undefined as never)) as SchemaTypeToFaker<TSchemaType, TAliasedFakers>;

const sanityConfigToFakerInner = <const TConfig extends _ConfigBase<any, any>>(
  {
    schema: { types: typesUntyped = [] } = {},
    plugins: pluginsUntyped = [],
  }: TConfig,
  documentIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string,
  referencedIdFaker: (
    type: string | undefined
  ) => (faker: Faker, index: number) => string
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

  type SanityConfigFakers<TConfig extends MaybeArray<_ConfigBase<any, any>>> =
    TConfig extends MaybeArray<
      _ConfigBase<infer TTypeDefinition, infer TPluginOptions>
    >
      ? {
          [Name in TTypeDefinition["name"]]: ReturnType<
            typeof _addType<
              Name,
              SchemaTypeToFaker<
                Extract<TTypeDefinition, { name: Name }>,
                SanityConfigFakers<TConfig> & SanityConfigFakers<TPluginOptions>
              >
            >
          >;
        }
      : never;

  const pluginsFakers = plugins
    .map((plugin) =>
      sanityConfigToFakerInner(plugin, documentIdFaker, referencedIdFaker)
    )
    .reduce(
      (acc, fakers) => ({ ...acc, ...fakers }),
      {} as SanityConfigFakers<TPluginOptions>
    );

  const fakers: SanityConfigFakers<TConfig> = Array.isArray(types)
    ? Object.fromEntries(
        types.map((type) => {
          const schemaTypeFaker = schemaTypeToFaker(
            type,
            () => ({
              ...pluginsFakers,
              ...fakers,
            }),
            documentIdFaker,
            referencedIdFaker
          );

          return [
            type.name,
            addType(type.name as TTypeDefinition["name"])(schemaTypeFaker),
          ];
        })
      )
    : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
      (undefined as never);

  return fakers;
};

const lazyFaker =
  <MaybeFaker extends Faker | undefined>(maybeFaker: MaybeFaker) =>
  <Fn extends (faker: Faker) => any>(fn: Fn) =>
    typedTernary(
      !maybeFaker as undefined extends MaybeFaker ? true : false,
      () => fn,
      () => (faker?: Faker) => fn(faker ?? maybeFaker!) as ReturnType<Fn>
    );

const _lazyFaker = <
  MaybeFaker extends Faker | undefined,
  Fn extends (faker: Faker) => any
>(
  maybeFaker: MaybeFaker,
  fn: Fn
) => lazyFaker(maybeFaker)(fn);

const counter = <Fn extends (faker: Faker, count: number) => any>(fn: Fn) => {
  // eslint-disable-next-line fp/no-let -- Mutable
  let count = -1;

  // eslint-disable-next-line no-return-assign -- Mutable
  return (faker: Faker) =>
    fn(
      faker,
      // eslint-disable-next-line fp/no-mutation -- Mutable
      (count += 1)
    ) as ReturnType<Fn>;
};

export const sanityConfigToFaker = <
  const TConfig extends _ConfigBase<any, any>,
  const MaybeFaker extends Faker | undefined
>(
  config: TConfig,
  {
    faker,
    referencedChunkSize = 5,
  }: { faker?: MaybeFaker; referencedChunkSize?: number } = {}
) => {
  const documentIdMemos: { [type: string]: { [index: number]: string } } = {};
  const documentIdFaker = (type: string | undefined) =>
    !type
      ? (faker: Faker) => faker.string.uuid()
      : (faker: Faker, index: number) => {
          if (!documentIdMemos[type]?.[index]) {
            // eslint-disable-next-line fp/no-mutation -- Mutable
            documentIdMemos[type] = {
              ...documentIdMemos[type],
              [index]: faker.string.uuid(),
            };
          }

          return documentIdMemos[type]![index]!;
        };
  const referencedIdFaker =
    (type: string | undefined) => (faker: Faker, index: number) =>
      documentIdFaker(type)(
        faker,
        faker.number.int({
          min: index - (index % referencedChunkSize),
          max: index - (index % referencedChunkSize) + referencedChunkSize - 1,
        })
      );

  const fakersInner = sanityConfigToFakerInner(
    config,
    documentIdFaker,
    referencedIdFaker
  );

  return Object.fromEntries(
    Object.entries(fakersInner).map(
      ([name, typeFaker]) =>
        [name, flow(counter, lazyFaker(faker))(typeFaker)] as const
    )
  ) as {
    [type in keyof typeof fakersInner]: ReturnType<
      typeof _lazyFaker<
        MaybeFaker,
        ReturnType<typeof counter<(typeof fakersInner)[type]>>
      >
    >;
  };
};
