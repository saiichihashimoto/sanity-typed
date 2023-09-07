import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

describe("url", () => {
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
                  type: "url",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse(["foo"]);

      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
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
                  type: "url",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: "foo",
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
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
              type: "url",
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse("foo");

      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });
});
