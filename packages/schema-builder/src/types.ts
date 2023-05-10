import type { Faker } from "@faker-js/faker";
import type { InitialValueProperty, RuleDef, ValidationBuilder } from "sanity";
import type { Merge, SetOptional } from "type-fest";
import { z } from "zod";

export type TupleOfLength<
  T,
  Min extends number = number,
  Max extends number = number,
  Result extends T[] = []
> = Result["length"] extends Min
  ? number extends Max
    ? [...Result, ...T[]]
    : Result["length"] extends Max
    ? Result
    :
        | Result
        | TupleOfLength<
            T,
            [T, ...Result]["length"] & number,
            Max,
            [T, ...Result]
          >
  : TupleOfLength<T, Min, Max, [T, ...Result]>;

export const zodUnion = <Zods extends z.ZodTypeAny>(zods: Zods[]): Zods =>
  zods.length === 1
    ? zods[0]!
    : (z.union([zods[0]!, zods[1]!, ...zods.slice(2)]) as unknown as Zods);

const isZodObjectWithDiscriminator =
  (discriminator: string) => (zod: z.ZodTypeAny) =>
    zod instanceof z.ZodObject &&
    discriminator in zod.shape &&
    (zod.shape as z.ZodRawShape)[discriminator] instanceof z.ZodLiteral;

export const zodDiscriminatedUnionMaybe =
  (discriminator: string) =>
  <Zods extends z.ZodTypeAny>(zods: Zods[]): Zods =>
    zods.length === 1
      ? zods[0]!
      : zods.every(isZodObjectWithDiscriminator(discriminator))
      ? (z.discriminatedUnion(discriminator, [
          zods[0]! as unknown as z.ZodDiscriminatedUnionOption<string>,
          zods[1]! as unknown as z.ZodDiscriminatedUnionOption<string>,
          ...(zods.slice(
            2
          ) as unknown as z.ZodDiscriminatedUnionOption<string>[]),
        ]) as unknown as Zods)
      : (z.union([zods[0]!, zods[1]!, ...zods.slice(2)]) as unknown as Zods);

export type SanityType<Definition, Value, ParsedValue, ResolvedValue> = {
  mock: (faker: Faker, path?: string) => Value;
  parse: (data: unknown) => ParsedValue;
  resolve: (data: unknown) => ResolvedValue;
  schema: () => Definition;
  zod: z.ZodType<ParsedValue, any, Value>;
  zodResolved: z.ZodType<ResolvedValue, any, Value>;
};

export type InferValue<T extends SanityType<any, any, any, any>> =
  T extends SanityType<any, infer Value, any, any> ? Value : never;

export type InferParsedValue<T extends SanityType<any, any, any, any>> =
  T extends SanityType<any, any, infer ParsedValue, any> ? ParsedValue : never;

export type InferResolvedValue<T extends SanityType<any, any, any, any>> =
  T extends SanityType<any, any, any, infer ResolvedValue>
    ? ResolvedValue
    : never;

const createMocker = <MockType>(
  mockFn: (faker: Faker, path: string) => MockType
) => {
  const fakers: { [key: string]: Faker } = {};

  return (faker: Faker, path = ""): MockType => {
    // @ts-expect-error -- We need faker to not be bundled with the library while getting both the class to create new instances and faker.locales.
    const FakerClass: typeof Faker = faker.constructor;

    if (!(path in fakers)) {
      // eslint-disable-next-line fp/no-mutation -- Need to set fakers
      fakers[path] = new FakerClass({ locales: faker.locales });
      // eslint-disable-next-line fp/no-unused-expression -- seed is a mutation
      fakers[path]!.seed(
        [...path].reduce(
          // eslint-disable-next-line no-bitwise, unicorn/prefer-math-trunc, unicorn/prefer-code-point, id-length -- copied from somewhere
          (s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0,
          0
        )
      );
    }

    return mockFn(fakers[path]!, path);
  };
};

// TODO createType tests
export const createType = <Definition, Value, ParsedValue, ResolvedValue>({
  mock,
  zod,
  zodResolved = zod as unknown as z.ZodType<ResolvedValue, any, Value>,
  parse = zod.parse.bind(zod),
  resolve = zodResolved.parse.bind(zodResolved),
  ...def
}: Merge<
  SetOptional<
    SanityType<Definition, Value, ParsedValue, ResolvedValue>,
    "parse" | "resolve" | "zodResolved"
  >,
  {
    mock: (faker: Faker, path: string) => Value;
  }
>): SanityType<Definition, Value, ParsedValue, ResolvedValue> => ({
  ...def,
  mock: createMocker(mock),
  parse,
  resolve,
  zod,
  zodResolved,
});

export type GetRule<T> = T extends {
  validation?: ValidationBuilder<infer Rule, any>;
}
  ? Rule
  : never;

export type TypedValueRule<Value> = RuleDef<TypedValueRule<Value>, Value>;

export type TypedValues<
  Value,
  Rule extends RuleDef<Rule, any> = TypedValueRule<Value>
> = {
  initialValue?: InitialValueProperty<any, Value>;
  validation?: ValidationBuilder<Rule, Value>;
};

export type NamedSchemaFields = "description" | "name" | "title";

export type SanityNamedTypeDef<
  Definition,
  Value,
  ParsedValue,
  ResolvedValue,
  PreParsedValue = Value,
  PreResolvedValue = Value
> = Merge<
  Omit<Definition, "type">,
  {
    mock?: (faker: Faker, path: string) => Value;
    zod?: (
      zod: z.ZodType<PreParsedValue, any, Value>
    ) => z.ZodType<ParsedValue, any, Value>;
    zodResolved?: (
      zod: z.ZodType<PreResolvedValue, any, Value>
    ) => z.ZodType<ResolvedValue, any, Value>;
  }
>;

export type SanityTypeDef<
  Definition,
  Value,
  ParsedValue,
  ResolvedValue,
  PreParsedValue = Value,
  PreResolvedValue = Value
> = SanityNamedTypeDef<
  Omit<Definition, NamedSchemaFields>,
  Value,
  ParsedValue,
  ResolvedValue,
  PreParsedValue,
  PreResolvedValue
>;
