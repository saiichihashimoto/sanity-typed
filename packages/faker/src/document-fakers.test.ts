import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import { defineConfig, defineField, defineType } from "@sanity-typed/types";
import type { DocumentValues, InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { sanityDocumentsFaker } from ".";
import { sanityConfigToFakerTyped } from "./internal";

describe.each(Array.from({ length: 5 }).map((_, seed) => [{ seed }]))(
  "documentZods %p",
  ({ seed }) => {
    it("mocks union of sanity documents including implicit ones", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [defineField({ name: "foo", type: "boolean" })],
            }),
            defineType({
              name: "bar",
              type: "document",
              fields: [defineField({ name: "bar", type: "number" })],
            }),
            defineType({ name: "baz", type: "string" }),
          ],
        },
      });
      const sanityFaker = sanityConfigToFakerTyped(config, {
        seed,
        faker: { locale: [en, base] },
      });
      const documentsFaker = sanityDocumentsFaker(config, sanityFaker);

      expectType<ReturnType<typeof documentsFaker>[number]>().toEqual<
        DocumentValues<InferSchemaValues<typeof config>>
      >();

      const fakes = documentsFaker();

      const zods = sanityConfigToZods(config);

      expect(fakes).toHaveLength(20);

      expect(
        fakes.filter((fake) => zods.bar.safeParse(fake).success)
      ).toHaveLength(5);
      expect(
        fakes.filter((fake) => zods.foo.safeParse(fake).success)
      ).toHaveLength(5);
      expect(
        fakes.filter((fake) => zods["sanity.fileAsset"].safeParse(fake).success)
      ).toHaveLength(5);
      expect(
        fakes.filter(
          (fake) => zods["sanity.imageAsset"].safeParse(fake).success
        )
      ).toHaveLength(5);
    });

    it("respects referencedChunkSize", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [defineField({ name: "foo", type: "boolean" })],
            }),
            defineType({
              name: "bar",
              type: "document",
              fields: [defineField({ name: "bar", type: "number" })],
            }),
            defineType({ name: "baz", type: "string" }),
          ],
        },
      });
      const sanityFaker = sanityConfigToFakerTyped(config, {
        seed,
        faker: { locale: [en, base] },
        referencedChunkSize: 2,
      });
      const documentsFaker = sanityDocumentsFaker(config, sanityFaker, {
        referencedChunkSize: 2,
      });

      expectType<ReturnType<typeof documentsFaker>[number]>().toEqual<
        DocumentValues<InferSchemaValues<typeof config>>
      >();

      const fakes = documentsFaker();

      const zods = sanityConfigToZods(config);

      expect(fakes).toHaveLength(8);

      expect(
        fakes.filter((fake) => zods.bar.safeParse(fake).success)
      ).toHaveLength(2);
      expect(
        fakes.filter((fake) => zods.foo.safeParse(fake).success)
      ).toHaveLength(2);
      expect(
        fakes.filter((fake) => zods["sanity.fileAsset"].safeParse(fake).success)
      ).toHaveLength(2);
      expect(
        fakes.filter(
          (fake) => zods["sanity.imageAsset"].safeParse(fake).success
        )
      ).toHaveLength(2);
    });
  }
);
