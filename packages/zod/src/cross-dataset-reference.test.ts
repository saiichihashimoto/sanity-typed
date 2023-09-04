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
import type { InferSchemaValues } from "@sanity-typed/types";

import { sanityConfigToZods } from ".";

describe("crossDatasetReference", () => {
  describe("defineArrayMember", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
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
                  type: "crossDatasetReference",
                  to: [],
                  dataset: "dataset",
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
            _dataset: "dataset",
            _projectId: "projectId",
            _ref: "foo",
            _type: "crossDatasetReference",
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "crossDatasetReference",
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
                  type: "crossDatasetReference",
                  to: [],
                  dataset: "dataset",
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
            _dataset: "dataset",
            _projectId: "projectId",
            _ref: "foo",
            _type: "foo",
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "foo",
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
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
                  type: "crossDatasetReference",
                  to: [],
                  dataset: "dataset",
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
            _dataset: "dataset",
            _projectId: "projectId",
            _ref: "foo",
            _type: "crossDatasetReference",
          },
        })
      ).toStrictEqual({
        bar: {
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "crossDatasetReference",
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it.failing("builds parser for CrossDatasetReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "crossDatasetReference",
              to: [],
              dataset: "dataset",
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
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "foo",
        })
      ).toStrictEqual({
        _dataset: "dataset",
        _projectId: "projectId",
        _ref: "foo",
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
              type: "crossDatasetReference",
              to: [],
              dataset: "dataset",
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
            _dataset: "dataset",
            _projectId: "projectId",
            _ref: "foo",
            _type: "bar",
          },
        ])
      ).toStrictEqual([
        {
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "bar",
        },
      ]);
      expect(() => zods.bar.parse(true)).toThrow();
    });
  });
});
