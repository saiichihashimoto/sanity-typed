import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type {
  InitializedClientConfig,
  SanityAssetDocument,
} from "@sanity/client";
import type { Observable } from "rxjs";
import type { SetOptional } from "type-fest";

import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

import { Patch, Transaction, createClient } from ".";
import type {
  ListenEvent,
  MutationEvent,
  RawQueryResponse,
  SanityClient,
} from ".";

describe("createClient", () => {
  it("returns a SanityClient", () => {
    const exec = () =>
      createClient<{ foo: AnySanityDocument & { _type: "foo"; foo: string } }>(
        {}
      );

    expectType<ReturnType<typeof exec>>().toEqual<
      SanityClient<AnySanityDocument & { _type: "foo"; foo: string }>
    >();
  });

  describe("clone", () => {
    it("returns the same type", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({});

      const execClone = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({}).clone();

      expectType<ReturnType<typeof execClone>>().toEqual<
        ReturnType<typeof exec>
      >();
    });
  });

  describe("config", () => {
    it("returns the config with more", () => {
      const exec = () =>
        createClient({ dataset: "dataset", projectId: "projectId" }).config();

      expectType<
        ReturnType<typeof exec>
      >().toStrictEqual<InitializedClientConfig>();
    });

    it("returns the altered type", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({ dataset: "dataset", projectId: "newProjectId" });

      const execWithConfig = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({ dataset: "dataset", projectId: "projectId" }).config({
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
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({ dataset: "dataset", projectId: "newProjectId" });

      const execWithConfig = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({ dataset: "dataset", projectId: "projectId" }).withConfig({
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
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({}).fetch("*");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<(AnySanityDocument & { _type: "foo"; foo: string })[]>
      >();
    });

    it("filters the results to documents", () => {
      const exec = () =>
        createClient<{
          bar: { _type: "bar"; bar: "bar" };
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({}).fetch("*");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<(AnySanityDocument & { _type: "foo"; foo: string })[]>
      >();
    });

    it("uses the params in queries", () => {
      const exec = () => createClient({}).fetch("$param", { param: "foo" });

      expectType<ReturnType<typeof exec>>().toStrictEqual<Promise<"foo">>();
    });

    it("returns RawQueryResponse", () => {
      const exec = () =>
        createClient({}).fetch("5", undefined, { filterResponse: false });

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<RawQueryResponse<5, "5">>
      >();
    });
  });

  describe("listen", () => {
    it("observes the groq query result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({}).listen("*");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          MutationEvent<AnySanityDocument & { _type: "foo"; foo: string }>
        >
      >();
    });

    it("returns ListenEvent with options", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
        }>({}).listen("*", {}, {});

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Observable<
          ListenEvent<AnySanityDocument & { _type: "foo"; foo: string }>
        >
      >();
    });
  });

  describe("getDocument", () => {
    it("returns a union of the documents or undefined", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).getDocument("id");

      expectType<ReturnType<typeof exec>>().toEqual<
        Promise<
          | (AnySanityDocument & { _id: "id"; _type: "foo"; foo: string })
          | (AnySanityDocument & { _id: "id"; _type: "qux"; qux: number })
          | undefined
        >
      >();
    });
  });

  describe("getDocuments", () => {
    it("returns a tuple of a union of the documents or null", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).getDocuments(["id", "id2"]);

      expectType<ReturnType<typeof exec>>().toEqual<
        Promise<
          [
            (
              | (AnySanityDocument & { _id: "id"; _type: "foo"; foo: string })
              | (AnySanityDocument & { _id: "id"; _type: "qux"; qux: number })
              | null
            ),
            (
              | (AnySanityDocument & { _id: "id2"; _type: "foo"; foo: string })
              | (AnySanityDocument & { _id: "id2"; _type: "qux"; qux: number })
              | null
            ),
          ]
        >
      >();
    });
  });

  describe("create", () => {
    it("requires a document without _ fields (optional _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({});

        expectType<Parameters<typeof client.create>[0]>().toEqual<
          | Omit<
              SetOptional<
                AnySanityDocument & { _type: "foo"; foo: string },
                "_id"
              >,
              "_createdAt" | "_rev" | "_updatedAt"
            >
          | Omit<
              SetOptional<
                AnySanityDocument & { _type: "qux"; qux: number },
                "_id"
              >,
              "_createdAt" | "_rev" | "_updatedAt"
            >
        >();

        return client.create({ _type: "foo", foo: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });
  });

  describe("createOrReplace", () => {
    it("requires a document without _ fields (required _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({});

        expectType<Parameters<typeof client.createOrReplace>[0]>().toEqual<
          | Omit<
              AnySanityDocument & { _type: "foo"; foo: string },
              "_createdAt" | "_rev" | "_updatedAt"
            >
          | Omit<
              AnySanityDocument & { _type: "qux"; qux: number },
              "_createdAt" | "_rev" | "_updatedAt"
            >
        >();

        return client.createOrReplace({ _type: "foo", _id: "id", foo: "foo" });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });
  });

  describe("createIfNotExists", () => {
    it("requires a document without _ fields (required _id) and returns the document", () => {
      const exec = () => {
        const client = createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({});

        expectType<Parameters<typeof client.createIfNotExists>[0]>().toEqual<
          | Omit<
              AnySanityDocument & { _type: "foo"; foo: string },
              "_createdAt" | "_rev" | "_updatedAt"
            >
          | Omit<
              AnySanityDocument & { _type: "qux"; qux: number },
              "_createdAt" | "_rev" | "_updatedAt"
            >
        >();

        return client.createIfNotExists({
          _type: "foo",
          _id: "id",
          foo: "foo",
        });
      };

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });
  });

  describe("delete", () => {
    it("returns a union of the documents and an asset document", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).delete("id");

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          | SanityAssetDocument
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });
  });

  describe("patch", () => {
    it("returns a union of the documents", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({})
          .patch("id")
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });

    describe("set", () => {
      it("filters the union to attrs", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id")
            .set({ foo: "bar" })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via PatchOperations", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id", { set: { foo: "bar" } })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    describe("setIfMissing", () => {
      it("filters the union to attrs", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id")
            .setIfMissing({ foo: "bar" })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via PatchOperations", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id", { setIfMissing: { foo: "bar" } })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    describe("diffMatchPatch", () => {
      it("filters the union to attrs", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id")
            .diffMatchPatch({ foo: "@@ -1,3 +1,3 @@\n-foo\n+bar\n" })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via PatchOperations", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id", {
              diffMatchPatch: { foo: "@@ -1,3 +1,3 @@\n-foo\n+bar\n" },
            })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    describe("unset", () => {
      it("filters the union to keys", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo?: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id")
            .unset(["foo"])
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo?: string }>
        >();
      });

      it("via PatchOperations", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo?: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id", { unset: ["foo"] })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo?: string }>
        >();
      });
    });

    describe("inc", () => {
      it("filters the union to attrs", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: number };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id")
            .inc({ foo: 1 })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: number }>
        >();
      });

      it("via PatchOperations", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: number };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id", { inc: { foo: 1 } })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: number }>
        >();
      });
    });

    describe("dec", () => {
      it("filters the union to attrs", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: number };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id")
            .dec({ foo: 1 })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: number }>
        >();
      });

      it("via PatchOperations", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: number };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .patch("id", { dec: { foo: 1 } })
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: number }>
        >();
      });
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
        }>({})
          .patch("id")
          .set({ foo: "bar" })
          .reset()
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });

    it.todo("try all of them with deep and JSON Paths");
  });

  describe("transaction", () => {
    it("returns an undefined", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({})
          .transaction()
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<Promise<never>>();
    });

    describe("create", () => {
      it("requires a document without _ fields (optional _id) and returns the document", () => {
        const exec = () => {
          const transaction = createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({}).transaction();

          expectType<Parameters<typeof transaction.create>[0]>().toEqual<
            | Omit<
                SetOptional<
                  AnySanityDocument & { _type: "foo"; foo: string },
                  "_id"
                >,
                "_createdAt" | "_rev" | "_updatedAt"
              >
            | Omit<
                SetOptional<
                  AnySanityDocument & { _type: "qux"; qux: number },
                  "_id"
                >,
                "_createdAt" | "_rev" | "_updatedAt"
              >
          >();

          return transaction.create({ _type: "foo", foo: "foo" }).commit();
        };

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via Mutation", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction([{ create: { _type: "foo", foo: "foo" } }])
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    describe("createOrReplace", () => {
      it("requires a document without _ fields (required _id) and returns the document", () => {
        const exec = () => {
          const transaction = createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({}).transaction();

          expectType<
            Parameters<typeof transaction.createOrReplace>[0]
          >().toEqual<
            | Omit<
                AnySanityDocument & { _type: "foo"; foo: string },
                "_createdAt" | "_rev" | "_updatedAt"
              >
            | Omit<
                AnySanityDocument & { _type: "qux"; qux: number },
                "_createdAt" | "_rev" | "_updatedAt"
              >
          >();

          return transaction
            .createOrReplace({ _type: "foo", _id: "id", foo: "foo" })
            .commit();
        };

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via Mutation", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction([
              { createOrReplace: { _type: "foo", _id: "id", foo: "foo" } },
            ])
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    describe("createIfNotExists", () => {
      it("requires a document without _ fields (required _id) and returns the document", () => {
        const exec = () => {
          const transaction = createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({}).transaction();

          expectType<
            Parameters<typeof transaction.createIfNotExists>[0]
          >().toEqual<
            | Omit<
                AnySanityDocument & { _type: "foo"; foo: string },
                "_createdAt" | "_rev" | "_updatedAt"
              >
            | Omit<
                AnySanityDocument & { _type: "qux"; qux: number },
                "_createdAt" | "_rev" | "_updatedAt"
              >
          >();

          return transaction
            .createIfNotExists({ _type: "foo", _id: "id", foo: "foo" })
            .commit();
        };

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via Mutation", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction([
              { createIfNotExists: { _type: "foo", _id: "id", foo: "foo" } },
            ])
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    describe("delete", () => {
      it("returns a union of the documents and an asset document", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction()
            .delete("id")
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<
            | SanityAssetDocument
            | (AnySanityDocument & { _type: "foo"; foo: string })
            | (AnySanityDocument & { _type: "qux"; qux: number })
          >
        >();
      });

      it("via Mutation", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction([{ delete: { id: "id" } }])
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<
            | (AnySanityDocument & { _type: "foo"; foo: string })
            | (AnySanityDocument & { _type: "qux"; qux: number })
            | (AnySanityDocument & SanityAssetDocument)
          >
        >();
      });
    });

    describe("patch", () => {
      it("returns what a patch would return", () => {
        const exec = () => {
          const client = createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({});

          return client
            .transaction()
            .patch(client.patch("id").set({ foo: "foo" }))
            .commit();
        };

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("can be defined inline", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction()
            .patch("id", (patch) => patch.set({ foo: "foo" }))
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });

      it("via Mutation", () => {
        const exec = () =>
          createClient<{
            foo: AnySanityDocument & { _type: "foo"; foo: string };
            qux: AnySanityDocument & { _type: "qux"; qux: number };
          }>({})
            .transaction([{ patch: { id: "id", set: { foo: "foo" } } }])
            .commit();

        expectType<ReturnType<typeof exec>>().toStrictEqual<
          // @ts-expect-error TODO https://github.com/saiichihashimoto/sanity-typed/issues/286
          Promise<AnySanityDocument & { _type: "foo"; foo: string }>
        >();
      });
    });

    it("returns undefined after reset", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({})
          .transaction()
          .create({ _type: "foo", foo: "foo" })
          .reset()
          .commit();

      expectType<ReturnType<typeof exec>>().toStrictEqual<Promise<undefined>>();
    });
  });

  describe("mutate", () => {
    it("returns a union of the documents", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).mutate([]);

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<
          | (AnySanityDocument & { _type: "foo"; foo: string })
          | (AnySanityDocument & { _type: "qux"; qux: number })
        >
      >();
    });

    it("filters to Mutation result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).mutate([
          {
            create: {
              _type: "foo",
              // @ts-expect-error TODO https://github.com/saiichihashimoto/sanity-typed/issues/286
              foo: "foo",
            },
          },
        ]);

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        // @ts-expect-error TODO https://github.com/saiichihashimoto/sanity-typed/issues/286
        Promise<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });

    it("filters to Patch result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).mutate(new Patch("id").set({ foo: "bar" }));

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });

    it("filters to Transaction result", () => {
      const exec = () =>
        createClient<{
          foo: AnySanityDocument & { _type: "foo"; foo: string };
          qux: AnySanityDocument & { _type: "qux"; qux: number };
        }>({}).mutate(new Transaction().create({ _type: "foo", foo: "foo" }));

      expectType<ReturnType<typeof exec>>().toStrictEqual<
        Promise<AnySanityDocument & { _type: "foo"; foo: string }>
      >();
    });
  });
});
