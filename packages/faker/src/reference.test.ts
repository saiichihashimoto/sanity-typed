import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { customFaker } from ".";
import { sanityConfigToFakerTyped } from "./internal";

describe.each(Array.from({ length: 5 }).map((_, seed) => [{ seed }]))(
  "reference %p",
  ({ seed }) => {
    describe("defineArrayMember", () => {
      it("mocks ReferenceValue", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "reference",
                    to: [{ type: "other" as const }],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("overwrites `_type` with `name`", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    name: "foo",
                    type: "reference",
                    to: [{ type: "other" as const }],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("adds weak fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "reference",
                    weak: true,
                    to: [{ type: "other" as const }],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });
    });

    describe("defineField", () => {
      it("mocks ReferenceValue", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "reference",
                    validation: (Rule) => Rule.required(),
                    to: [{ type: "other" as const }],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });

      it("adds weak fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "reference",
                    weak: true,
                    validation: (Rule) => Rule.required(),
                    to: [{ type: "other" as const }],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });
    });

    describe("defineType", () => {
      it("mocks ReferenceValue", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "reference",
                to: [{ type: "other" as const }],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("overwrites `_type` with defineArrayMember `name`", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "reference",
                to: [{ type: "other" as const }],
              }),
              defineType({
                name: "bar",
                type: "array",
                of: [
                  defineArrayMember({
                    name: "bar",
                    type: "foo",
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("adds weak fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "reference",
                weak: true,
                to: [{ type: "other" as const }],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });
    });

    describe("customMock", () => {
      it("overrides mock", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              customFaker(
                defineType({
                  name: "foo",
                  type: "reference",
                  to: [{ type: "other" as const }],
                }),
                (faker, previous) => ({
                  ...previous,
                  _ref: "foo",
                })
              ),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
        expect(fake).toHaveProperty("_ref", "foo");
      });
    });
  }
);
