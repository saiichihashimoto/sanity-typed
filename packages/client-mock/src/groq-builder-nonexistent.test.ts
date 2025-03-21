import { describe, expect, it, jest } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

import { createClient } from ".";

jest.mock<typeof import("groq-builder")>("groq-builder", () => {
  throw new Error("Cannot find module 'groq-builder'");
});

describe("groq-builder nonexistent", () => {
  describe("fetch", () => {
    it("fails to return anything", async () => {
      const client = createClient<{
        bar: { _type: "bar"; bar: "bar" };
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>({
        documents: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
        ],
      });

      const exec = () =>
        client.fetch((q) =>
          q.star.filterByType("foo").project((q) => ({ foo: q.field("foo") }))
        );

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<{ foo: string }[]>
      >();
      await expect(exec).rejects.toThrow(
        "Cannot pass a function to `fetch` unless `groq-query` is installed"
      );
    });
  });
});
