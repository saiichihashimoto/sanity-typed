import { flow, identity, pick } from "lodash/fp";
import type {
  CustomValidator,
  CustomValidatorResult,
  LocaleSource,
  Schema,
} from "sanity";
import type { IsNumericLiteral, IsStringLiteral } from "type-fest";
import { z } from "zod";

import { decorator } from "@portabletext-typed/types/src/internal";
import { traverseValidation } from "@sanity-typed/traverse-validation";
import type {
  BlockListDefinition,
  BlockStyleDefinition,
  InferSchemaValues,
} from "@sanity-typed/types";
import { defineType, referenced } from "@sanity-typed/types";
import type {
  ArrayMemberDefinition,
  ConfigBase,
  DefinitionBase,
  DocumentValues,
  FieldDefinition,
  MaybeTitledListValue,
  TypeDefinition,
} from "@sanity-typed/types/src/internal";
import { reduceAcc, ternary, values } from "@sanity-typed/utils";
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

const zodUnion = <Zods extends z.ZodTypeAny[]>(types: Zods) =>
  types.length === 1
    ? (types[0] as Zods[number])
    : z.union(
        types as unknown as [Zods[number], Zods[number], ...Zods[number][]]
      );

// TODO https://github.com/sanity-io/sanity/issues/4922
const emailRegex =
  /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;

const constantZods = {
  boolean: z.boolean(),
  crossDatasetReference: z.object({
    _dataset: z.string(),
    _projectId: z.string(),
    _ref: z.string(),
    _type: z.literal("crossDatasetReference"),
    _weak: z.optional(z.boolean()),
  }),
  email: z.string().regex(emailRegex, { message: "Invalid email" }),
  geopoint: z.object({
    _type: z.literal("geopoint"),
    alt: z.optional(z.number()),
    lat: z.number(),
    lng: z.number(),
  }),
  slug: z.object({
    _type: z.literal("slug"),
    current: z.string(),
  }),
};

const toZodType = <Output, Input>(
  zod: z.ZodType<Output, z.ZodTypeDef, Input>
) => zod as z.ZodType<Output, z.ZodTypeDef, Input>;

const dateZod = <
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
  const traversal = traverseValidation(schemaType);

  return flow(
    identity<z.ZodString>,
    (zod) => zod.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date" }),
    toZodType,
    reduceAcc(traversal.min, (zod, [minDate]) =>
      typeof minDate !== "string"
        ? zod
        : zod.refine((value) => new Date(value) >= new Date(minDate), {
            message: `Date must be greater than or equal to ${minDate}`,
          })
    ),
    reduceAcc(traversal.max, (zod, [maxDate]) =>
      typeof maxDate !== "string"
        ? zod
        : zod.refine((value) => new Date(value) <= new Date(maxDate), {
            message: `Date must be less than or equal to ${maxDate}`,
          })
    )
  )(z.string());
};

const datetimeZod = <
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
) => {
  const traversal = traverseValidation(schemaType);

  return flow(
    identity<z.ZodString>,
    (zod) => zod.datetime(),
    toZodType,
    reduceAcc(traversal.min, (zod, [minDate]) =>
      typeof minDate !== "string"
        ? zod
        : zod.refine((value) => new Date(value) >= new Date(minDate), {
            message: `Datetime must be greater than or equal to ${minDate}`,
          })
    ),
    reduceAcc(traversal.max, (zod, [maxDate]) =>
      typeof maxDate !== "string"
        ? zod
        : zod.refine((value) => new Date(value) <= new Date(maxDate), {
            message: `Datetime must be less than or equal to ${maxDate}`,
          })
    )
  )(z.string());
};

const numberZod = <
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
    () =>
      zodUnion(
        (schemaType.options!.list! as MaybeTitledListValue<TNumberValue>[]).map(
          (maybeTitledListValue) =>
            z.literal(
              typeof maybeTitledListValue === "number"
                ? maybeTitledListValue
                : (
                    maybeTitledListValue as Exclude<
                      typeof maybeTitledListValue,
                      TNumberValue
                    >
                  ).value!
            )
        )
      ),
    () =>
      flow(
        flow(
          identity<z.ZodNumber>,
          reduceAcc(traversal.min, (zod, [minNumber]) =>
            typeof minNumber !== "number" ? zod : zod.min(minNumber)
          ),
          reduceAcc(traversal.max, (zod, [maxNumber]) =>
            typeof maxNumber !== "number" ? zod : zod.max(maxNumber)
          ),
          reduceAcc(traversal.lessThan, (zod, [limit]) =>
            typeof limit !== "number" ? zod : zod.lt(limit)
          ),
          reduceAcc(traversal.greaterThan, (zod, [limit]) =>
            typeof limit !== "number" ? zod : zod.gt(limit)
          ),
          (zod) => (!traversal.integer ? zod : zod.int()),
          reduceAcc(traversal.precision, (zod, [limit]) =>
            typeof limit !== "number" ? zod : zod.multipleOf(1 / 10 ** limit)
          )
        ),
        (zod) => (!traversal.positive ? zod : zod.nonnegative()),
        (zod) => (!traversal.negative ? zod : zod.negative())
      )(z.number())
  );
};

const referenceZod = <
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
  schemaType: TSchemaType
) =>
  z.object({
    [referenced]:
      z.custom<
        TSchemaType extends SchemaTypeDefinition<
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
          : never
      >(),
    _ref: z.string(),
    _type: z.literal("reference"),
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
        _weak: z.optional(z.literal(true)),
        _strengthenOnPublish: z.optional(
          z.object({
            type: z.string(),
            weak: z.optional(z.boolean()),
            template: z.optional(
              z.object({
                id: z.string(),
                params: z.record(
                  z.union([z.string(), z.number(), z.boolean()])
                ),
              })
            ),
          })
        ),
      }),
      () => ({})
    ),
    // ...(!schemaType.weak ? {} : referenceWeakFields),
  });

const stringAndTextZod = <
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
  schemaType: TSchemaType
) => {
  const traversal = traverseValidation(schemaType);

  return flow(
    flow(
      identity<z.ZodString>,
      reduceAcc(traversal.min, (zod, [minLength]) =>
        typeof minLength !== "number" ? zod : zod.min(minLength)
      ),
      reduceAcc(traversal.max, (zod, [maxLength]) =>
        typeof maxLength !== "number" ? zod : zod.max(maxLength)
      ),
      reduceAcc(traversal.length, (zod, [exactLength]) =>
        typeof exactLength !== "number" ? zod : zod.length(exactLength)
      ),
      (zod) =>
        !traversal.email
          ? zod
          : zod.regex(emailRegex, { message: "Invalid email" }),
      reduceAcc(
        traversal.regex,
        (zod, [pattern, nameOrOptions, optionsMaybe]) => {
          const [name = pattern.toString(), invert = false] = optionsMaybe
            ? [nameOrOptions as string, optionsMaybe.invert]
            : !nameOrOptions
            ? []
            : typeof nameOrOptions === "string"
            ? [nameOrOptions]
            : [nameOrOptions.name, nameOrOptions.invert];

          return invert
            ? // Hack zod.regex can't invert the pattern, so we do a refine
              zod
            : zod.regex(pattern, { message: `Does not match ${name}-pattern` });
        }
      ),
      toZodType
    ),
    (zod) =>
      !traversal.uppercase
        ? zod
        : zod.refine((value) => value === value.toLocaleUpperCase(), {
            message: "Must be all uppercase letters",
          }),
    (zod) =>
      !traversal.lowercase
        ? zod
        : zod.refine((value) => value === value.toLocaleLowerCase(), {
            message: "Must be all lowercase letters",
          }),
    reduceAcc(
      traversal.regex,
      (zod, [pattern, nameOrOptions, optionsMaybe]) => {
        const [name = pattern.toString(), invert = false] = optionsMaybe
          ? [nameOrOptions as string, optionsMaybe.invert]
          : !nameOrOptions
          ? []
          : typeof nameOrOptions === "string"
          ? [nameOrOptions]
          : [nameOrOptions.name, nameOrOptions.invert];

        return !invert
          ? // Hack zod.regex can't invert the pattern, so we do a refine
            zod
          : zod.refine((value) => !pattern.test(value), {
              message: `Should not match ${name}-pattern`,
            });
      }
    )
  )(z.string());
};

const stringZod = <
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
    () =>
      zodUnion(
        (schemaType.options!.list! as MaybeTitledListValue<TStringValue>[]).map(
          (maybeTitledListValue) =>
            z.literal(
              typeof maybeTitledListValue === "string"
                ? maybeTitledListValue
                : (
                    maybeTitledListValue as Exclude<
                      typeof maybeTitledListValue,
                      TStringValue
                    >
                  ).value!
            )
        )
      ),
    () => stringAndTextZod(schemaType)
  );
};

const textZod = <
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
) => stringAndTextZod(schemaType);

const DUMMY_ORIGIN = "http://sanity";

const urlZod = <
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

  type UriType = NonNullable<typeof traversal.uri>;

  return flow(
    identity<z.ZodType<string>>,
    reduceAcc(
      traversal.uri ?? ([[{}]] as UriType),
      (
        zod: z.ZodType<string>,
        [
          {
            allowRelative: allowRelativeRaw = false,
            allowCredentials = false,
            relativeOnly = false,
            scheme: schemaRaw = ["http", "https"],
          },
        ]
      ) => {
        const allowRelative = allowRelativeRaw || relativeOnly;
        const schemes = Array.isArray(schemaRaw) ? schemaRaw : [schemaRaw];

        // https://github.com/sanity-io/sanity/blob/6020a46588ffd324e233b45eaf526a58652c62f2/packages/sanity/src/core/validation/validators/stringValidator.ts#L37
        return zod.superRefine((value, ctx) => {
          /* eslint-disable fp/no-unused-expression -- zod.superRefine */

          let url: URL;
          try {
            url = allowRelative ? new URL(value, DUMMY_ORIGIN) : new URL(value);
          } catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Not a valid URL",
            });

            return z.NEVER;
          }

          if (relativeOnly && url.origin !== DUMMY_ORIGIN) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Only relative URLs are allowed",
            });
          }

          if (!allowCredentials && (url.username || url.password)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Username/password not allowed",
            });
          }

          const urlScheme = url.protocol.replace(/:$/, "");
          if (
            !schemes.some((scheme) =>
              typeof scheme === "string"
                ? urlScheme.startsWith(scheme)
                : scheme.test(urlScheme)
            )
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Does not match allowed protocols/schemes",
            });
          }

          return z.NEVER;

          /* eslint-enable fp/no-unused-expression */
        });
      }
    )
  )(z.string());
};

const zodEnabled: unique symbol = Symbol("zodEnabled");

export const enableZod = <T>(customValidator: CustomValidator<T>) => {
  // eslint-disable-next-line @typescript-eslint/promise-function-async -- Could be not a promise
  const clonedValidator = ((...args: Parameters<CustomValidator<T>>) =>
    customValidator(...args)) as CustomValidator<T> & { [zodEnabled]: true };

  clonedValidator[zodEnabled] = true;

  return clonedValidator;
};

const customValidationZod = <T>(
  customTraversals: [CustomValidator<T | undefined>][] | undefined
) =>
  reduceAcc(customTraversals, (zod: z.ZodType<T>, [customValidator]) =>
    !(zodEnabled in customValidator)
      ? zod
      : zod.superRefine(
          // eslint-disable-next-line @typescript-eslint/promise-function-async -- Could be not a promise
          (value, ctx) => {
            const validation = customValidator(value, {
              getClient: () => {
                throw new Error("zod can't provide getClient");
              },
              getDocumentExists: () => {
                throw new Error("zod can't provide getDocumentExists");
              },
              environment: "studio",
              // TODO ctx.i18n
              i18n: {} as LocaleSource,
              // TODO ctx.schema
              schema: {} as Schema,
              // TODO ctx.document
              // TODO ctx.parent
              // TODO ctx.path
              // TODO ctx.type
            });

            const handleResult = (result: CustomValidatorResult) =>
              Array.isArray(result)
                ? result.forEach(handleResult)
                : result === true
                ? undefined
                : ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    ...(typeof result === "string"
                      ? { message: result }
                      : { message: result.message, paths: result.paths }),
                  });

            return validation instanceof Promise
              ? // eslint-disable-next-line promise/prefer-await-to-then -- Could be not a promise
                validation.then(handleResult)
              : handleResult(validation);
          }
        )
  );

type ExtendViaIntersection<
  Zod extends z.ZodTypeAny,
  Shape extends z.ZodRawShape
> = Zod extends z.ZodObject<infer T, infer UnknownKeys, infer CatchAll>
  ? z.ZodObject<
      // TODO Should be able to get this from ZodObject<...>['extend']<...> somehow
      Shape &
        (keyof T extends Exclude<keyof T, keyof Shape>
          ? T
          : Omit<T, keyof Shape>),
      UnknownKeys,
      CatchAll,
      z.objectOutputType<Shape, CatchAll, UnknownKeys> &
        (keyof z.output<Zod> extends Exclude<keyof z.output<Zod>, keyof Shape>
          ? z.output<Zod>
          : Omit<z.output<Zod>, keyof Shape>),
      z.objectInputType<Shape, CatchAll, UnknownKeys> &
        (keyof z.input<Zod> extends Exclude<keyof z.input<Zod>, keyof Shape>
          ? z.input<Zod>
          : Omit<z.input<Zod>, keyof Shape>)
    >
  : Zod extends z.ZodLazy<infer TZod extends z.ZodTypeAny>
  ? z.ZodLazy<ExtendViaIntersection<TZod, Shape>>
  : Zod;

const extendViaIntersection =
  <Shape extends z.ZodRawShape>(shape: Shape) =>
  <Zod extends z.ZodTypeAny>(zod: Zod): ExtendViaIntersection<Zod, Shape> =>
    (zod instanceof z.ZodObject
      ? zod.extend(shape)
      : zod instanceof z.ZodLazy
      ? z.lazy(() =>
          extendViaIntersection(shape)(
            zod.schema as Zod extends z.ZodLazy<infer TZod extends z.ZodTypeAny>
              ? TZod
              : never
          )
        )
      : zod) as ExtendViaIntersection<Zod, Shape>;

const addTypeFieldsZods = <Type extends string>(type: Type) => ({
  _type: z.literal(type),
});

type AddType<
  Type extends string | undefined,
  Zod extends z.ZodTypeAny
> = IsStringLiteral<Type> extends false
  ? Zod
  : ExtendViaIntersection<
      Zod,
      ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>
    >;

const addType = <
  const Type extends string | undefined,
  Zod extends z.ZodTypeAny
>(
  type: Type,
  zod: Zod
): AddType<Type, Zod> =>
  (typeof type !== "string"
    ? zod
    : extendViaIntersection(addTypeFieldsZods(type))(zod)) as AddType<
    Type,
    Zod
  >;

const addTypeFp =
  <const Type extends string | undefined>(type: Type) =>
  <Zod extends z.ZodTypeAny>(zod: Zod) =>
    (typeof type !== "string"
      ? zod
      : extendViaIntersection(addTypeFieldsZods(type))(zod)) as AddType<
      Type,
      Zod
    >;

const addKeyFieldsZods = {
  _key: z.string(),
};

const addKey = extendViaIntersection(addKeyFieldsZods);

type AddKey<Zod extends z.ZodTypeAny> = ExtendViaIntersection<
  Zod,
  typeof addKeyFieldsZods
>;

type MembersZods<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = TMemberDefinitions extends (infer TMemberDefinition extends ArrayMemberDefinition<
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
      : AddKey<
          AddType<
            TMemberDefinition["name"],
            // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            SchemaTypeToZod<TMemberDefinition, TAliasedZods>
          >
        >)[]
  : never;

const membersZods = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  members: TMemberDefinitions,
  getZods: () => TAliasedZods
): MembersZods<TMemberDefinitions, TAliasedZods> =>
  members.map((member: TMemberDefinitions[number]) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    const zod = schemaTypeToZod(member, getZods);

    return flow(
      identity<typeof zod>,
      addTypeFp(member.name),
      addKey,
      customValidationZod(
        // TODO
        traverseValidation(member).custom as unknown as [
          CustomValidator<unknown>
        ][]
      )
    )(zod);
  }) as MembersZods<TMemberDefinitions, TAliasedZods>;

// HACK Copy and eslint-ed from https://github.com/sanity-io/sanity/blob/bf50a77131bc7dd9d3084acf39afcfb29512b566/packages/sanity/src/core/validation/util/sanityDeepEquals.ts#L11
const sanityDeepEquals = (a: unknown, b: unknown): boolean =>
  a === b ||
  (Array.isArray(a) && Array.isArray(b)
    ? a.length === b.length &&
      a.every((element, i) => sanityDeepEquals(element, b[i]))
    : !Array.isArray(a) &&
      !Array.isArray(b) &&
      !!a &&
      !!b &&
      typeof a === "object" &&
      typeof b === "object" &&
      Object.keys(a).length === Object.keys(b).length &&
      (a instanceof Date && b instanceof Date
        ? a.getTime() === b.getTime()
        : !(a instanceof Date) &&
          !(b instanceof Date) &&
          (a instanceof RegExp && b instanceof RegExp
            ? a.toString() === b.toString()
            : !(a instanceof RegExp) &&
              !(b instanceof RegExp) &&
              Object.keys(a).every(
                (key) =>
                  key === "_key" || Object.prototype.hasOwnProperty.call(b, key)
              ) &&
              Object.keys(a).every(
                (key) =>
                  key === "_key" ||
                  sanityDeepEquals(
                    a[key as keyof typeof a],
                    b[key as keyof typeof b]
                  )
              ))));

type MaybeZodEffects<T extends z.ZodTypeAny> = T | z.ZodEffects<T>;

type ArrayZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
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
  ? MaybeZodEffects<
      z.ZodArray<
        ReturnType<
          typeof zodUnion<MembersZods<TMemberDefinitions, TAliasedZods>>
        >
      >
    >
  : never;

const arrayZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schemaType: TSchemaType,
  getZods: () => TAliasedZods
): ArrayZod<TSchemaType, TAliasedZods> => {
  type TMemberDefinitions = TSchemaType extends {
    of: infer TMemberDefinitionsInner;
  }
    ? TMemberDefinitionsInner
    : never;

  const arrayZodInner = z.array(
    zodUnion(membersZods(schemaType.of as TMemberDefinitions, getZods))
  );

  const traversal = traverseValidation(schemaType);

  return flow(
    identity<typeof arrayZodInner>,
    reduceAcc(traversal.min, (zod, [minLength]) =>
      typeof minLength !== "number" ? zod : zod.min(minLength)
    ),
    reduceAcc(traversal.max, (zod, [maxLength]) =>
      typeof maxLength !== "number" ? zod : zod.max(maxLength)
    ),
    reduceAcc(traversal.length, (zod, [exactLength]) =>
      typeof exactLength !== "number" ? zod : zod.length(exactLength)
    ),
    toZodType,
    (zod) =>
      !traversal.unique
        ? zod
        : zod.refine(
            (array) =>
              array.every((value1, index) =>
                array
                  .slice(index + 1)
                  .every((value2) => !sanityDeepEquals(value1, value2))
              ),
            { message: "Can't contain duplicates" }
          )
  )(arrayZodInner) as ArrayZod<TSchemaType, TAliasedZods>;
};

const spanZod = <
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
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Just for inference
  schemaType: TSchemaType
) =>
  z.object({
    [decorator]:
      z.custom<
        TSchemaType extends SchemaTypeDefinition<
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
          : never
      >(),
    _key: z.string(),
    _type: z.literal("span"),
    marks: z.array(z.string()),
    text: z.string(),
  });

const blockFieldsZods = <
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

  return {
    _type: z.literal("block"),
    level: z.optional(z.number()),
    listItem: ternary(
      !lists?.length as Negate<IsStringLiteral<TBlockListItem>>,
      () => z.optional(z.union([z.literal("bullet"), z.literal("number")])),
      () =>
        z.optional(
          zodUnion(
            (lists! as BlockListDefinition<TBlockListItem>[]).map(({ value }) =>
              z.literal(value)
            )
          )
        )
    ),
    style: ternary(
      !styles?.length as Negate<IsStringLiteral<TBlockStyle>>,
      () =>
        z.union([
          z.literal("blockquote"),
          z.literal("h1"),
          z.literal("h2"),
          z.literal("h3"),
          z.literal("h4"),
          z.literal("h5"),
          z.literal("h6"),
          z.literal("normal"),
        ]),
      () =>
        zodUnion(
          (styles! as BlockStyleDefinition<TBlockStyle>[]).map(({ value }) =>
            z.literal(value)
          )
        )
    ),
  };
};

type BlockZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = z.ZodObject<
  ReturnType<typeof blockFieldsZods<TSchemaType>> & {
    children: z.ZodArray<
      | ReturnType<typeof spanZod<TSchemaType>>
      | (TSchemaType extends {
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
          ? MembersZods<TMemberDefinitions, TAliasedZods>[number]
          : never)
    >;
    markDefs: z.ZodArray<
      TSchemaType extends {
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
        ? MembersZods<TBlockMarkAnnotations, TAliasedZods>[number]
        : never
    >;
  }
>;

const blockZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schemaType: TSchemaType,
  getZods: () => TAliasedZods
): BlockZod<TSchemaType, TAliasedZods> =>
  z.object({
    ...blockFieldsZods<TSchemaType>(schemaType),
    children: z.array(
      !schemaType.of
        ? spanZod(schemaType)
        : zodUnion([
            spanZod(schemaType),
            ...membersZods(
              schemaType.of as ArrayMemberDefinition<
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
              getZods
            ),
          ])
    ),
    markDefs: z.array(
      !schemaType.marks?.annotations
        ? z.never()
        : zodUnion(
            membersZods(
              schemaType.marks.annotations as ArrayMemberDefinition<
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
              getZods
            )
          )
    ),
  }) as BlockZod<TSchemaType, TAliasedZods>;

type FieldsZods<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
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
  ? {
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
      >["name"]]: z.ZodOptional<
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        SchemaTypeToZod<Extract<TFieldDefinition, { name: Name }>, TAliasedZods>
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
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      >["name"]]: SchemaTypeToZod<
        Extract<TFieldDefinition, { name: Name }>,
        TAliasedZods
      >;
    }
  : never;

const fieldsZods = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  { fields = [] }: TSchemaType,
  getZods: () => TAliasedZods
) =>
  Object.fromEntries(
    (
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
      const traversal = traverseValidation(field);
      const fieldZod = customValidationZod(
        // TODO
        traversal.custom as [CustomValidator<unknown>][]
      )(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        schemaTypeToZod(field, getZods)
      );

      return [
        field.name,
        traversal.required ? fieldZod : z.optional(fieldZod),
      ] as const;
    })
  ) as FieldsZods<TSchemaType, TAliasedZods>;

type ObjectZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = z.ZodObject<FieldsZods<TSchemaType, TAliasedZods>>;

const objectZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schema: TSchemaType,
  getZods: () => TAliasedZods
): ObjectZod<TSchemaType, TAliasedZods> =>
  z.object(fieldsZods(schema, getZods)) as ObjectZod<TSchemaType, TAliasedZods>;

const documentFieldsZods = {
  _createdAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal("document"),
  _updatedAt: z.string(),
};

type DocumentZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = z.ZodObject<
  FieldsZods<TSchemaType, TAliasedZods> & typeof documentFieldsZods
>;

const documentZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schema: TSchemaType,
  getZods: () => TAliasedZods
): DocumentZod<TSchemaType, TAliasedZods> =>
  z.object({
    ...fieldsZods(schema, getZods),
    ...documentFieldsZods,
  }) as DocumentZod<TSchemaType, TAliasedZods>;

const fileFieldsZods = {
  _type: z.literal("file"),
  asset: referenceZod(
    defineType({
      name: "sanity.fileAsset",
      type: "reference",
      to: [{ type: "sanity.fileAsset" as const }],
    })
  ),
};

type FileZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = z.ZodObject<FieldsZods<TSchemaType, TAliasedZods> & typeof fileFieldsZods>;

const fileZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schema: TSchemaType,
  getZods: () => TAliasedZods
): FileZod<TSchemaType, TAliasedZods> =>
  z.object({
    ...fieldsZods(schema, getZods),
    ...fileFieldsZods,
  }) as FileZod<TSchemaType, TAliasedZods>;

const imageFieldsZods = {
  _type: z.literal("image"),
  asset: referenceZod(
    defineType({
      name: "sanity.imageAsset",
      type: "reference",
      to: [{ type: "sanity.imageAsset" as const }],
    })
  ),
};

const imageHotspotFieldsZods = {
  crop: z.object({
    _type: z.optional(z.literal("sanity.imageCrop")),
    bottom: z.number(),
    left: z.number(),
    right: z.number(),
    top: z.number(),
  }),
  hotspot: z.object({
    _type: z.optional(z.literal("sanity.imageHotspot")),
    height: z.number(),
    width: z.number(),
    x: z.number(),
    y: z.number(),
  }),
};

type ImageZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = z.ZodObject<
  FieldsZods<TSchemaType, TAliasedZods> &
    typeof imageFieldsZods &
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
        ? typeof imageHotspotFieldsZods
        : unknown
      : unknown)
>;

const imageZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schema: TSchemaType,
  getZods: () => TAliasedZods
): ImageZod<TSchemaType, TAliasedZods> =>
  z.object({
    ...fieldsZods(schema, getZods),
    ...imageFieldsZods,
    ...(!schema.options?.hotspot ? {} : imageHotspotFieldsZods),
  }) as ImageZod<TSchemaType, TAliasedZods>;

type AliasZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = z.ZodLazy<
  TSchemaType["type"] extends keyof TAliasedZods
    ? TAliasedZods[TSchemaType["type"]]
    : z.ZodUnknown
>;

const aliasZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  { type }: TSchemaType,
  getZods: () => TAliasedZods
): AliasZod<TSchemaType, TAliasedZods> =>
  z.lazy(() => getZods()[type] ?? z.unknown()) as AliasZod<
    TSchemaType,
    TAliasedZods
  >;

type SchemaTypeToZod<
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
> = TSchemaType["type"] extends keyof typeof constantZods
  ? (typeof constantZods)[TSchemaType["type"]]
  : TSchemaType["type"] extends "date"
  ? ReturnType<
      typeof dateZod<
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
      typeof datetimeZod<
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
      typeof numberZod<
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
      typeof referenceZod<
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
      typeof stringZod<
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
      typeof textZod<
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
      typeof urlZod<
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
      typeof arrayZod<
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
        TAliasedZods
      >
    >
  : TSchemaType["type"] extends "block"
  ? ReturnType<
      typeof blockZod<
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
        TAliasedZods
      >
    >
  : TSchemaType["type"] extends "object"
  ? ReturnType<
      typeof objectZod<
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
        TAliasedZods
      >
    >
  : TSchemaType["type"] extends "document"
  ? ReturnType<
      typeof documentZod<
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
        TAliasedZods
      >
    >
  : TSchemaType["type"] extends "file"
  ? ReturnType<
      typeof fileZod<
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
        TAliasedZods
      >
    >
  : TSchemaType["type"] extends "image"
  ? ReturnType<
      typeof imageZod<
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
        TAliasedZods
      >
    >
  : ReturnType<typeof aliasZod<TSchemaType, TAliasedZods>>;

const schemaTypeToZod = <
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
  TAliasedZods extends { [name: string]: z.ZodTypeAny }
>(
  schema: TSchemaType,
  getZods: () => TAliasedZods
): SchemaTypeToZod<TSchemaType, TAliasedZods> =>
  (schema.type in constantZods
    ? constantZods[
        schema.type as TSchemaType["type"] & keyof typeof constantZods
      ]
    : schema.type === "date"
    ? dateZod(
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
    ? datetimeZod(
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
    ? numberZod(
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
    ? referenceZod(
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
        >
      )
    : schema.type === "string"
    ? stringZod(
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
    ? textZod(
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
    ? urlZod(
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
    ? arrayZod(
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
        getZods
      )
    : schema.type === "block"
    ? blockZod(
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
        getZods
      )
    : schema.type === "object"
    ? objectZod(
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
        getZods
      )
    : schema.type === "document"
    ? documentZod(
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
        getZods
      )
    : schema.type === "file"
    ? fileZod(
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
        getZods
      )
    : schema.type === "image"
    ? imageZod(
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
        getZods
      )
    : aliasZod(schema, getZods)) as SchemaTypeToZod<TSchemaType, TAliasedZods>;

const assetZod = z.object({
  assetId: z.string(),
  creditLine: z.optional(z.string()),
  description: z.optional(z.string()),
  extension: z.string(),
  label: z.optional(z.string()),
  mimeType: z.string(),
  originalFilename: z.optional(z.string()),
  path: z.string(),
  sha1hash: z.string(),
  size: z.number(),
  title: z.optional(z.string()),
  url: z.string().url(),
  source: z.optional(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.optional(z.string().url()),
    })
  ),
});

const fileAssetZod = assetZod.extend({
  ...documentFieldsZods,
  _type: z.literal("sanity.fileAsset"),
  metadata: z.record(z.unknown()),
});

const imageSwatchZod = z.object({
  _type: z.literal("sanity.imagePaletteSwatch"),
  background: z.string(),
  foreground: z.string(),
  population: z.number(),
  title: z.optional(z.string()),
});

const imageAssetZod = assetZod.extend({
  ...documentFieldsZods,
  _type: z.literal("sanity.imageAsset"),
  metadata: z
    .object({
      _type: z.literal("sanity.imageMetadata"),
      blurHash: z.optional(z.string()),
      hasAlpha: z.boolean(),
      isOpaque: z.boolean(),
      location: z.optional(constantZods.geopoint),
      lqip: z.optional(z.string()),
      dimensions: z.object({
        _type: z.literal("sanity.imageDimensions"),
        aspectRatio: z.number(),
        height: z.number(),
        width: z.number(),
      }),
      exif: z.optional(
        z.object({ _type: z.literal("sanity.imageExifMetadata") }).passthrough()
      ),
      palette: z.optional(
        z.object({
          _type: z.literal("sanity.imagePalette"),
          darkMuted: z.optional(imageSwatchZod),
          darkVibrant: z.optional(imageSwatchZod),
          dominant: z.optional(imageSwatchZod),
          lightMuted: z.optional(imageSwatchZod),
          lightVibrant: z.optional(imageSwatchZod),
          muted: z.optional(imageSwatchZod),
          vibrant: z.optional(imageSwatchZod),
        })
      ),
    })
    .passthrough(),
});

const implicitDocumentZods = {
  "sanity.fileAsset": fileAssetZod,
  "sanity.imageAsset": imageAssetZod,
};

type SanityConfigZods<TConfig extends MaybeArray<ConfigBase<any, any>>> =
  TConfig extends MaybeArray<
    ConfigBase<infer TTypeDefinition, infer TPluginOptions>
  >
    ? typeof implicitDocumentZods & {
        [Name in TTypeDefinition["name"]]: AddType<
          Name,
          SchemaTypeToZod<
            Extract<TTypeDefinition, { name: Name }>,
            SanityConfigZods<TConfig> & SanityConfigZods<TPluginOptions>
          >
        >;
      }
    : never;

export const sanityConfigToZodsTyped = <
  const TConfig extends ConfigBase<any, any>
>({
  schema: { types: typesUntyped = [] } = {},
  plugins: pluginsUntyped = [],
}: TConfig) => {
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

  const pluginsZods = plugins
    .map((plugin) => sanityConfigToZodsTyped(plugin))
    .reduce(
      (acc, zods) => ({ ...acc, ...zods }),
      implicitDocumentZods as SanityConfigZods<TPluginOptions>
    );

  const zods: SanityConfigZods<TConfig> = Array.isArray(types)
    ? {
        ...implicitDocumentZods,
        ...Object.fromEntries(
          types.map((type) => [
            type.name,
            customValidationZod(traverseValidation(type).custom)(
              addType(
                type.name,
                schemaTypeToZod(type, () => ({ ...pluginsZods, ...zods }))
              )
            ),
          ])
        ),
      }
    : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
      (undefined as never);

  return zods;
};

export const sanityConfigToZods = <const TConfig extends ConfigBase<any, any>>(
  config: TConfig
) =>
  sanityConfigToZodsTyped(config) as {
    [TType in keyof InferSchemaValues<TConfig>]: z.ZodType<
      InferSchemaValues<TConfig>[TType]
    >;
  };

export const sanityDocumentsZod = <
  const TConfig extends ConfigBase<any, any>,
  Zods extends { [type: string]: z.ZodType<any> }
>(
  config: TConfig,
  zods: Zods
) => {
  type TTypeDefinition = TConfig extends ConfigBase<
    infer TTypeDefinition extends TypeDefinition<
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
    >,
    any
  >
    ? TTypeDefinition
    : never;

  const types = (config.schema?.types ?? []) as NonNullable<
    NonNullable<ConfigBase<TTypeDefinition, any>["schema"]>["types"]
  >;

  const documentTypes: (DocumentValues<InferSchemaValues<TConfig>>["_type"] &
    keyof Zods)[] = Array.isArray(types)
    ? [
        "sanity.fileAsset",
        "sanity.imageAsset",
        ...types
          .filter(({ type }) => type === "document")
          .map(({ name }) => name),
      ]
    : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
      (undefined as never);

  return zodUnion(flow(identity<Zods>, pick(documentTypes), values)(zods));
};
