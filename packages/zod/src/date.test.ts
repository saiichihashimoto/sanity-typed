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

import { sanityConfigToZods } from ".";

describe("date", () => {
  describe("defineArrayMember", () => {
    it("builds parser for string", () => {
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
                  type: "date",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
      expect(zods.foo.parse(["foo"])).toStrictEqual(["foo"]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for string", () => {
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
                  type: "date",
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
      expect(zods.foo.parse({ bar: "foo" })).toStrictEqual({ bar: "foo" });
      expect(() => zods.foo.parse({ bar: true })).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for string", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "date",
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
      expect(zods.foo.parse("foo")).toBe("foo");
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });
});
