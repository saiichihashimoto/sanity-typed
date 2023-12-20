import { Faker } from "@faker-js/faker";
import stringify from "fast-json-stable-stringify";
import { flow, identity } from "lodash/fp";
import RandExp from "randexp";
import type { IsNumericLiteral, IsStringLiteral, Simplify } from "type-fest";

import type { decorator } from "@portabletext-typed/types";
import { traverseValidation } from "@sanity-typed/traverse-validation";
import type {
  BlockDecoratorDefinition,
  BlockListDefinition,
  BlockStyleDefinition,
  InferSchemaValues,
} from "@sanity-typed/types";
import type {
  ArrayMemberDefinition,
  ConfigBase,
  DefinitionBase,
  FieldDefinition,
  MaybeTitledListValue,
  TypeDefinition,
  referenced,
} from "@sanity-typed/types/src/internal";
import { isPlainObject, ternary } from "@sanity-typed/utils";
import type { MaybeArray, Negate } from "@sanity-typed/utils";

type SchemaTypeDefinition<
  TType extends string,
  TNumberValue extends number,
  TStringValue extends string,
  TReferenced extends string,
  TReferenceWeak extends boolean,
  TBlockStyle extends string,
  TBlockListItem extends string,
  TBlockMarkDecorator extends string,
  TBlockMarkAnnotation extends DefinitionBase<any, any, any> & {
    name?: string;
  },
  THotspot extends boolean
> =
  | ArrayMemberDefinition<
      TType,
      any,
      any,
      any,
      TNumberValue,
      TStringValue,
      TReferenced,
      TReferenceWeak,
      TBlockStyle,
      TBlockListItem,
      TBlockMarkDecorator,
      TBlockMarkAnnotation,
      THotspot,
      any,
      any,
      any
    >
  | FieldDefinition<
      TType,
      any,
      any,
      any,
      TNumberValue,
      TStringValue,
      TReferenced,
      TReferenceWeak,
      TBlockStyle,
      TBlockListItem,
      TBlockMarkDecorator,
      TBlockMarkAnnotation,
      THotspot,
      any,
      any,
      any
    >
  | TypeDefinition<
      TType,
      any,
      any,
      any,
      TNumberValue,
      TStringValue,
      TReferenced,
      TReferenceWeak,
      TBlockStyle,
      TBlockListItem,
      TBlockMarkDecorator,
      TBlockMarkAnnotation,
      THotspot,
      any,
      any
    >;

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

const emptyArrayToUndefined = <T>(arr: T[] | undefined) =>
  !arr?.length ? undefined : arr;

const dateAndDatetimeFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "date" | "datetime",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  const from = new Date(
    Math.max(
      ...(
        emptyArrayToUndefined(
          traversal.min
            ?.map(([minDate]) => minDate)
            .filter((minDate): minDate is string => typeof minDate === "string")
        ) ?? ["2015-01-01T00:00:00.000Z"]
      ).map((minDate) => new Date(minDate).valueOf())
    )
  );

  const to = new Date(
    Math.min(
      ...(
        emptyArrayToUndefined(
          traversal.max
            ?.map(([maxDate]) => maxDate)
            .filter((maxDate): maxDate is string => typeof maxDate === "string")
        ) ?? ["2023-01-01T00:00:00.000Z"]
      ).map((maxDate) => new Date(maxDate).valueOf())
    )
  );

  return (faker: Faker) => faker.date.between({ from, to }).toISOString();
};

const dateFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "date",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) => {
  const baseFaker = dateAndDatetimeFaker(schemaType);

  return (faker: Faker) => baseFaker(faker).slice(0, 10);
};

const datetimeFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "datetime",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) => dateAndDatetimeFaker(schemaType);

const numberFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "number",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  const epsilon = traversal.integer ? 1 : Number.EPSILON;

  const min = Math.max(
    Number.MIN_SAFE_INTEGER,
    ...(traversal.min ?? [])
      .map(([minNumber]) => minNumber)
      .filter(
        (minNumber): minNumber is number => typeof minNumber === "number"
      ),
    ...(traversal.greaterThan ?? [])
      .map(([limit]) => limit)
      .filter((limit): limit is number => typeof limit === "number")
      .map((limit) => limit - epsilon),
    ...(!traversal.positive ? [] : [0])
  );
  const max = Math.min(
    Number.MAX_SAFE_INTEGER,
    ...(traversal.max ?? [])
      .map(([maxNumber]) => maxNumber)
      .filter(
        (maxNumber): maxNumber is number => typeof maxNumber === "number"
      ),
    ...(traversal.lessThan ?? [])
      .map(([limit]) => limit)
      .filter((limit): limit is number => typeof limit === "number")
      .map((limit) => limit - epsilon),
    ...(!traversal.negative?.length ? [] : [-epsilon])
  );

  // TODO https://github.com/saiichihashimoto/sanity-typed/issues/536
  const precision = traversal.precision
    ?.map(([limit]) => limit)
    .filter((limit): limit is number => typeof limit === "number")
    .map((limit) => limit)?.[0];

  type TNumberValue = TSchemaType extends SchemaTypeDefinition<
    "number",
    infer TNumberValue,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
    ? TNumberValue
    : never;

  return ternary(
    Boolean(schemaType.options?.list?.length) as IsNumericLiteral<TNumberValue>,
    () => {
      const literals = (
        schemaType.options!.list! as MaybeTitledListValue<TNumberValue>[]
      ).map((maybeTitledListValue) =>
        typeof maybeTitledListValue === "number"
          ? maybeTitledListValue
          : (
              maybeTitledListValue as Exclude<
                typeof maybeTitledListValue,
                TNumberValue
              >
            ).value!
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
              precision: precision === undefined ? undefined : 10 ** -precision,
            })
  );
};

const referenceFaker =
  <
    TSchemaType extends SchemaTypeDefinition<
      "reference",
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  >(
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
        any,
        infer TReferenced,
        any,
        any,
        any,
        any,
        any,
        any
      >
        ? TReferenced
        : never;
    }),
    ...ternary(
      schemaType.weak as true extends (
        TSchemaType extends SchemaTypeDefinition<
          "reference",
          any,
          any,
          any,
          infer TReferenceWeak,
          any,
          any,
          any,
          any,
          any
        >
          ? TReferenceWeak
          : never
      )
        ? true
        : false,
      () => ({
        ...(faker.datatype.boolean()
          ? {}
          : {
              _weak: true as const,
              ...(faker.datatype.boolean()
                ? {}
                : {
                    _strengthenOnPublish: {
                      type: "string",
                      ...(true ? {} : { weak: faker.datatype.boolean() }),
                      ...(true
                        ? {}
                        : {
                            template: {
                              id: "string",
                              params: {} as {
                                [key: string]: boolean | number | string;
                              },
                            },
                          }),
                    },
                  }),
            }),
      }),
      () => ({})
    ),
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
  TSchemaType extends SchemaTypeDefinition<
    "string" | "text",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType,
  stringFaker: (faker: Faker) => string
) => {
  const traversal = traverseValidation(schemaType);

  // TODO https://github.com/saiichihashimoto/sanity-typed/issues/536
  const length = traversal.length
    ?.map(([exactLength]) => exactLength)
    .find(
      (exactLength): exactLength is number => typeof exactLength === "number"
    );

  const min =
    length ??
    Math.max(
      0,
      ...(traversal.min ?? [])
        .map(([minLength]) => minLength)
        .filter(
          (minLength): minLength is number => typeof minLength === "number"
        )
    );
  const max =
    length ??
    Math.min(
      Number.MAX_SAFE_INTEGER,
      ...(traversal.max ?? [])
        .map(([minLength]) => minLength)
        .filter(
          (minLength): minLength is number => typeof minLength === "number"
        )
    );

  return traversal.regex
    ? // TODO https://github.com/saiichihashimoto/sanity-typed/issues/536
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
  TSchemaType extends SchemaTypeDefinition<
    "string",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) => {
  type TStringValue = TSchemaType extends SchemaTypeDefinition<
    "string",
    any,
    infer TStringValue,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
    ? TStringValue
    : never;

  return ternary(
    Boolean(schemaType.options?.list?.length) as IsStringLiteral<TStringValue>,
    () => {
      const literals = (
        schemaType.options!.list! as MaybeTitledListValue<TStringValue>[]
      ).map((maybeTitledListValue) =>
        typeof maybeTitledListValue === "string"
          ? maybeTitledListValue
          : (
              maybeTitledListValue as Exclude<
                typeof maybeTitledListValue,
                TStringValue
              >
            ).value!
      );

      return (faker: Faker) => faker.helpers.arrayElement(literals);
    },
    () => stringAndTextFaker(schemaType, (faker) => faker.lorem.sentence())
  );
};

const textFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "text",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) =>
  stringAndTextFaker(schemaType, (faker) =>
    faker.lorem.paragraphs({ min: 1, max: 5 })
  );

const urlFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "url",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  const {
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/539
    allowRelative = false,
    relativeOnly = false,
  } = traversal.uri?.[0]?.[0] ?? {};

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

const instantiateFaker =
  (options: FakerOptions, seed: number) => (path: string) => {
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
        seed
      )
    );

    return <Fn extends (faker: Faker, index: number) => any>(fn: Fn) =>
      (index: number) =>
        fn(faker, index) as ReturnType<Fn>;
  };

const instantiateFakerT = <Fn extends (faker: Faker, index: number) => any>(
  options: FakerOptions,
  seed: number,
  path: string,
  fn: Fn
) => instantiateFaker(options, seed)(path)(fn);

const addType =
  <const Type extends string | undefined>(type: Type) =>
  <Fn extends (...args: any[]) => any>(fn: Fn) =>
  (...args: Parameters<Fn>) => {
    const value: ReturnType<Fn> = fn(...args);

    return ternary(
      (typeof type !== "string") as Negate<IsStringLiteral<Type>>,
      () => value,
      () =>
        ternary(
          isPlainObject(value),
          () =>
            ({ ...value, _type: type } as Omit<typeof value, "_type"> & {
              _type: Type;
            }),
          () => value
        )
    );
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
    const value: ReturnType<Fn> = fn(faker, count);

    return ternary(
      isPlainObject(value),
      () =>
        ({ ...value, _key: faker.database.mongodbObjectId() } as Omit<
          ReturnType<Fn>,
          "_key"
        > & { _key: string }),
      () => value
    );
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
  index: number,
  options: { max?: number; min?: number }
) => TMemberDefinitions extends (infer TMemberDefinition extends ArrayMemberDefinition<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
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
  { unique = false }: { unique?: boolean } = {}
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
    ? (
        faker: Faker,
        index: number,
        { min = 1, max = 5 }: { max?: number; min?: number }
      ) =>
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
    : (
        faker: Faker,
        index: number,
        { min = 1, max = 5 }: { max?: number; min?: number }
      ) =>
        faker.helpers.multiple(() => addKey(memberFaker)(faker, index), {
          count: { min, max },
        });
};

const noInfinity = (value: number) =>
  value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY
    ? undefined
    : value;

type ArrayFaker<
  TSchemaType extends SchemaTypeDefinition<
    "array",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
  ? (
      faker: Faker,
      index: number
    ) => ReturnType<
      ReturnType<typeof membersFaker<TMemberDefinitions, TAliasedFakers>>
    >
  : never;

const arrayFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "array",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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

  // TODO https://github.com/saiichihashimoto/sanity-typed/issues/536
  const length = traversal.length
    ?.map(([exactLength]) => exactLength)
    .find(
      (exactLength): exactLength is number => typeof exactLength === "number"
    );

  const minChosen =
    length ??
    noInfinity(
      Math.max(
        ...(traversal.min ?? [])
          .map(([minLength]) => minLength)
          .filter(
            (minLength): minLength is number => typeof minLength === "number"
          )
      )
    );
  const maxChosen =
    length ??
    noInfinity(
      Math.min(
        ...(traversal.max ?? [])
          .map(([maxLength]) => maxLength)
          .filter(
            (maxLength): maxLength is number => typeof maxLength === "number"
          )
      )
    );

  const min =
    minChosen ?? (maxChosen !== undefined ? Math.max(0, maxChosen - 4) : 1);
  const max = maxChosen ?? (minChosen !== undefined ? minChosen + 4 : 5);

  type TMemberDefinitions = TSchemaType extends {
    of: infer TMemberDefinitionsInner;
  }
    ? TMemberDefinitionsInner
    : never;

  const members = membersFaker(
    schemaType.of as TMemberDefinitions,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker,
    { unique: Boolean(traversal.unique) }
  );

  return ((faker: Faker, index: number) =>
    members(faker, index, { min, max })) as unknown as ArrayFaker<
    TSchemaType,
    TAliasedFakers
  >;
};

const spanFaker =
  <
    TSchemaType extends SchemaTypeDefinition<
      "block",
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  >({
    marks: { decorators } = {},
  }: TSchemaType) =>
  (faker: Faker) => {
    type TBlockMarkDecorator = TSchemaType extends SchemaTypeDefinition<
      "block",
      any,
      any,
      any,
      any,
      any,
      any,
      infer TBlockMarkDecorator,
      any,
      any
    >
      ? TBlockMarkDecorator
      : never;

    return {
      ...({} as {
        [decorator]: TBlockMarkDecorator;
      }),
      _key: faker.database.mongodbObjectId(),
      _type: "span" as const,
      marks: faker.helpers
        .arrayElements(
          [
            // TODO https://github.com/saiichihashimoto/sanity-typed/issues/537
            () => faker.database.mongodbObjectId(),
            ...((
              decorators as
                | BlockDecoratorDefinition<TBlockMarkDecorator>[]
                | undefined
            )?.map(
              ({ value }) =>
                () =>
                  value
            ) ?? [
              () => "strong",
              () => "em",
              () => "code",
              () => "underline",
              // TODO https://github.com/sanity-io/sanity/issues/5344
              () => "strike",
              () => "strike-through",
            ]),
          ],
          { min: 0, max: 2 }
        )
        .map((fn) => fn()),
      text: faker.lorem.paragraph({ min: 1, max: 5 }),
    };
  };

const blockFieldsFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "block",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>({
  lists,
  styles,
}: TSchemaType) => {
  type TBlockStyle = TSchemaType extends SchemaTypeDefinition<
    "block",
    any,
    any,
    any,
    any,
    infer TBlockStyle,
    any,
    any,
    any,
    any
  >
    ? TBlockStyle
    : never;

  type TBlockListItem = TSchemaType extends SchemaTypeDefinition<
    "block",
    any,
    any,
    any,
    any,
    any,
    infer TBlockListItem,
    any,
    any,
    any
  >
    ? TBlockListItem
    : never;

  return (faker: Faker) => ({
    _type: "block" as const,
    ...(faker.datatype.boolean()
      ? {}
      : {
          // TODO https://github.com/saiichihashimoto/sanity-typed/issues/538
          level: 0,
          listItem: ternary(
            !lists?.length as Negate<IsStringLiteral<TBlockListItem>>,
            () => faker.helpers.arrayElement(["bullet", "number"] as const),
            () =>
              faker.helpers.arrayElement(
                (lists! as BlockListDefinition<TBlockListItem>[]).map(
                  ({ value }) => value
                )
              )
          ),
        }),
    style: ternary(
      !styles?.length as Negate<IsStringLiteral<TBlockStyle>>,
      () =>
        faker.helpers.arrayElement([
          "blockquote",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "normal",
        ] as const),
      () =>
        faker.helpers.arrayElement(
          (styles! as BlockStyleDefinition<TBlockStyle>[]).map(
            ({ value }) => value
          )
        )
    ),
  });
};

type BlockFaker<
  TSchemaType extends SchemaTypeDefinition<
    "block",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => Simplify<
  ReturnType<ReturnType<typeof blockFieldsFaker<TSchemaType>>> & {
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
          | ReturnType<ReturnType<typeof spanFaker<TSchemaType>>>
      : ReturnType<ReturnType<typeof spanFaker<TSchemaType>>>)[];
    markDefs: (TSchemaType extends {
      marks?: {
        annotations?: infer TBlockMarkAnnotations extends ArrayMemberDefinition<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
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
      };
    }
      ? ReturnType<MembersFaker<TBlockMarkAnnotations, TAliasedFakers>>[number]
      : never)[];
  }
>;

const blockFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "block",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
>(
  schemaType: TSchemaType,
  getFakers: () => TAliasedFakers,
  instantiateFakerByPath: ReturnType<typeof instantiateFaker>,
  documentIdFaker: (type: string | undefined) => (index: number) => string,
  referencedIdFaker: (type: string) => (faker: Faker, index: number) => string
): BlockFaker<TSchemaType, TAliasedFakers> => {
  const blockFields = blockFieldsFaker(schemaType);
  const span = spanFaker(schemaType);

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
  const of = (schemaType.of as TMemberDefinitions) ?? [];

  const members = membersFaker(
    of,
    getFakers,
    instantiateFakerByPath,
    documentIdFaker,
    referencedIdFaker
  );

  type TBlockMarkAnnotations = TSchemaType extends {
    marks?: {
      annotations?: infer TBlockMarkAnnotationsInner extends ArrayMemberDefinition<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
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
    };
  }
    ? TBlockMarkAnnotationsInner
    : never;
  const markDefs = !schemaType.marks?.annotations
    ? undefined
    : membersFaker(
        schemaType.marks.annotations as TBlockMarkAnnotations,
        getFakers,
        instantiateFakerByPath,
        documentIdFaker,
        referencedIdFaker
      );

  return ((faker: Faker, index: number) => {
    const length = faker.number.int({ min: 1, max: 5 });
    const numSpans = !of.length
      ? length
      : faker.number.int({ min: 0, max: length });

    return {
      ...blockFields(faker),
      children: faker.helpers.shuffle([
        ...Array.from({ length: numSpans }).map(() => span(faker)),
        ...(numSpans === length
          ? []
          : members(faker, index, {
              min: length - numSpans,
              max: length - numSpans,
            })),
      ]),
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/537
      markDefs: markDefs?.(faker, index, { min: 1, max: 5 }) ?? [],
    };
  }) as BlockFaker<TSchemaType, TAliasedFakers>;
};

type FieldsFaker<
  TSchemaType extends SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
          FieldDefinition<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            false
          >
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
          FieldDefinition<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            true
          >
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
    any,
    any,
    any,
    any,
    any,
    any,
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
    fields as FieldDefinition<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >[]
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
      // TODO ternary
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
  TSchemaType extends SchemaTypeDefinition<
    "object",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>;

const objectFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "object",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
  TSchemaType extends SchemaTypeDefinition<
    "document",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
  TSchemaType extends SchemaTypeDefinition<
    "document",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
  TSchemaType extends SchemaTypeDefinition<
    "file",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
  TSchemaType extends SchemaTypeDefinition<
    "file",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
  TSchemaType extends SchemaTypeDefinition<
    "image",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TAliasedFakers extends {
    [name: string]: (index: number) => any;
  }
> = (
  faker: Faker,
  index: number
) => Simplify<
  ReturnType<ReturnType<typeof fieldsFaker<TSchemaType, TAliasedFakers>>> &
    ReturnType<typeof imageFieldsFaker> &
    (TSchemaType extends SchemaTypeDefinition<
      "image",
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      infer THotspot extends boolean
    >
      ? THotspot extends true
        ? ReturnType<typeof imageHotspotFaker>
        : unknown
      : unknown)
>;

const imageFaker = <
  TSchemaType extends SchemaTypeDefinition<
    "image",
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
    ...ternary(
      !schema.options?.hotspot as Negate<
        TSchemaType extends SchemaTypeDefinition<
          "image",
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          infer THotspot extends boolean
        >
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
  TSchemaType extends SchemaTypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
    TSchemaType extends SchemaTypeDefinition<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >,
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
  TSchemaType extends SchemaTypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "date",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "datetime"
      ? ReturnType<
          typeof datetimeFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "datetime",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "number"
      ? ReturnType<
          typeof numberFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "number",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "reference"
      ? ReturnType<
          typeof referenceFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "reference",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "string"
      ? ReturnType<
          typeof stringFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "string",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "text"
      ? ReturnType<
          typeof textFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "text",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "url"
      ? ReturnType<
          typeof urlFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "url",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >
          >
        >
      : TSchemaType["type"] extends "array"
      ? ReturnType<
          typeof arrayFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "array",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "block"
      ? ReturnType<
          typeof blockFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "block",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "object"
      ? ReturnType<
          typeof objectFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "object",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "document"
      ? ReturnType<
          typeof documentFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "document",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "file"
      ? ReturnType<
          typeof fileFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "file",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >,
            TAliasedFakers
          >
        >
      : TSchemaType["type"] extends "image"
      ? ReturnType<
          typeof imageFaker<
            Extract<
              TSchemaType,
              SchemaTypeDefinition<
                "image",
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >
            >,
            TAliasedFakers
          >
        >
      : ReturnType<typeof aliasFaker<TSchemaType, TAliasedFakers>>
  >
>;

const customFakerFn: unique symbol = Symbol("customFakerFn");

export const customFaker = <
  TSchemaType extends SchemaTypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
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
  TSchemaType extends SchemaTypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
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
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "date",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >
        )
      : schema.type === "datetime"
      ? datetimeFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "datetime",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >
        )
      : schema.type === "number"
      ? numberFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "number",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >
        )
      : schema.type === "reference"
      ? referenceFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "reference",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >,
          referencedIdFaker
        )
      : schema.type === "string"
      ? stringFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "string",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >
        )
      : schema.type === "text"
      ? textFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "text",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >
        )
      : schema.type === "url"
      ? urlFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "url",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
          >
        )
      : schema.type === "array"
      ? arrayFaker(
          schema as Extract<
            TSchemaType,
            SchemaTypeDefinition<
              "array",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
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
            SchemaTypeDefinition<
              "block",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
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
            SchemaTypeDefinition<
              "object",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
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
            SchemaTypeDefinition<
              "document",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
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
            SchemaTypeDefinition<
              "file",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
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
            SchemaTypeDefinition<
              "image",
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any
            >
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
    seed = 0,
  }: { faker: FakerOptions; referencedChunkSize?: number; seed?: number }
) => {
  const documentIdMemos: { [type: string]: string[] } = {};

  const documentIdUndefined = instantiateFaker(faker, seed)("<undefined>._id")(
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
      instantiateFaker(faker, seed)(`.${type}._id`)(
        (faker: Faker, index: number) => {
          // eslint-disable-next-line fp/no-loops -- Mutable
          while ((documentIdMemos[type]?.length ?? 0) <= index) {
            // eslint-disable-next-line fp/no-mutation -- Mutable
            documentIdMemos[type] = [
              ...(documentIdMemos[type] ?? []),
              faker.string.uuid(),
            ];
          }

          return documentIdMemos[type]![index]!;
        }
      );

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
    instantiateFaker(faker, seed),
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
