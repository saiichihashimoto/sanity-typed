import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SlugValue } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

const fields: Omit<SlugValue, "_type"> = { current: "current" };

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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse([
        {
          ...fields,
          _key: "key",
          _type: "slug",
        },
      ]);

      expectType<(typeof parsed)[number]>().toStrictEqual<
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
                  type: "slug",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse([
        {
          ...fields,
          _key: "key",
          _type: "foo",
        },
      ]);

      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >();
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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: {
          ...fields,
          _type: "slug",
        },
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for SlugValue", () => {
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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        ...fields,
        _type: "foo",
      });

      expectType<typeof parsed>().toStrictEqual<
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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.bar.parse([
        {
          ...fields,
          _key: "key",
          _type: "bar",
        },
      ]);

      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >();
    });
  });
});
