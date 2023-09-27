import { describe, it } from "@jest/globals";
import type {
  ClientConfig,
  ClientPerspective,
  RequestFetchOptions,
} from "@sanity/client";
import type { Observable } from "rxjs";
import type { SetOptional } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";
import type { SanityDocument } from "@sanity-typed/types";

import { createClient } from ".";
import type { RawQueryResponse } from ".";

type AnySanityDocument = Omit<SanityDocument, "_type">;

describe("observable", () => {
  describe("clone", () => {
    it("returns the same type", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({});

        return client.observable;
      };

      const execClone = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({});

        return client.observable.clone();
      };

      expectType<ReturnType<typeof execClone>>().toEqual<
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

        return client.observable.config();
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
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "newProjectId",
        });

        return client.observable;
      };

      const execWithConfig = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        });

        return client.observable.config({
          projectId: "newProjectId",
        });
      };

      expectType<ReturnType<typeof execWithConfig>>().toEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("withConfig", () => {
    it("returns the altered type", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "newProjectId",
        });

        return client.observable;
      };

      const execWithConfig = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        });

        return client.observable.withConfig({
          projectId: "newProjectId",
        });
      };

      expectType<ReturnType<typeof execWithConfig>>().toEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("fetch", () => {
    it("returns the groq query result", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({});

        return client.observable.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<(AnySanityDocument & { _type: "foo" })[]>
      >();
    });

    it("filters the results to documents", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo" };
        }>()({});

        return client.observable.fetch("*");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<(AnySanityDocument & { _type: "foo" })[]>
      >();
    });

    it("uses the client in queries", () => {
      const exec = () => {
        const client = createClient()({
          projectId: "projectId",
        });

        return client.observable.fetch("sanity::projectId()");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<"projectId">
      >();
    });

    it("uses the params in queries", () => {
      const exec = () => {
        const client = createClient()({});

        return client.observable.fetch("$param", { param: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<Observable<"foo">>();
    });

    it("returns RawQueryResponse", () => {
      const exec = () => {
        const client = createClient()({});

        return client.observable.fetch("5", undefined, {
          filterResponse: false,
        });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<RawQueryResponse<5, "5">>
      >();
    });

    it("adds _originalId when perspective is `previewDrafts`", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({
          perspective: "previewDrafts",
        });

        return client.observable.fetch("*", undefined);
      };

      expectType<ReturnType<typeof exec>>().toEqual<
        Observable<
          (
            | (AnySanityDocument & {
                _originalId: string;
                _type: "foo";
              })
            | (AnySanityDocument & {
                _originalId: string;
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
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({});

        return client.observable.getDocument("id");
      };

      expectType<ReturnType<typeof exec>>().toEqual<
        Observable<
          | (AnySanityDocument & {
              _id: "id";
              _type: "foo";
            })
          | (AnySanityDocument & {
              _id: "id";
              _type: "qux";
            })
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
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({});

        return client.observable.getDocuments(["id", "id2"]);
      };

      expectType<ReturnType<typeof exec>>().toEqual<
        Observable<
          [
            (
              | (AnySanityDocument & {
                  _id: "id";
                  _type: "foo";
                })
              | (AnySanityDocument & {
                  _id: "id";
                  _type: "qux";
                })
              | null
            ),
            (
              | (AnySanityDocument & {
                  _id: "id2";
                  _type: "foo";
                })
              | (AnySanityDocument & {
                  _id: "id2";
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
    it("requires a document without _ fields (optional _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({});

        expectType<Parameters<typeof client.create>[0]>().toEqual<
          Omit<
            SetOptional<
              | (AnySanityDocument & { _type: "foo" })
              | (AnySanityDocument & { _type: "qux" }),
              "_id"
            >,
            "_createdAt" | "_rev" | "_updatedAt"
          >
        >();

        return client.observable.create({ _type: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo" }>
      >();
    });

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("createOrReplace", () => {
    it("requires a document without _ fields (required _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({});

        expectType<Parameters<typeof client.createOrReplace>[0]>().toEqual<
          Omit<
            | (AnySanityDocument & { _type: "foo" })
            | (AnySanityDocument & { _type: "qux" }),
            "_createdAt" | "_rev" | "_updatedAt"
          >
        >();

        return client.observable.createOrReplace({ _type: "foo", _id: "id" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo" }>
      >();
    });

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("createIfNotExists", () => {
    it("requires a document without _ fields (required _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({});

        expectType<Parameters<typeof client.createIfNotExists>[0]>().toEqual<
          Omit<
            | (AnySanityDocument & { _type: "foo" })
            | (AnySanityDocument & { _type: "qux" }),
            "_createdAt" | "_rev" | "_updatedAt"
          >
        >();

        return client.observable.createIfNotExists({ _type: "foo", _id: "id" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo" }>
      >();
    });

    it.todo("https://github.com/sanity-io/client#mutation-options");
  });

  describe("patch", () => {
    it.todo("https://github.com/sanity-io/client#patchupdate-a-document");
  });

  describe("delete", () => {
    it("returns a union of the documents", () => {
      const exec = () => {
        const client = createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({});

        return client.observable.delete("id");
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          | (AnySanityDocument & { _type: "foo" })
          | (AnySanityDocument & { _type: "qux" })
        >
      >();
    });

    it.todo("handle MutationSelection that selects multiple documents via ids");

    it.todo(
      "handle MutationSelection that selects a single document via query"
    );

    it.todo(
      "handle MutationSelection that selects multiple documents via query"
    );

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
