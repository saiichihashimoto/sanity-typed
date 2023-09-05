import { describe, expect, it } from "@jest/globals";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

describe("boolean", () => {
  describe("defineArrayMember", () => {
    it("builds parser for boolean", () => {
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
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
      expect(zods.foo.parse([true])).toStrictEqual([true]);
      expect(() => zods.foo.parse(["foo"])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for boolean", () => {
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
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expectType<
        Required<z.infer<(typeof zods)["foo"]>>["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: true,
        })
      ).toStrictEqual({
        _type: "foo",
        bar: true,
      });
      expect(() => zods.foo.parse({ bar: "foo" })).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for boolean", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "boolean",
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
      expect(zods.foo.parse(true)).toBe(true);
      expect(() => zods.foo.parse("foo")).toThrow();
    });
  });
});
