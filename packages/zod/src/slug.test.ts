import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { sanityConfigToZods } from ".";

describe("slug", () => {
  describe("defineArrayMember", () => {
    it("builds parser for SlugValue", () => {
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
                  type: "slug",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            _key: "key",
            _type: "slug",
            current: "foo",
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          _type: "slug",
          current: "foo",
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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
                  type: "slug",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<
        z.infer<(typeof zods)["foo"]>[number]["_type"]
      >().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >();
      expect(
        zods.foo.parse([
          {
            _key: "key",
            _type: "foo",
            current: "foo",
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          _type: "foo",
          current: "foo",
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for SlugValue", () => {
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
                  type: "slug",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<
        Required<z.infer<(typeof zods)["foo"]>>["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          bar: {
            _type: "slug",
            current: "foo",
          },
        })
      ).toStrictEqual({
        bar: {
          _type: "slug",
          current: "foo",
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it.failing("builds parser for SlugValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "slug",
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        // @ts-expect-error -- FIXME
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          current: "foo",
        })
      ).toStrictEqual({
        _type: "foo",
        current: "foo",
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });

    it.failing("overwrites `_type` with defineArrayMember `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "slug",
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["bar"]>[number]["_type"]>()
        // @ts-expect-error -- FIXME
        .toStrictEqual<
          InferSchemaValues<typeof config>["bar"][number]["_type"]
        >();
      expect(
        zods.bar.parse([
          {
            _type: "bar",
            current: "foo",
          },
        ])
      ).toStrictEqual([
        {
          _type: "bar",
          current: "foo",
        },
      ]);
      expect(() => zods.bar.parse(true)).toThrow();
    });
  });
});
