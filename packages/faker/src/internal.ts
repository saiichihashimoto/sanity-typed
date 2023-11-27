import { Faker } from "@faker-js/faker";
import stringify from "fast-json-stable-stringify";
import { flow, identity } from "lodash/fp";
import RandExp from "randexp";
import type { IsNumericLiteral, IsStringLiteral, Simplify } from "type-fest";

import { traverseValidation } from "@sanity-typed/traverse-validation";
import type { InferSchemaValues } from "@sanity-typed/types";
import type {
  ArrayMemberDefinition,
  ConfigBase,
  FieldDefinition,
  MaybeTitledListValue,
  TypeDefinition,
  referenced,
} from "@sanity-typed/types/src/internal";
import { typedTernary } from "@sanity-typed/utils";
import type { IsPlainObject, MaybeArray, Negate } from "@sanity-typed/utils";

type SchemaTypeDefinition<
  TType extends string,
  TOptionsHelper,
  TReferenced extends string
> =
  | ArrayMemberDefinition<
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
  | FieldDefinition<
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
  | TypeDefinition<TType, any, any, any, TOptionsHelper, TReferenced, any, any>;

const constantFakers = {
  boolean: (faker: Faker) => faker.datatype.boolean(),
  crossDatasetReference: (faker: Faker) => ({
    _dataset: "dataset",
    _projectId: "projectId",
    _ref: faker.string.uuid(),
    _type: "crossDatasetReference" as const,
    ...(true ? {} : { _weak: false }),
  }),
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

const dateAndDatetimeFaker = <
  TSchemaType extends SchemaTypeDefinition<"date" | "datetime", string, any>
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  return (faker: Faker) =>
    faker.date
      .between({
        from: new Date(
          Math.max(
            ...(traversal.min ?? [["2015-01-01T00:00:00.000Z"]]).map(
              ([minDate]) => new Date(minDate as string).valueOf()
            )
          )
        ),
        to: new Date(
          Math.min(
            ...(traversal.max ?? [["2023-01-01T00:00:00.000Z"]]).map(
              ([maxDate]) => new Date(maxDate as string).valueOf()
            )
          )
        ),
      })
      .toISOString();
};

const dateFaker = <
  TSchemaType extends SchemaTypeDefinition<"date", string, any>
>(
  schemaType: TSchemaType
) => {
  const baseFaker = dateAndDatetimeFaker(schemaType);

  return (faker: Faker) => baseFaker(faker).slice(0, 10);
};

const datetimeFaker = <
  TSchemaType extends SchemaTypeDefinition<"datetime", string, any>
>(
  schemaType: TSchemaType
) => dateAndDatetimeFaker(schemaType);

const numberFaker = <
  TSchemaType extends SchemaTypeDefinition<"number", number, any>
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  const epsilon = traversal.integer ? 1 : Number.EPSILON;

  const min = Math.max(
    Number.MIN_SAFE_INTEGER,
    ...(traversal.min ?? []).map(([minNumber]) => minNumber as number),
    ...(traversal.greaterThan ?? []).map(
      ([limit]) => (limit as number) - epsilon
    ),
    ...(!traversal.positive ? [] : [0])
  );
  const max = Math.min(
    Number.MAX_SAFE_INTEGER,
    ...(traversal.max ?? []).map(([maxNumber]) => maxNumber as number),
    ...(traversal.lessThan ?? []).map(([limit]) => (limit as number) - epsilon),
    ...(!traversal.negative?.length ? [] : [-epsilon])
  );
  type TOptionsHelper = TSchemaType extends SchemaTypeDefinition<
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
      traversal.integer
        ? (faker: Faker) =>
            faker.number.int({
              min,
              max,
            })
        : (faker: Faker) =>
            faker.number.float({
              min,
              max,
              precision: !traversal.precision
                ? undefined
                : // TODO Handle multiple precisions, somehow
                  10 ** -(traversal.precision[0]![0]! as number),
            })
  );
};

const referenceFaker =
  <TSchemaType extends SchemaTypeDefinition<"reference", any, any>>(
    schemaType: TSchemaType,
    referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
  ) =>
  (faker: Faker, index: number) => ({
    _ref: referencedIdFaker(
      faker.helpers.arrayElement(schemaType.to.map(({ type }) => type))
    )(faker, index),
    _type: "reference" as const,
    ...({} as {
      [referenced]: TSchemaType extends SchemaTypeDefinition<
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
  TSchemaType extends SchemaTypeDefinition<"string" | "text", string, any>
>(
  schemaType: TSchemaType,
  stringFaker: (faker: Faker) => string
) => {
  const traversal = traverseValidation(schemaType);

  // TODO Handle multiple length, somehow
  const length = traversal.length?.[0]?.[0] as number | undefined;

  const min =
    length ??
    Math.max(
      0,
      ...(traversal.min ?? []).map(([minNumber]) => minNumber as number)
    );
  const max =
    length ??
    Math.min(
      Number.MAX_SAFE_INTEGER,
      ...(traversal.max ?? []).map(([maxNumber]) => maxNumber as number)
    );

  return traversal.regex
    ? // TODO Combine multiple regex, somehow
      regexFaker(traversal.regex![0]![0])
    : traversal.email
    ? (faker: Faker) => faker.internet.email()
    : (faker: Faker) =>
        flow(
          (value: string) => value,
          (value) => (!traversal.uppercase ? value : value.toUpperCase()),
          (value) => (!traversal.lowercase ? value : value.toLowerCase())
        )(stringFaker(faker).slice(0, faker.number.int({ min, max })));
};

const stringFaker = <
  TSchemaType extends SchemaTypeDefinition<"string", string, any>
>(
  schemaType: TSchemaType
) => {
  type TOptionsHelper = TSchemaType extends SchemaTypeDefinition<
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
  TSchemaType extends SchemaTypeDefinition<"text", string, any>
>(
  schemaType: TSchemaType
) =>
  stringAndTextFaker(schemaType, (faker) =>
    faker.lorem.paragraphs({ min: 1, max: 5 })
  );

const urlFaker = <TSchemaType extends SchemaTypeDefinition<"url", string, any>>(
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

type FakerOptions = ConstructorParameters<typeof Faker>[0];

const instantiateFaker = (options: FakerOptions) => (path: string) => {
  const faker = new Faker(options);
  // eslint-disable-next-line fp/no-unused-expression -- Setting faker seed
  faker.seed(
    // https://stackoverflow.com/a/7616484
    [...path].reduce(
      (hash, chr) =>
        Math.trunc(
          // eslint-disable-next-line no-bitwise -- https://stackoverflow.com/a/7616484
          (hash << 5) - hash + chr.codePointAt(0)!
        ),
      0
    )
  );

  return <Fn extends (faker: Faker, index: number) => any>(fn: Fn) =>
    (index: number) =>
      fn(faker, index) as ReturnType<Fn>;
};

const instantiateFakerT = <Fn extends (faker: Faker, index: number) => any>(
  options: FakerOptions,
  path: string,
  fn: Fn
) => instantiateFaker(options)(path)(fn);

const addType =
  <const Type extends string | undefined>(type: Type) =>
  <Fn extends (...args: any[]) => any>(fn: Fn) =>
  (...args: Parameters<Fn>) => {
    const value: ReturnType<Fn> = fn(...args);

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

const addTypeT = <
  const Type extends string | undefined,
  Fn extends (...args: any[]) => any
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
  TMemberDefinitions extends ArrayMemberDefinition<
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
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => TMemberDefinitions extends (infer TMemberDefinition extends ArrayMemberDefinition<
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
              (
                faker: Faker,
                count: number
              ) => ReturnType<
                ReturnType<
                  typeof addTypeT<
                    TMemberDefinition["name"],
                    SchemaTypeToFaker<TMemberDefinition, TAliasedFakers>
                  >
                >
              >
            >
          >
        >)[]
  : never;

const membersFaker = <
  TMemberDefinitions extends ArrayMemberDefinition<
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
    [name: string]: (index: number) => any;
  }
>(
  members: TMemberDefinitions,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string,
  {
    min = 1,
    max = 5,
    unique = false,
  }: { max?: number; min?: number; unique?: boolean }
): MembersFaker<TMemberDefinitions, TAliasedFakers> => {
  const memberFakers = members.map((member) =>
    addType(member.name)(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      schemaTypeToFaker(
        member,
        getFakers,
        instantiateFakerByPath,
        documentIdFaker,
        referencedIdFaker
      )
    )
  );

  const memberFaker = (faker: Faker, index: number) =>
    faker.helpers.arrayElement(memberFakers)(index);

  // @ts-expect-error -- TODO Why is this typed incorrectly
  return unique
    ? (faker: Faker, index: number) =>
        faker.helpers
          .uniqueArray(
            () => stringify(memberFaker(faker, index)),
            faker.number.int({ min, max })
          )
          .map((value) =>
            addKey(() => JSON.parse(value) as ReturnType<typeof memberFaker>)(
              faker,
              index
            )
          )
    : (faker: Faker, index: number) =>
        faker.helpers.multiple(() => addKey(memberFaker)(faker, index), {
          count: { min, max },
        });
};

const noInfinity = (value: number) =>
  value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY
    ? undefined
    : value;

type ArrayFaker<
  TSchemaType extends SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = TSchemaType extends {
  of: infer TMemberDefinitions extends ArrayMemberDefinition<
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
  TSchemaType extends SchemaTypeDefinition<"array", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): ArrayFaker<TSchemaType, TAliasedFakers> => {
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

  return membersFaker(
    schemaType.of as TSchemaType extends {
      of: infer TMemberDefinitionsInner;
    }
      ? TMemberDefinitionsInner
      : never,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker,
    { min, max, unique: Boolean(traversal.unique) }
  ) as ArrayFaker<TSchemaType, TAliasedFakers>;
};

const spanFaker = (faker: Faker) => ({
  _key: faker.database.mongodbObjectId(),
  _type: "span" as const,
  text: faker.lorem.paragraph({ min: 1, max: 5 }),
  ...(true ? {} : { marks: ["string"] }),
});

const blockFieldsFaker = {
  _type: "block" as const,
  ...(true ? {} : { level: 0 }),
  ...(true ? {} : { listItem: "string" }),
  ...(true ? {} : { style: "normal" }),
  ...(true ? {} : { markDefs: [{ _key: "key", _type: "type" }] }),
};

type BlockFaker<
  TSchemaType extends SchemaTypeDefinition<"block", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => Simplify<
  typeof blockFieldsFaker & {
    children: (TSchemaType extends {
      of?: infer TMemberDefinitions extends ArrayMemberDefinition<
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
      ?
          | ReturnType<MembersFaker<TMemberDefinitions, TAliasedFakers>>[number]
          | ReturnType<typeof spanFaker>
      : ReturnType<typeof spanFaker>)[];
  }
>;

const blockFaker = <
  TSchemaType extends SchemaTypeDefinition<"block", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  { of }: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): BlockFaker<TSchemaType, TAliasedFakers> =>
  ((faker: Faker, index: number) => {
    type TMemberDefinitions = TSchemaType extends {
      of?: infer TMemberDefinitionsInner extends ArrayMemberDefinition<
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
      ? TMemberDefinitionsInner
      : never;
    const members = (of as TMemberDefinitions) ?? [];

    const length = faker.number.int({ min: 1, max: 5 });
    const numSpans = !members.length
      ? length
      : faker.number.int({ min: 0, max: length });

    return {
      ...blockFieldsFaker,
      children: faker.helpers.shuffle([
        ...Array.from({ length: numSpans }).map(() => spanFaker(faker)),
        ...(numSpans === length
          ? []
          : // TODO https://github.com/saiichihashimoto/sanity-typed/issues/479
            membersFaker(
              members,
              getFakers,
              instantiateFakerByPath,
              documentIdFaker,
              referencedIdFaker,
              { min: length - numSpans, max: length - numSpans }
            )(faker, index)),
      ]),
    };
  }) as BlockFaker<TSchemaType, TAliasedFakers>;

type FieldsFaker<
  TSchemaType extends SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = TSchemaType extends {
  fields?: (infer TFieldDefinition extends FieldDefinition<
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
      index: number
    ) => Simplify<
      {
        [Name in Extract<
          TFieldDefinition,
          FieldDefinition<any, any, any, any, any, any, any, any, false>
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
          FieldDefinition<any, any, any, any, any, any, any, any, true>
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
  TSchemaType extends SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  { fields = [] }: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): FieldsFaker<TSchemaType, TAliasedFakers> => {
  const fieldsFakers = (
    fields as FieldDefinition<any, any, any, any, any, any, any, any, any>[]
  ).map((field) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    const fieldFaker = schemaTypeToFaker(
      field,
      getFakers,
      instantiateFakerByPath,
      documentIdFaker,
      referencedIdFaker
    );

    return [
      field.name as string,
      // TODO typedTernary
      traverseValidation(field).required
        ? (faker: Faker, index: number) => fieldFaker(index)
        : (faker: Faker, index: number) =>
            faker.helpers.maybe(() => fieldFaker(index)),
    ] as const;
  });

  return ((faker: Faker, index: number) =>
    Object.fromEntries(
      fieldsFakers
        .map(([name, fieldFaker]) => [name, fieldFaker(faker, index)] as const)
        .filter(([, value]) => value !== undefined)
    )) as FieldsFaker<TSchemaType, TAliasedFakers>;
};

type ObjectFaker<
  TSchemaType extends SchemaTypeDefinition<"object", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>;

const objectFaker = <
  TSchemaType extends SchemaTypeDefinition<"object", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): ObjectFaker<TSchemaType, TAliasedFakers> =>
  fieldsFaker(
    schema,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker
  ) as ObjectFaker<TSchemaType, TAliasedFakers>;

const documentFieldsFaker =
  (documentIdFaker: (index: number) => string) =>
  (faker: Faker, index: number) => {
    const createdAt = faker.date.between({
      from: "2015-01-01T00:00:00.000Z",
      to: "2023-01-01T00:00:00.000Z",
    });

    return {
      _createdAt: createdAt.toISOString(),
      _id: documentIdFaker(index),
      _rev: faker.string.alphanumeric(22),
      _type: "document" as const,
      _updatedAt: faker.date
        .between({
          from: createdAt,
          to: "2023-01-01T00:00:00.000Z",
        })
        .toISOString(),
    };
  };

type DocumentFaker<
  TSchemaType extends SchemaTypeDefinition<"document", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => Simplify<
  ReturnType<ReturnType<typeof documentFieldsFaker>> &
    ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>>
>;

const documentFaker = <
  TSchemaType extends SchemaTypeDefinition<"document", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): DocumentFaker<TSchemaType, TAliasedFakers> => {
  const documentFieldsFakerInstantiated = documentFieldsFaker(
    documentIdFaker(schema.name)
  );
  const fieldsFakerInstantiated = fieldsFaker(
    schema,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker
  );

  return ((faker: Faker, index: number) => ({
    ...documentFieldsFakerInstantiated(faker, index),
    ...fieldsFakerInstantiated(faker, index),
  })) as DocumentFaker<TSchemaType, TAliasedFakers>;
};

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
  TSchemaType extends SchemaTypeDefinition<"file", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof fileFieldsFaker>
>;

const fileFaker = <
  TSchemaType extends SchemaTypeDefinition<"file", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): FileFaker<TSchemaType, TAliasedFakers> => {
  const fieldsFakerInstantiated = fieldsFaker(
    schema,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker
  );

  return ((faker: Faker, index: number) => ({
    ...fileFieldsFaker(faker),
    ...fieldsFakerInstantiated(faker, index),
  })) as FileFaker<TSchemaType, TAliasedFakers>;
};

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
  TSchemaType extends SchemaTypeDefinition<"image", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof imageFieldsFaker> &
    (TSchemaType extends SchemaTypeDefinition<"image", infer THotspot, any>
      ? THotspot extends true
        ? ReturnType<typeof imageHotspotFaker>
        : unknown
      : unknown)
>;

const imageFaker = <
  TSchemaType extends SchemaTypeDefinition<"image", any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): ImageFaker<TSchemaType, TAliasedFakers> => {
  const fieldsFakerInstantiated = fieldsFaker(
    schema,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker
  );

  return ((faker: Faker, index: number) => ({
    ...imageFieldsFaker(faker),
    ...typedTernary(
      !schema.options?.hotspot as Negate<
        TSchemaType extends SchemaTypeDefinition<"image", infer THotspot, any>
          ? THotspot
          : never
      >,
      () => ({}),
      () => imageHotspotFaker(faker)
    ),
    ...fieldsFakerInstantiated(faker, index),
  })) as unknown as ImageFaker<TSchemaType, TAliasedFakers>;
};

type AliasFaker<
  TSchemaType extends SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => TSchemaType["type"] extends keyof TAliasedFakers
  ? ReturnType<TAliasedFakers[TSchemaType["type"]]>
  : unknown;

const aliasFaker =
  <
    TSchemaType extends SchemaTypeDefinition<any, any, any>,
    TAliasedFakers extends {
      [name: string]: (index: number) => any;
    }
  >(
    { type }: TSchemaType,
    getFakers: () => TAliasedFakers
  ): AliasFaker<TSchemaType, TAliasedFakers> =>
  (faker: Faker, index: number) =>
    getFakers()[type]?.(index) ?? (undefined as unknown);

type SchemaTypeToFaker<
  TSchemaType extends SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = ReturnType<
  typeof instantiateFakerT<
    TSchemaType["type"] extends keyof typeof constantFakers
      ? (typeof constantFakers)[TSchemaType["type"]]
      : TSchemaType["type"] extends "date"
      ? ReturnType<
          typeof dateFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"date", any, any>>
          >
        >
      : TSchemaType["type"] extends "datetime"
      ? ReturnType<
          typeof datetimeFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"datetime", any, any>>
          >
        >
      : TSchemaType["type"] extends "number"
      ? ReturnType<
          typeof numberFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"number", any, any>>
          >
        >
      : TSchemaType["type"] extends "reference"
      ? ReturnType<
          typeof referenceFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"reference", any, any>>
          >
        >
      : TSchemaType["type"] extends "string"
      ? ReturnType<
          typeof stringFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"string", any, any>>
          >
        >
      : TSchemaType["type"] extends "text"
      ? ReturnType<
          typeof textFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"text", any, any>>
          >
        >
      : TSchemaType["type"] extends "url"
      ? ReturnType<
          typeof urlFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"url", any, any>>
          >
        >
      : TSchemaType["type"] extends "array"
      ? ReturnType<
          typeof arrayFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"array", any, any>>,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "block"
      ? ReturnType<
          typeof blockFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"block", any, any>>,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "object"
      ? ReturnType<
          typeof objectFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"object", any, any>>,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "document"
      ? ReturnType<
          typeof documentFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"document", any, any>>,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "file"
      ? ReturnType<
          typeof fileFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"file", any, any>>,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "image"
      ? ReturnType<
          typeof imageFaker<
            Extract<TSchemaType, SchemaTypeDefinition<"image", any, any>>,
            TAliasedFakers
          >
        >
      : ReturnType<typeof aliasFaker<TSchemaType, TAliasedFakers>>
  >
>;

const customFakerFn: unique symbol = Symbol("customFakerFn");

export const customFaker = <
  TSchemaType extends SchemaTypeDefinition<any, any, any>
>(
  schemaType: TSchemaType,
  fakerFn: (
    faker: Faker,
    previous: ReturnType<
      SchemaTypeToFaker<TSchemaType, { [name: string]: (index: number) => any }>
    >,
    index: number
  ) => ReturnType<
    SchemaTypeToFaker<TSchemaType, { [name: string]: (index: number) => any }>
  >
): TSchemaType => ({ ...schemaType, [customFakerFn]: fakerFn });

const schemaTypeToFaker = <
  TSchemaType extends SchemaTypeDefinition<any, any, any>,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schema: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): SchemaTypeToFaker<TSchemaType, TAliasedFakers> => {
  const prefixedInstantiateFakerByPath = (path: string) =>
    instantiateFakerByPath(`.${schema.name ?? `<${schema.type}>`}${path}`);

  const schemaTypeFaker =
    schema.type in constantFakers
      ? constantFakers[
          schema.type as TSchemaType["type"] & keyof typeof constantFakers
        ]
      : schema.type === "date"
      ? dateFaker(
          schema as Extract<TSchemaType, SchemaTypeDefinition<"date", any, any>>
        )
      : schema.type === "datetime"
      ? datetimeFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"datetime", any, any>
          >
        )
      : schema.type === "number"
      ? numberFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"number", number, any>
          >
        )
      : schema.type === "reference"
      ? referenceFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"reference", any, any>
          >,
          referencedIdFaker
        )
      : schema.type === "string"
      ? stringFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"string", string, any>
          >
        )
      : schema.type === "text"
      ? textFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"text", string, any>
          >
        )
      : schema.type === "url"
      ? urlFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"url", string, any>
          >
        )
      : schema.type === "array"
      ? arrayFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"array", any, any>
          >,
          getFakers,
          prefixedInstantiateFakerByPath,
          documentIdFaker,
          referencedIdFaker
        )
      : schema.type === "block"
      ? blockFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"block", any, any>
          >,
          getFakers,
          prefixedInstantiateFakerByPath,
          documentIdFaker,
          referencedIdFaker
        )
      : schema.type === "object"
      ? objectFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"object", any, any>
          >,
          getFakers,
          prefixedInstantiateFakerByPath,
          documentIdFaker,
          referencedIdFaker
        )
      : schema.type === "document"
      ? documentFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"document", any, any>
          >,
          getFakers,
          prefixedInstantiateFakerByPath,
          documentIdFaker,
          referencedIdFaker
        )
      : schema.type === "file"
      ? fileFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"file", any, any>
          >,
          getFakers,
          prefixedInstantiateFakerByPath,
          documentIdFaker,
          referencedIdFaker
        )
      : schema.type === "image"
      ? imageFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<"image", any, any>
          >,
          getFakers,
          prefixedInstantiateFakerByPath,
          documentIdFaker,
          referencedIdFaker
        )
      : aliasFaker(schema, getFakers);

  return flow(
    (schemaTypeFakerInner: typeof schemaTypeFaker) => schemaTypeFakerInner,
    customFakerFn in schema
      ? (schemaTypeFaker) => (faker: Faker, index: number) =>
          (
            schema[customFakerFn] as Parameters<
              typeof customFaker<TSchemaType>
            >[1]
          )(faker, schemaTypeFaker(faker, index), index)
      : identity,
    prefixedInstantiateFakerByPath("")
  )(schemaTypeFaker) as SchemaTypeToFaker<TSchemaType, TAliasedFakers>;
};

type SanityConfigFakers<TConfig extends MaybeArray<ConfigBase<any, any>>> =
  TConfig extends MaybeArray<
    ConfigBase<infer TTypeDefinition, infer TPluginOptions>
  >
    ? {
        [Name in TTypeDefinition["name"]]: ReturnType<
          typeof addTypeT<
            Name,
            SchemaTypeToFaker<
              Extract<TTypeDefinition, { name: Name }>,
              SanityConfigFakers<TConfig> & SanityConfigFakers<TPluginOptions>
            >
          >
        >;
      }
    : never;

const sanityConfigToFakerInner = <const TConfig extends ConfigBase<any, any>>(
  {
    schema: { types: typesUntyped = [] } = {},
    plugins: pluginsUntyped = [],
  }: TConfig,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
) => {
  type TTypeDefinition = TConfig extends ConfigBase<infer TTypeDefinition, any>
    ? TTypeDefinition
    : never;

  const types = typesUntyped as NonNullable<
    NonNullable<ConfigBase<TTypeDefinition, any>["schema"]>["types"]
  >;

  type TPluginOptions = TConfig extends ConfigBase<any, infer TPluginOptions>
    ? TPluginOptions
    : never;

  const plugins = pluginsUntyped as TPluginOptions[];

  const pluginsFakers = plugins
    .map((plugin) =>
      sanityConfigToFakerInner(
        plugin,
        instantiateFakerByPath,
        documentIdFaker,
        referencedIdFaker
      )
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
            instantiateFakerByPath,
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

const counter = <Fn extends (index: number) => any>(fn: Fn) => {
  // eslint-disable-next-line fp/no-let -- Mutable
  let count = -1;

  // eslint-disable-next-line no-return-assign -- Mutable
  return () =>
    fn(
      // eslint-disable-next-line fp/no-mutation -- Mutable
      (count += 1)
    ) as ReturnType<Fn>;
};

export const sanityConfigToFakerTyped = <
  const TConfig extends ConfigBase<any, any>
>(
  config: TConfig,
  {
    faker,
    referencedChunkSize = 5,
  }: { faker: FakerOptions; referencedChunkSize?: number }
) => {
  const documentIdMemos: { [type: string]: string[] } = {};

  const documentIdUndefined = instantiateFaker(faker)("<undefined>._id")(
    (faker) => faker.string.uuid()
  );
  const documentIdFakerMemos: { [type: string]: (index: number) => string } =
    {};
  const documentIdFaker = (type: string | undefined) => {
    if (!type) {
      return documentIdUndefined;
    }

    // eslint-disable-next-line fp/no-mutation -- Mutable
    documentIdFakerMemos[type] =
      documentIdFakerMemos[type] ??
      instantiateFaker(faker)(`.${type}._id`)((faker: Faker, index: number) => {
        // eslint-disable-next-line fp/no-loops -- Mutable
        while ((documentIdMemos[type]?.length ?? 0) <= index) {
          // eslint-disable-next-line fp/no-mutation -- Mutable
          documentIdMemos[type] = [
            ...(documentIdMemos[type] ?? []),
            faker.string.uuid(),
          ];
        }

        return documentIdMemos[type]![index]!;
      });

    return documentIdFakerMemos[type]!;
  };

  const referencedIdFaker = (type: string) => {
    const documentId = documentIdFaker(type);

    return (faker: Faker, index: number) =>
      documentId(
        faker.number.int({
          min: index - (index % referencedChunkSize),
          max: index - (index % referencedChunkSize) + referencedChunkSize - 1,
        })
      );
  };

  const fakersInner = sanityConfigToFakerInner(
    config,
    instantiateFaker(faker),
    documentIdFaker,
    referencedIdFaker
  );

  return Object.fromEntries(
    Object.entries(fakersInner).map(
      ([name, typeFaker]) => [name, counter(typeFaker)] as const
    )
  ) as {
    [type in keyof typeof fakersInner]: ReturnType<
      typeof counter<(typeof fakersInner)[type]>
    >;
  };
};

export const sanityConfigToFaker = <const TConfig extends ConfigBase<any, any>>(
  ...args: Parameters<typeof sanityConfigToFakerTyped<TConfig>>
) =>
  sanityConfigToFakerTyped(...args) as {
    [TType in keyof InferSchemaValues<TConfig>]: () => InferSchemaValues<TConfig>[TType];
  };
