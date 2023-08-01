import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SanityDocument } from "@sanity-typed/types";

import { createClient } from ".";
import type { SanityClient } from ".";

describe("createClient", () => {
  describe("fetch", () => {
    it("returns the groq query result", () => {
      const exec = async () => {
        const client = createClient({})<{ foo: SanityDocument<"foo", any> }>();

        return client.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<SanityDocument<"foo", any>[]>
      >();
    });

    it("filters the results to documents", () => {
      const exec = async () => {
        const client = createClient({})<{
          bar: { _type: "bar"; bar: "bar" };
          foo: SanityDocument<"foo", any>;
        }>();

        return client.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<SanityDocument<"foo", any>[]>
      >();
    });

    it("uses the client in queries", () => {
      const exec = async () => {
        const client = createClient({
          projectId: "projectId",
        })<{
          bar: { _type: "bar"; bar: "bar" };
          foo: SanityDocument<"foo", any>;
        }>();

        return client.fetch("sanity::projectId()");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<"projectId">
      >();
    });
  });

  describe("clone", () => {
    it("returns the same type", () => {
      const exec = () => {
        const client = createClient({})<{ foo: SanityDocument<"foo", any> }>();

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
        const client = createClient({
          dataset: "dataset",
          projectId: "projectId",
        })<{
          foo: SanityDocument<"foo", any>;
        }>();

        return client;
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        SanityClient<
          { dataset: "dataset"; projectId: "projectId" },
          SanityDocument<"foo", any>[]
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
          SanityDocument<"foo", any>[]
        >
      >();
    });
  });
});

describe("integration tests", () => {
  it("config to fetch", () => {
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
                name: "bar",
                type: "bar",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
          defineType({
            name: "bar",
            type: "object",
            fields: [
              defineField({
                name: "baz",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "boolean",
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    type SanityValues = InferSchemaValues<typeof config>;

    const exec = async () => {
      const client = createClient({
        dataset: "dataset",
        projectId: "projectId",
      })<SanityValues>();

      return client.fetch("*");
    };

    expectType<ReturnType<typeof exec>>().toStrictEqual<
      Promise<
        {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          bar: { _type: "bar" } & { baz?: boolean[] };
        }[]
      >
    >();
  });
});
