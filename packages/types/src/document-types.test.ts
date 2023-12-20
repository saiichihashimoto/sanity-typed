import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type { FileAsset, ImageAsset } from "sanity";

import { defineConfig, defineField, defineType } from ".";
import type { DocumentValues, InferSchemaValues } from ".";

describe("type DocumentValues", () => {
  it("infers union of sanity documents, including implicit ones", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "foo",
                type: "boolean",
              }),
            ],
          }),
          defineType({
            name: "bar",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "number",
              }),
            ],
          }),
          defineType({
            name: "qux",
            type: "string",
          }),
        ],
      },
    });

    expectType<DocumentValues<InferSchemaValues<typeof config>>>().toEqual<
      | FileAsset
      | ImageAsset
      | {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "bar";
          _updatedAt: string;
          bar?: number;
        }
      | {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          foo?: boolean;
        }
    >();
  });
});
