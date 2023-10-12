import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type { z } from "zod";

import { defineConfig, defineField, defineType } from "@sanity-typed/types";
import type { DocumentValues, InferSchemaValues } from "@sanity-typed/types";

import { sanityConfigToZods, sanityDocumentsZod } from ".";

describe("documentZods", () => {
  it("builds parser for union of only sanity documents", () => {
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
            name: "baz",
            type: "string",
          }),
        ],
      },
    });
    const zods = sanityConfigToZods(config);
    const documentsZod = sanityDocumentsZod(config, zods);

    expectType<z.infer<typeof documentsZod>>().toStrictEqual<
      DocumentValues<InferSchemaValues<typeof config>>
    >();
    expect(() =>
      documentsZod.parse({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        foo: true,
      })
    ).not.toThrow();
    expect(() =>
      documentsZod.parse({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "bar",
        _updatedAt: "updatedAt",
        bar: 1,
      })
    ).not.toThrow();
    expect(() => documentsZod.parse("baz")).toThrow("Invalid input");
  });
});
