import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { createClient as createClientNative } from "@sanity/client";
import type {
  ClientConfig,
  SanityClient as SanityClientNative,
} from "@sanity/client";
import type { Merge } from "type-fest";

import type { SanityDocument } from "@sanity-typed/types";

import { castFromTyped, castToTyped, createClient } from ".";
import type { SanityClient } from ".";

type AnySanityDocument = Omit<SanityDocument, "_type">;

describe("interoperability", () => {
  describe("castToTyped", () => {
    it("is a typescript error without SanityValues", () => {
      const exec = () => {
        const client =
          // @ts-expect-error -- castToTyped needs an explicit type
          castToTyped()(
            createClientNative({
              dataset: "dataset",
              projectId: "projectId",
            })
          );

        return client;
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        SanityClient<ClientConfig, never>
      >();
    });

    it("castToTyped<SanityValues>()(createClientNative(...))", () => {
      const exec = () => {
        const client = castToTyped<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()(
          createClientNative({
            dataset: "dataset",
            projectId: "projectId",
          })
        );

        return client;
      };

      expectType<ReturnType<typeof exec>>().toEqual<
        SanityClient<ClientConfig, AnySanityDocument & { _type: "foo" }>
      >();
    });

    it("castToTyped<SanityValues>()(createClientNative(..., config))", () => {
      const exec = () => {
        const client = castToTyped<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()(
          createClientNative({
            dataset: "dataset",
            projectId: "projectId",
          }),
          {
            dataset: "dataset",
            projectId: "projectId",
          }
        );

        return client;
      };

      expectType<ReturnType<typeof exec>>().toEqual<
        SanityClient<
          {
            dataset: "dataset";
            projectId: "projectId";
          },
          AnySanityDocument & { _type: "foo" }
        >
      >();
    });
  });

  describe("castFromTyped", () => {
    it("castFromTyped(createClient(...))", () => {
      const exec = () => {
        const client = castFromTyped(
          createClient<{
            foo: Merge<SanityDocument, { _type: "foo" }>;
          }>()({
            dataset: "dataset",
            projectId: "projectId",
          })
        );

        return client;
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<SanityClientNative>();
    });
  });
});
