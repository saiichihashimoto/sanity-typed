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

      const parsed = zods.foo.parse([1]);

      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("builds parser for literal number from list", () => {
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
                  options: {
                    list: [1, { title: "Two", value: 2 }],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse([1]);

      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
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

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: 1,
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
    });

    it("builds parser for literal number from list", () => {
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
                  options: {
                    list: [1, { title: "Two", value: 2 }],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: 1,
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
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

      const parsed = zods.foo.parse(1);

      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("builds parser for literal number from list", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "number",
              options: {
                list: [1, { title: "Two", value: 2 }],
              },
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse(1);

      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });
});
