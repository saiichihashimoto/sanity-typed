import { describe, expect, it } from "@jest/globals";
import type { Simplify } from "type-fest";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, ReferenceValue } from "@sanity-typed/types";

import { sanityConfigToZods } from ".";

const fields: Omit<ReferenceValue<"other">, symbol | "_type"> = { _ref: "foo" };

describe("reference", () => {
  describe("defineArrayMember", () => {
    it("builds parser for ReferenceValue", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _key: "key",
            _type: "reference",
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "reference",
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
                  type: "reference",
                  to: [{ type: "other" as const }],
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
            ...fields,
            _key: "key",
            _type: "foo",
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "foo",
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for ReferenceValue", () => {
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
                  to: [{ type: "other" as const }],
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
          _type: "foo",
          bar: {
            ...fields,
            _type: "reference",
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          ...fields,
          _type: "reference",
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for ReferenceValue", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["bar"]>[number]["_type"]>()
        // @ts-expect-error -- FIXME
        .toStrictEqual<
          InferSchemaValues<typeof config>["bar"][number]["_type"]
        >();
      expect(
        zods.bar.parse([
          {
            ...fields,
            _type: "bar",
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _type: "bar",
        },
      ]);
      expect(() => zods.bar.parse(true)).toThrow();
    });
  });
});
