import { describe, it } from "@jest/globals";
import type {
  ClientConfig,
  ClientPerspective,
  RequestFetchOptions,
  SanityAssetDocument,
} from "@sanity/client";
import type { Observable } from "rxjs";

import { Patch, Transaction } from "@sanity-typed/client";
import type {
  ListenEvent,
  MutationEvent,
  RawQueryResponse,
  SanityClient,
} from "@sanity-typed/client";
import { expectType } from "@sanity-typed/test-utils";
import type { SanityDocument } from "@sanity-typed/types";

import { createClient } from ".";

type AnySanityDocument = Omit<SanityDocument, "_type">;

describe("createClient", () => {
  it("returns a SanityClient", () => {
    const client = createClient<{
      foo: AnySanityDocument & { _type: "foo"; foo: string };
    }>()({});

    expectType<typeof client>().toEqual<
      SanityClient<
        { [key: string]: never },
        AnySanityDocument & { _type: "foo"; foo: string }
      >
    >();
  });

  it("adds _originalId to documents when perspective is `previewDrafts`", () => {
    const client = createClient<{
      foo: AnySanityDocument & { _type: "foo"; foo: string };
      qux: AnySanityDocument & { _type: "qux"; qux: number };
    }>()({
      perspective: "previewDrafts",
    });

    expectType<typeof client>().toEqual<
      SanityClient<
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
      const client = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({});

      const clientClone = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({}).clone();

      expectType<typeof clientClone>().toEqual<typeof client>();
    });
  });

  describe("config", () => {
    it("returns the config with more", () => {
      const config = createClient()({
        dataset: "dataset",
        projectId: "projectId",
      }).config();

      expectType<typeof config>().toStrictEqual<{
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
      expect(config).toStrictEqual({
        apiHost: "apiHost",
        apiVersion: "apiVersion",
        cdnUrl: "internal, don't use",
        dataset: "dataset",
        isDefaultApi: true,
        projectId: "projectId",
        url: "internal, don't use",
        useCdn: true,
        useProjectHostname: true,
      });
    });

    it("returns the altered type", () => {
      const client = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({
        dataset: "dataset",
        projectId: "newProjectId",
      });

      const clientWithConfig = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({
        dataset: "dataset",
        projectId: "projectId",
      }).config({
        projectId: "newProjectId",
      });

      expectType<typeof clientWithConfig>().toEqual<typeof client>();
      expect(clientWithConfig.config()).toStrictEqual(client.config());
    });
  });

  describe("withConfig", () => {
    it("returns the altered type", () => {
      const client = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({
        dataset: "dataset",
        projectId: "newProjectId",
      });

      const clientWithConfig = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({
        dataset: "dataset",
        projectId: "projectId",
      }).withConfig({
        projectId: "newProjectId",
      });

      expectType<typeof clientWithConfig>().toEqual<typeof client>();
      expect(clientWithConfig.config()).toStrictEqual(client.config());
    });
  });

  describe("fetch", () => {
    it("returns the groq query result", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
        ],
      })({}).fetch("*");

      expectType<typeof result>().toStrictEqual<
        (AnySanityDocument & { _type: "foo"; foo: string })[]
      >();
      expect(result).toStrictEqual([
        {
          _createdAt: "_createdAt",
          _id: "id",
          _rev: "_rev",
          _type: "foo",
          _updatedAt: "_updatedAt",
          foo: "foo",
        },
      ]);
    });

    it("filters the result to documents", async () => {
      const result = await createClient<{
        bar: { _type: "bar"; bar: "bar" };
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
        ],
      })({}).fetch("*");

      expectType<typeof result>().toStrictEqual<
        (AnySanityDocument & { _type: "foo"; foo: string })[]
      >();
      expect(result).toStrictEqual([
        {
          _createdAt: "_createdAt",
          _id: "id",
          _rev: "_rev",
          _type: "foo",
          _updatedAt: "_updatedAt",
          foo: "foo",
        },
      ]);
    });

    it("uses the client in queries", async () => {
      const result = await createClient()({
        projectId: "projectId",
      }).fetch("sanity::projectId()");

      expectType<typeof result>().toStrictEqual<"projectId">();
      expect(result).toBe("projectId");
    });

    it("uses the params in queries", async () => {
      const result = await createClient()({}).fetch("$param", { param: "foo" });

      expectType<typeof result>().toStrictEqual<"foo">();
      expect(result).toBe("foo");
    });

    it("returns RawQueryResponse", async () => {
      const result = await createClient()({}).fetch("5", undefined, {
        filterResponse: false,
      });

      expectType<typeof result>().toStrictEqual<RawQueryResponse<5, "5">>();
      expect(result).toStrictEqual({
        ms: expect.any(Number),
        result: 5,
        query: "5",
      });
    });
  });

  describe("listen", () => {
    it.failing("observes the groq query result", () => {
      const result = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({}).listen("*");

      expectType<typeof result>().toStrictEqual<
        Observable<
          MutationEvent<AnySanityDocument & { _type: "foo"; foo: string }>
        >
      >();
    });

    it.failing("returns ListenEvent with options", () => {
      const result = createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
      }>()({}).listen("*", {}, {});

      expectType<typeof result>().toStrictEqual<
        Observable<
          ListenEvent<AnySanityDocument & { _type: "foo"; foo: string }>
        >
      >();
    });
  });

  describe("getDocument", () => {
    it("returns a union of the documents or undefined", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
          {
            _createdAt: "_createdAt",
            _id: "id2",
            _rev: "_rev",
            _type: "qux",
            _updatedAt: "_updatedAt",
            qux: 1,
          },
        ],
      })({}).getDocument("id");

      expectType<typeof result>().toEqual<
        | (AnySanityDocument & {
            _id: "id";
            _type: "foo";
            foo: string;
          })
        | (AnySanityDocument & {
            _id: "id";
            _type: "qux";
            qux: number;
          })
        | undefined
      >();
      expect(result).toStrictEqual({
        _createdAt: "_createdAt",
        _id: "id",
        _rev: "_rev",
        _type: "foo",
        _updatedAt: "_updatedAt",
        foo: "foo",
      });
    });
  });

  describe("getDocuments", () => {
    it("returns a tuple of a union of the documents or null", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
          {
            _createdAt: "_createdAt",
            _id: "id2",
            _rev: "_rev",
            _type: "qux",
            _updatedAt: "_updatedAt",
            qux: 1,
          },
        ],
      })({}).getDocuments(["id", "id2"]);

      expectType<typeof result>().toEqual<
        [
          (
            | (AnySanityDocument & {
                _id: "id";
                _type: "foo";
                foo: string;
              })
            | (AnySanityDocument & {
                _id: "id";
                _type: "qux";
                qux: number;
              })
            | null
          ),
          (
            | (AnySanityDocument & {
                _id: "id2";
                _type: "foo";
                foo: string;
              })
            | (AnySanityDocument & {
                _id: "id2";
                _type: "qux";
                qux: number;
              })
            | null
          )
        ]
      >();
      expect(result).toStrictEqual([
        {
          _createdAt: "_createdAt",
          _id: "id",
          _rev: "_rev",
          _type: "foo",
          _updatedAt: "_updatedAt",
          foo: "foo",
        },
        {
          _createdAt: "_createdAt",
          _id: "id2",
          _rev: "_rev",
          _type: "qux",
          _updatedAt: "_updatedAt",
          qux: 1,
        },
      ]);
    });
  });

  describe("create", () => {
    it("requires a document without _ fields (optional _id) and returns the document", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({}).create({ _type: "foo", foo: "foo" });

      expectType<typeof result>().toStrictEqual<
        AnySanityDocument & { _type: "foo"; foo: string }
      >();
      expect(result).toStrictEqual({
        _createdAt: expect.any(String),
        _id: expect.any(String),
        _rev: expect.any(String),
        _type: "foo",
        _updatedAt: expect.any(String),
        foo: "foo",
      });
    });
  });

  describe("createOrReplace", () => {
    it("requires a document without _ fields (required _id) and returns the document", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
        ],
      })({}).createOrReplace({ _type: "foo", _id: "id", foo: "foo" });

      expectType<typeof result>().toStrictEqual<
        AnySanityDocument & { _type: "foo"; foo: string }
      >();
      expect(result).toStrictEqual({
        _createdAt: expect.any(String),
        _id: "id",
        _rev: expect.any(String),
        _type: "foo",
        _updatedAt: expect.any(String),
        foo: "foo",
      });
    });
  });

  describe("createIfNotExists", () => {
    it("requires a document without _ fields (required _id) and returns the document", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
        ],
      })({}).createIfNotExists({
        _type: "foo",
        _id: "id",
        foo: "foo",
      });

      expectType<typeof result>().toStrictEqual<
        AnySanityDocument & { _type: "foo"; foo: string }
      >();
      expect(result).toStrictEqual({
        _createdAt: "_createdAt",
        _id: "id",
        _rev: "_rev",
        _type: "foo",
        _updatedAt: "_updatedAt",
        foo: "foo",
      });
    });
  });

  describe("delete", () => {
    it("returns a union of the documents and an asset document", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>({
        dataset: [
          {
            _createdAt: "_createdAt",
            _id: "id",
            _rev: "_rev",
            _type: "foo",
            _updatedAt: "_updatedAt",
            foo: "foo",
          },
        ],
      })({}).delete("id");

      expectType<typeof result>().toStrictEqual<
        | SanityAssetDocument
        | (AnySanityDocument & { _type: "foo"; foo: string })
        | (AnySanityDocument & { _type: "qux"; qux: number })
      >();
      expect(result).toStrictEqual({
        _createdAt: "_createdAt",
        _id: "id",
        _rev: "_rev",
        _type: "foo",
        _updatedAt: "_updatedAt",
        foo: "foo",
      });
    });
  });

  describe("patch", () => {
    it.failing("returns a union of the documents", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({})
        .patch("id")
        .commit();

      expectType<typeof result>().toStrictEqual<
        | (AnySanityDocument & { _type: "foo"; foo: string })
        | (AnySanityDocument & { _type: "qux"; qux: number })
      >();
    });

    describe("set", () => {
      it.failing("filters the union to attrs", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id")
          .set({ foo: "foo" })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });

      it.failing("via PatchOperations", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id", { set: { foo: "foo" } })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("setIfMissing", () => {
      it.failing("filters the union to attrs", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id")
          .setIfMissing({ foo: "foo" })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });

      it.failing("via PatchOperations", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id", { setIfMissing: { foo: "foo" } })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("diffMatchPatch", () => {
      it.failing("filters the union to attrs", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id")
          .diffMatchPatch({ foo: "foo" })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });

      it.failing("via PatchOperations", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id", { diffMatchPatch: { foo: "foo" } })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("unset", () => {
      it.failing("filters the union to keys", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id")
          .unset(["foo"])
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });

      it.failing("via PatchOperations", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id", { unset: ["foo"] })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("inc", () => {
      it.failing("filters the union to attrs", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: number };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id")
          .inc({ foo: 1 })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: number }
        >();
      });

      it.failing("via PatchOperations", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: number };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id", { inc: { foo: 1 } })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: number }
        >();
      });
    });

    describe("dec", () => {
      it.failing("filters the union to attrs", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: number };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id")
          .dec({ foo: 1 })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: number }
        >();
      });

      it.failing("via PatchOperations", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: number };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .patch("id", { dec: { foo: 1 } })
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: number }
        >();
      });
    });

    it.todo("insert");

    it.todo("append");

    it.todo("prepend");

    it.todo("splice, it does JSON paths");

    it.failing("returns original documents after reset", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({})
        .patch("id")
        .set({ foo: "foo" })
        .reset()
        .commit();

      expectType<typeof result>().toStrictEqual<
        | (AnySanityDocument & { _type: "foo"; foo: string })
        | (AnySanityDocument & { _type: "qux"; qux: number })
      >();
    });

    it.todo("try all of them with deep and JSON Paths");
  });

  describe("transaction", () => {
    it.failing("returns an undefined", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({})
        .transaction()
        .commit();

      expectType<typeof result>().toStrictEqual<undefined>();
    });

    describe("create", () => {
      it.failing(
        "requires a document without _ fields (optional _id) and returns the document",
        async () => {
          const result = await createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>()({})
            .transaction()
            .create({ _type: "foo", foo: "foo" })
            .commit();

          expectType<typeof result>().toStrictEqual<
            AnySanityDocument & { _type: "foo"; foo: string }
          >();
        }
      );

      it.failing("via Mutation", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .transaction([{ create: { _type: "foo", foo: "foo" } }])
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("createOrReplace", () => {
      it.failing(
        "requires a document without _ fields (required _id) and returns the document",
        async () => {
          const result = await createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>()({})
            .transaction()
            .createOrReplace({ _type: "foo", _id: "id" })
            .commit();

          expectType<typeof result>().toStrictEqual<
            AnySanityDocument & { _type: "foo"; foo: string }
          >();
        }
      );

      it.failing("via Mutation", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .transaction([{ createOrReplace: { _type: "foo", _id: "id" } }])
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("createIfNotExists", () => {
      it.failing(
        "requires a document without _ fields (required _id) and returns the document",
        async () => {
          const result = await createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>()({})
            .transaction()
            .createIfNotExists({ _type: "foo", _id: "id" })
            .commit();

          expectType<typeof result>().toStrictEqual<
            AnySanityDocument & { _type: "foo"; foo: string }
          >();
        }
      );

      it.failing("via Mutation", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .transaction([{ createIfNotExists: { _type: "foo", _id: "id" } }])
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    describe("delete", () => {
      it.failing(
        "returns a union of the documents and an asset document",
        async () => {
          const result = await createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>()({})
            .transaction()
            .delete("id")
            .commit();

          expectType<typeof result>().toStrictEqual<
            | SanityAssetDocument
            | (AnySanityDocument & { _type: "foo"; foo: string })
            | (AnySanityDocument & { _type: "qux"; qux: number })
          >();
        }
      );

      it.failing("via Mutation", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .transaction([{ delete: { id: "id" } }])
          .commit();

        expectType<typeof result>().toStrictEqual<
          | SanityAssetDocument
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >();
      });
    });

    describe("patch", () => {
      it.failing("returns what a patch would return", async () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({});

        const result = await client
          .transaction()
          .patch(client.patch("id").set({ foo: "foo" }))
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });

      it.failing("can be defined inline", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .transaction()
          .patch("id", (patch) => patch.set({ foo: "foo" }))
          .commit();

        expectType<typeof result>().toStrictEqual<
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });

      it.failing("via Mutation", async () => {
        const result = await createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>()({})
          .transaction([{ patch: { id: "id", set: { foo: "foo" } } }])
          .commit();

        expectType<typeof result>().toStrictEqual<
          // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/286
          AnySanityDocument & { _type: "foo"; foo: string }
        >();
      });
    });

    it.failing("returns undefined after reset", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({})
        .transaction()
        .create({ _type: "foo", foo: "foo" })
        .reset()
        .commit();

      expectType<typeof result>().toStrictEqual<undefined>();
    });
  });

  describe("mutate", () => {
    it.failing("returns a union of the documents", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({}).mutate([]);

      expectType<typeof result>().toStrictEqual<
        | (AnySanityDocument & { _type: "foo"; foo: string })
        | (AnySanityDocument & { _type: "qux"; qux: number })
      >();
    });

    it.failing("filters to Mutation result", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({}).mutate([
        {
          create: {
            _type: "foo",
            // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/286
            foo: "foo",
          },
        },
      ]);

      expectType<typeof result>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/286
        AnySanityDocument & { _type: "foo"; foo: string }
      >();
    });

    it.failing("filters to Patch result", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({}).mutate(new Patch("id").set({ foo: "foo" }));

      expectType<typeof result>().toStrictEqual<
        AnySanityDocument & { _type: "foo"; foo: string }
      >();
    });

    it.failing("filters to Transaction result", async () => {
      const result = await createClient<{
        foo: AnySanityDocument & { _type: "foo"; foo: string };
        qux: AnySanityDocument & { _type: "qux"; qux: number };
      }>()({}).mutate(new Transaction().create({ _type: "foo", foo: "foo" }));

      expectType<typeof result>().toStrictEqual<
        AnySanityDocument & { _type: "foo"; foo: string }
      >();
    });
  });
});
