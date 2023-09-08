import { describe, it } from "@jest/globals";
import { createClient as createClientNative } from "@sanity/client";
import type {
  ClientConfig,
  SanityClient as SanityClientNative,
} from "@sanity/client";
import type { Merge } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";
import type { SanityDocument } from "@sanity-typed/types";

import { castFromTyped, castToTyped, createClient } from ".";
import type { SanityClient } from ".";

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
          foo: Merge<SanityDocument, { _type: "foo" }>;
        }>()(
          createClientNative({
            dataset: "dataset",
            projectId: "projectId",
          })
        );

        return client;
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        SanityClient<ClientConfig, Merge<SanityDocument, { _type: "foo" }>>
      >();
    });

    it("castToTyped<SanityValues>()(createClientNative(..., config))", () => {
      type SanityValues = {
        foo: Merge<SanityDocument, { _type: "foo" }>;
      };

      const exec = () => {
        const client = castToTyped<SanityValues>()(
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

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        SanityClient<
          {
            readonly dataset: "dataset";
            readonly projectId: "projectId";
          },
          SanityValues["foo"]
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
