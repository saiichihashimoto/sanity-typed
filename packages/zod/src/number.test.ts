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

describe("number", () => {
  describe("defineArrayMember", () => {
    it("builds parser for number", () => {
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
                  type: "number",
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
      expect(zods.foo.parse([1])).toStrictEqual([1]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for number", () => {
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
                  type: "number",
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
          bar: 1,
        })
      ).toStrictEqual({
        _type: "foo",
        bar: 1,
      });
      expect(() => zods.foo.parse({ bar: true })).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for number", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "number",
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
      expect(zods.foo.parse(1)).toBe(1);
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });
});
