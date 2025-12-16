import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { createClient as createClientNative } from "@sanity/client";

import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

import { castToTyped } from ".";
import type { SanityClient } from ".";

describe("interoperability", () => {
  describe("castToTyped", () => {
    describe("createClient", () => {
      it("is a typescript error without SanityValues", () => {
        const exec = () => {
          const client =
            // @ts-expect-error -- EXPECTED castToTyped needs an explicit type
            castToTyped()(
              createClientNative({ dataset: "dataset", projectId: "projectId" })
            );

          return client;
        };

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          SanityClient<never>
        >();
      });

      it("castToTyped<SanityValues>()(createClientNative(...))", () => {
        const exec = () => {
          const client = castToTyped<{
            foo: AnySanityDocument & { _type: "foo" };
          }>()(
            createClientNative({ dataset: "dataset", projectId: "projectId" })
          );

          return client;
        };

        expectType<ReturnType<typeof exec>>().toEqual<
          SanityClient<AnySanityDocument & { _type: "foo" }>
        >();
      });

      it("castToTyped<SanityValues>()(createClientNative(..., config))", () => {
        const exec = () => {
          const client = castToTyped<{
            foo: AnySanityDocument & { _type: "foo" };
          }>()(
            createClientNative({ dataset: "dataset", projectId: "projectId" })
          );

          return client;
        };

        expectType<ReturnType<typeof exec>>().toEqual<
          SanityClient<AnySanityDocument & { _type: "foo" }>
        >();
      });
    });
  });
});
