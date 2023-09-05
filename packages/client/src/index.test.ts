/* eslint-disable @typescript-eslint/promise-function-async -- I don't want to cooerce any types */
import { describe, it } from "@jest/globals";
import type {
  ClientConfig,
  ClientPerspective,
  RequestFetchOptions,
} from "@sanity/client";

import { expectType } from "@sanity-typed/test-utils";
import type { SanityDocument } from "@sanity-typed/types";

import { createClient } from ".";
import type { RawQueryResponse } from ".";

describe("createClient", () => {
  describe("clone", () => {
    it("returns the same type", () => {
      const exec = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({});

        return client;
      };

      const execClone = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({});

        return client.clone();
      };

      expectType<ReturnType<typeof execClone>>().toStrictEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("config", () => {
    it("returns the config with more", () => {
      const exec = () => {
        const client = createClient()({
          dataset: "dataset",
          projectId: "projectId",
        });

        return client.config();
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<{
        allowReconfigure?: boolean;
        apiHost: string;
        apiVersion: string;
        cdnUrl: string;
        dataset: "dataset";
        fetch?: RequestFetchOptions | boolean;
        ignoreBrowserTokenWarning?: boolean;
        isDefaultApi: boolean;
        maxRetries?: number;
        perspective?: ClientPerspective;
        projectId: "projectId";
        proxy?: string;
        requestTagPrefix?: string;
        requester?: Required<ClientConfig>["requester"];
        resultSourceMap?: boolean;
        retryDelay?: (attemptNumber: number) => number;
        timeout?: number;
        token?: string;
        url: string;
        useCdn: boolean;
        useProjectHostname: boolean;
        withCredentials?: boolean;
      }>();
    });

    it("returns the altered type", () => {
      const exec = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "newProjectId",
        });

        return client;
      };

      const execWithConfig = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        });

        return client.config({
          projectId: "newProjectId",
        });
      };

      expectType<ReturnType<typeof execWithConfig>>().toStrictEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("withConfig", () => {
    it("returns the altered type", () => {
      const exec = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "newProjectId",
        });

        return client;
      };

      const execWithConfig = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        });

        return client.withConfig({
          projectId: "newProjectId",
        });
      };

      expectType<ReturnType<typeof execWithConfig>>().toStrictEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("fetch", () => {
    it("returns the groq query result", () => {
      const exec = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({});

        return client.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<(Omit<SanityDocument, "_type"> & { _type: "foo" })[]>
      >();
    });

    it("filters the results to documents", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
        }>()({});

        return client.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<(Omit<SanityDocument, "_type"> & { _type: "foo" })[]>
      >();
    });

    it("uses the client in queries", () => {
      const exec = () => {
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
      const exec = () => {
        const client = createClient()({});

        return client.fetch("$param", { param: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<Promise<"foo">>();
    });

    it("returns RawQueryResponse", () => {
      const exec = () => {
        const client = createClient()({});

        return client.fetch("5", undefined, { filterResponse: false });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<RawQueryResponse<5, "5">>
      >();
    });

    it("adds _originalId when perspective is `previewDrafts`", () => {
      const exec = () => {
        const client = createClient<{
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
          qux: Omit<SanityDocument, "_type"> & { _type: "qux" };
        }>()({
          perspective: "previewDrafts",
        });

        return client.fetch("*", undefined);
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          (
            | (Omit<SanityDocument, "_type"> & {
                _originalId: string;
              } & {
                _type: "foo";
              })
            | (Omit<SanityDocument, "_type"> & {
                _originalId: string;
              } & {
                _type: "qux";
              })
          )[]
        >
      >();
    });
  });

  describe("listen", () => {
    it.todo("https://github.com/sanity-io/client#listening-to-queries");
  });

  describe("getDocument", () => {
    it("returns a union of the documents or undefined", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
          qux: Omit<SanityDocument, "_type"> & { _type: "qux" };
        }>()({});

        return client.getDocument("id");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          | (Omit<SanityDocument, "_type"> & { _id: "id" } & { _type: "foo" })
          | (Omit<SanityDocument, "_type"> & { _id: "id" } & { _type: "qux" })
          | undefined
        >
      >();
    });
  });

  describe("getDocuments", () => {
    it("returns a tuple of a union of the documents or null", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: Omit<SanityDocument, "_type"> & { _type: "foo" };
          qux: Omit<SanityDocument, "_type"> & { _type: "qux" };
        }>()({});

        return client.getDocuments(["id", "id2"]);
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          [
            (
              | (Omit<SanityDocument, "_type"> & {
                  _id: "id";
                } & {
                  _type: "foo";
                })
              | (Omit<SanityDocument, "_type"> & {
                  _id: "id";
                } & {
                  _type: "qux";
                })
              | null
            ),
            (
              | (Omit<SanityDocument, "_type"> & {
                  _id: "id2";
                } & {
                  _type: "foo";
                })
              | (Omit<SanityDocument, "_type"> & {
                  _id: "id2";
                } & {
                  _type: "qux";
                })
              | null
            )
          ]
        >
      >();
    });
  });

  describe("create", () => {
    it.todo("https://github.com/sanity-io/client#creating-documents");

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("createOrReplace", () => {
    it.todo("https://github.com/sanity-io/client#creatingreplacing-documents");

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("createIfNotExists", () => {
    it.todo(
      "https://github.com/sanity-io/client#creating-if-not-already-present"
    );

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("patch", () => {
    it.todo("https://github.com/sanity-io/client#patchupdate-a-document");
  });

  describe("delete", () => {
    it.todo("https://github.com/sanity-io/client#delete-documents");

    it.todo("https://github.com/sanity-io/client#deleting-an-asset");

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("transaction", () => {
    it.todo(
      "https://github.com/sanity-io/client#multiple-mutations-in-a-transaction"
    );
  });

  describe("mutate", () => {
    it.todo(
      "https://github.com/sanity-io/client#clientless-patches--transactions"
    );

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("assets", () => {
    it.todo("https://github.com/sanity-io/client#uploading-assets");
  });
});
