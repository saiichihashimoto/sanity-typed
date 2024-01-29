import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

import { createClient } from ".";

describe("groq-builder", () => {
  describe("fetch", () => {
    it("returns typed results from groq-builder", () => {
      const client = createClient<{
        bar: { _type: "bar"; bar: "bar" };
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>({
        apiVersion: "2023-05-23",
        dataset: "dataset",
        projectId: "projectId",
        useCdn: false,
      });

      const exec = () =>
        client.fetch((q) =>
          q.star.filterByType("foo").project((q) => ({ foo: q.field("foo") }))
        );

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<{ foo: string }[]>
      >();
    });
  });
});
