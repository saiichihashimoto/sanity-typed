import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

import { createClient } from ".";

describe("groq-builder", () => {
  describe("fetch", () => {
    it("returns typed results from groq-builder", async () => {
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
      await expect(exec()).resolves.toStrictEqual([{ foo: "foo" }]);
    });
  });
});
