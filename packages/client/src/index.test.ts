import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import type { SanityDocument } from "@sanity-typed/types";

import { createClient } from ".";
import type { SanityClient } from ".";

describe("createClient", () => {
  describe("fetch", () => {
    it("returns the groq query result", () => {
      const exec = async () => {
        const client = createClient<{ foo: SanityDocument }>()({});

        return client.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<SanityDocument[]>
      >();
    });

    it("filters the results to documents", () => {
      const exec = async () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: SanityDocument;
        }>()({});

        return client.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<SanityDocument[]>
      >();
    });

    it("uses the client in queries", () => {
      const exec = async () => {
        const client = createClient()({
          projectId: "projectId",
        });

        return client.fetch("sanity::projectId()");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<"projectId">
      >();
    });

    it("uses the params in queries", () => {
      const exec = async () => {
        const client = createClient()({
          projectId: "projectId",
        });

        return client.fetch("$param", { param: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<Promise<"foo">>();
    });
  });

  describe("clone", () => {
    it("returns the same type", () => {
      const exec = () => {
        const client = createClient<{ foo: SanityDocument }>()({});

        return client;
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        ReturnType<ReturnType<typeof exec>["clone"]>
      >();
    });
  });

  describe("withConfig", () => {
    it("returns the altered type", () => {
      const exec = () => {
        const client = createClient<{
          foo: SanityDocument;
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        });

        return client;
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        SanityClient<
          { dataset: "dataset"; projectId: "projectId" },
          SanityDocument[]
        >
      >();

      const exec2 = () => {
        const client = exec();

        return client.withConfig({
          projectId: "newProjectId",
        });
      };

      expectType<ReturnType<typeof exec2>>().toStrictEqual<
        SanityClient<
          { dataset: "dataset"; projectId: "newProjectId" },
          SanityDocument[]
        >
      >();
    });
  });
});
