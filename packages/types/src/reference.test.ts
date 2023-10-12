import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";
import type { referenced } from "./internal";

describe("reference", () => {
  describe("defineArrayMember", () => {
    it("infers ReferenceValue", () => {
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _ref: string;
        _strengthenOnPublish?: {
          template?: {
            id: string;
            params: { [key: string]: boolean | number | string };
          };
          type: string;
          weak?: boolean;
        };
        _type: "reference";
        _weak?: boolean;
        [referenced]: "other";
      }>();
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
                  name: "bar",
                  type: "reference",
                  to: [{ type: "other" as const }],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >().toStrictEqual<"bar">();
    });
  });

  describe("defineField", () => {
    it("infers ReferenceValue", () => {
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

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<{
        _ref: string;
        _strengthenOnPublish?: {
          template?: {
            id: string;
            params: { [key: string]: boolean | number | string };
          };
          type: string;
          weak?: boolean;
        };
        _type: "reference";
        _weak?: boolean;
        [referenced]: "other";
      }>();
    });
  });

  describe("defineType", () => {
    it("infers ReferenceValue", () => {
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _ref: string;
        _strengthenOnPublish?: {
          template?: {
            id: string;
            params: { [key: string]: boolean | number | string };
          };
          type: string;
          weak?: boolean;
        };
        _type: "foo";
        _weak?: boolean;
        [referenced]: "other";
      }>();
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

      expectType<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >().toStrictEqual<"bar">();
    });
  });
});
