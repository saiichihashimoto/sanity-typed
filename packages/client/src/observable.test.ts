import { describe, it } from "@jest/globals";
import type {
  ClientConfig,
  ClientPerspective,
  RequestFetchOptions,
  SanityAssetDocument,
} from "@sanity/client";
import type { Observable } from "rxjs";
import type { SetOptional } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";
import type { SanityDocument } from "@sanity-typed/types";

import { Patch, createClient } from ".";
import type {
  ListenEvent,
  MutationEvent,
  ObservableSanityClient,
  RawQueryResponse,
} from ".";

type AnySanityDocument = Omit<SanityDocument, "_type">;

describe("createClient", () => {
  it("adds _originalId to documents when perspective is `previewDrafts`", () => {
    const exec = () =>
      createClient<{
        foo: AnySanityDocument & { _type: "foo" };
        qux: AnySanityDocument & { _type: "qux" };
      }>()({
        perspective: "previewDrafts",
      }).observable;

    expectType<ReturnType<typeof exec>>().toEqual<
      ObservableSanityClient<
        {
          perspective: "previewDrafts";
        },
        | (AnySanityDocument & {
            _originalId: string;
            _type: "foo";
          })
        | (AnySanityDocument & {
            _originalId: string;
            _type: "qux";
          })
      >
    >();
  });

  describe("clone", () => {
    it("returns the same type", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({}).observable;

      const execClone = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({}).observable.clone();

      expectType<ReturnType<typeof execClone>>().toEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("config", () => {
    it("returns the config with more", () => {
      const exec = () =>
        createClient()({
          dataset: "dataset",
          projectId: "projectId",
        }).observable.config();

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
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "newProjectId",
        }).observable;

      const execWithConfig = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        }).observable.config({
          projectId: "newProjectId",
        });

      expectType<ReturnType<typeof execWithConfig>>().toEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("withConfig", () => {
    it("returns the altered type", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "newProjectId",
        }).observable;

      const execWithConfig = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({
          dataset: "dataset",
          projectId: "projectId",
        }).observable.withConfig({
          projectId: "newProjectId",
        });

      expectType<ReturnType<typeof execWithConfig>>().toEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("fetch", () => {
    it("returns the groq query result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({}).observable.fetch("*");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<(AnySanityDocument & { _type: "foo" })[]>
      >();
    });

    it("filters the results to documents", () => {
      const exec = () =>
        createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo" };
        }>()({}).observable.fetch("*");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<(AnySanityDocument & { _type: "foo" })[]>
      >();
    });

    it("uses the client in queries", () => {
      const exec = () =>
        createClient()({
          projectId: "projectId",
        }).observable.fetch("sanity::projectId()");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<"projectId">
      >();
    });

    it("uses the params in queries", () => {
      const exec = () =>
        createClient()({}).observable.fetch("$param", { param: "foo" });

      expectType<ReturnType<typeof exec>>().toStrictEqual<Observable<"foo">>();
    });

    it("returns RawQueryResponse", () => {
      const exec = () =>
        createClient()({}).observable.fetch("5", undefined, {
          filterResponse: false,
        });

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<RawQueryResponse<5, "5">>
      >();
    });
  });

  describe("listen", () => {
    it("observes the groq query result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({}).observable.listen("*");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<MutationEvent<AnySanityDocument & { _type: "foo" }>>
      >();
    });

    it("returns ListenEvent with options", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
        }>()({}).observable.listen("*", {}, {});

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<ListenEvent<AnySanityDocument & { _type: "foo" }>>
      >();
    });
  });

  describe("getDocument", () => {
    it("returns a union of the documents or undefined", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({}).observable.getDocument("id");

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
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({}).observable.getDocuments(["id", "id2"]);

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
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({}).observable;

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

        return client.create({ _type: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo" }>
      >();
    });
  });

  describe("createOrReplace", () => {
    it("requires a document without _ fields (required _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({}).observable;

        expectType<Parameters<typeof client.createOrReplace>[0]>().toEqual<
          Omit<
            | (AnySanityDocument & { _type: "foo" })
            | (AnySanityDocument & { _type: "qux" }),
            "_createdAt" | "_rev" | "_updatedAt"
          >
        >();

        return client.createOrReplace({ _type: "foo", _id: "id" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo" }>
      >();
    });
  });

  describe("createIfNotExists", () => {
    it("requires a document without _ fields (required _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({}).observable;

        expectType<Parameters<typeof client.createIfNotExists>[0]>().toEqual<
          Omit<
            | (AnySanityDocument & { _type: "foo" })
            | (AnySanityDocument & { _type: "qux" }),
            "_createdAt" | "_rev" | "_updatedAt"
          >
        >();

        return client.createIfNotExists({ _type: "foo", _id: "id" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo" }>
      >();
    });
  });

  describe("delete", () => {
    it("returns a union of the documents and an asset document", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo" };
          qux: AnySanityDocument & { _type: "qux" };
        }>()({}).observable.delete("id");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          | SanityAssetDocument
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
  });

  describe("patch", () => {
    it("returns a union of the documents", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });

    it("filters the union to set attrs", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .set({ foo: "foo" })
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });

    it("filters the union to setIfMissing attrs", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .setIfMissing({ foo: "foo" })
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });

    it.todo("diffMatchPatch");

    it("filters the union to unset keys", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .unset(["foo"])
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });

    it("filters the union to inc attrs", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: number };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .inc({ foo: 1 })
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo"; foo: number }>
      >();
    });

    it("filters the union to dec attrs", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: number };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .dec({ foo: 1 })
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo"; foo: number }>
      >();
    });

    it.todo("insert");

    it.todo("append");

    it.todo("prepend");

    it.todo("splice, it does JSON paths");

    it("returns original documents after reset", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .observable.patch("id")
          .set({ foo: "foo" })
          .reset()
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });

    it.todo("pre-applies PatchOperations");

    it.todo("try all of them with deep and JSON Paths");
  });

  describe("transaction", () => {
    it.todo(
      "https://github.com/sanity-io/client#multiple-mutations-in-a-transaction"
    );

    it.todo("each mutation");
  });

  describe("mutate", () => {
    it("returns a union of the documents", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({}).observable.mutate([{ delete: { id: "id" } }]);

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });

    it.todo("filters to mutation results");

    it("filters to Patch result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({}).observable.mutate(new Patch("id").set({ foo: "foo" }));

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });

    it.todo("allows Transaction as arg");
  });
});
