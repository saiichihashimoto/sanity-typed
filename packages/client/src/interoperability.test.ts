import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { createClient as createClientNative } from "@sanity/client";
import type { ClientConfig } from "@sanity/client";
import { createClient as createStegaClientNative } from "@sanity/client/stega";

import type { SanityDocument } from "@sanity-typed/types";

import { castToTyped } from ".";
import type { SanityClient, SanityStegaClient } from ".";

type AnySanityDocument = Omit<SanityDocument, "_type">;

describe("interoperability", () => {
  describe("castToTyped", () => {
    describe("createClient", () => {
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

    describe("createStegaClient", () => {
      it("is a typescript error without SanityValues", () => {
        const exec = () => {
          const client =
            // @ts-expect-error -- castToTyped needs an explicit type
            castToTyped()(
              createStegaClientNative({
                dataset: "dataset",
                projectId: "projectId",
              })
            );

          return client;
        };

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          SanityStegaClient<ClientConfig, never>
        >();
      });

      it("castToTyped<SanityValues>()(createStegaClientNative(...))", () => {
        const exec = () => {
          const client = castToTyped<{
            foo: AnySanityDocument & { _type: "foo" };
          }>()(
            createStegaClientNative({
              dataset: "dataset",
              projectId: "projectId",
            })
          );

          return client;
        };

        expectType<ReturnType<typeof exec>>().toEqual<
          SanityStegaClient<ClientConfig, AnySanityDocument & { _type: "foo" }>
        >();
      });

      it("castToTyped<SanityValues>()(createStegaClientNative(..., config))", () => {
        const exec = () => {
          const client = castToTyped<{
            foo: AnySanityDocument & { _type: "foo" };
          }>()(
            createStegaClientNative({
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
          SanityStegaClient<
            {
              dataset: "dataset";
              projectId: "projectId";
            },
            AnySanityDocument & { _type: "foo" }
          >
        >();
      });
    });
  });
});
