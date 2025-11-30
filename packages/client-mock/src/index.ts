import { faker } from "@faker-js/faker";
import type {
  BaseMutationOptions,
  ClientConfig,
  FilteredResponseQueryOptions,
  InitializedClientConfig,
  MutationSelection,
  PatchSelection,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import { applyPatches, parsePatch } from "@sanity/diff-match-patch";
import type {
  GroqBuilder,
  createGroqBuilder as createGroqBuilderType,
} from "groq-builder";
import { bindAll, flow, identity, omit } from "lodash/fp";
import type { SetOptional, WritableDeep } from "type-fest";

import {
  ObservableTransaction,
  Patch,
  Transaction,
} from "@sanity-typed/client";
import type {
  Mutation,
  PatchOperations,
  PatchType,
  SanityClient,
  TransactionType,
} from "@sanity-typed/client";
import type {
  GetDocuments,
  MutationDoc,
  MutationOptions,
} from "@sanity-typed/client/src/internal";
import { evaluate, parse } from "@sanity-typed/groq-js";
import type { DocumentValues, referenced } from "@sanity-typed/types";
import type { AnySanityDocument } from "@sanity-typed/types/src/internal";
import { reduceAcc } from "@sanity-typed/utils";

type MaybeFunction<T> = T | (() => T);

type MaybePromise<T> = PromiseLike<T> | PromiseLike<T> | T;

// const isPatch = (patch: unknown): patch is PatchType<any, any, any, any> =>
//   patch instanceof Patch;

const isTransaction = <
  TDocuments extends AnySanityDocument[],
  TOriginalDocument extends AnySanityDocument,
  TIsPromise extends boolean,
  TIsScoped extends boolean
>(
  transaction: unknown
): transaction is TransactionType<
  TDocuments,
  TOriginalDocument,
  TIsPromise,
  TIsScoped
> =>
  transaction instanceof Transaction ||
  transaction instanceof ObservableTransaction;

export const createClient = <
  const SanityValues extends { [type: string]: any }
>(
  config: ClientConfig & {
    documents: MaybeFunction<MaybePromise<DocumentValues<SanityValues>[]>>;
  }
) => {
  type TDocument = DocumentValues<SanityValues>;

  const datasetByIdPromise = (async () =>
    new Map<string, TDocument>(
      (
        await (typeof config.documents === "function"
          ? config.documents()
          : config.documents)
      ).map((doc) => [doc._id, doc] as [string, TDocument])
    ))();

  let clientQ:
    | GroqBuilder<
        { [key in never]: never },
        {
          documentTypes: DocumentValues<SanityValues>;
          referenceSymbol: typeof referenced;
        }
      >
    | undefined;

  try {
    const {
      createGroqBuilder,
      // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, unicorn/prefer-module -- Optional Dependency
    } = require("groq-builder") as {
      createGroqBuilder: typeof createGroqBuilderType;
    };

    clientQ = createGroqBuilder<{
      documentTypes: DocumentValues<SanityValues>;
      referenceSymbol: typeof referenced;
    }>();
  } catch {
    /* empty */
  }

  const client: SanityClient<DocumentValues<SanityValues>> = {
    ...({} as Pick<
      SanityClient<DocumentValues<SanityValues>>,
      | "assets"
      | "dataRequest"
      | "datasets"
      | "getDataUrl"
      | "getUrl"
      | "projects"
      | "request"
      | "users"
    >),
    clone: () => createClient<SanityValues>(config),
    config: <
      const NewConfig extends Partial<ClientConfig> | undefined = undefined
    >(
      newConfig?: NewConfig
    ) =>
      (!newConfig
        ? {
            // HACK Bogus values
            apiHost: "apiHost",
            apiVersion: "apiVersion",
            cdnUrl: "internal, don't use",
            isDefaultApi: true,
            url: "internal, don't use",
            useCdn: true,
            useProjectHostname: true,
            ...config,
          }
        : createClient<SanityValues>({
            ...config,
            ...newConfig,
          })) as NewConfig extends undefined
        ? InitializedClientConfig
        : SanityClient<TDocument>,
    withConfig: <const NewConfig extends Partial<ClientConfig>>(
      newConfig?: NewConfig
    ) =>
      createClient<SanityValues>({
        ...config,
        ...newConfig,
      }),
    fetch: async <
      const TQuery extends string,
      const TQueryParams extends { [param: string]: unknown },
      const TOptions extends
        | FilteredResponseQueryOptions
        | UnfilteredResponseQueryOptions = FilteredResponseQueryOptions,
      const TResult = never
    >(
      queryOrBuilder:
        | TQuery
        | ((
            q: GroqBuilder<
              { [key in never]: never },
              {
                documentTypes: DocumentValues<SanityValues>;
                referenceSymbol: typeof referenced;
              }
            >
          ) => GroqBuilder<
            TResult,
            {
              documentTypes: DocumentValues<SanityValues>;
              referenceSymbol: typeof referenced;
            }
          >),
      params?: TQueryParams,
      options?: TOptions
    ) => {
      const start = performance.now();
      if (typeof queryOrBuilder !== "string" && !clientQ) {
        throw new TypeError(
          "Cannot pass a function to `fetch` unless `groq-query` is installed"
        );
      }

      const { query, parse: parseResult } = bindAll(
        ["parse"],
        typeof queryOrBuilder === "string"
          ? { query: queryOrBuilder, parse: (value: unknown) => value }
          : queryOrBuilder(clientQ!)
      );

      const result = parseResult(
        // @ts-expect-error TODO Not sure
        await (
          await evaluate(
            // @ts-expect-error TODO Not sure
            parse(query, { params }),
            {
              params,
              dataset: [...(await datasetByIdPromise).values()],
              // @ts-expect-error TODO Not sure
              sanity: config,
            }
          )
        ).get()
      );
      const end = performance.now();

      const { filterResponse = true } = options ?? {};

      return !filterResponse
        ? // @ts-expect-error TODO Not sure
          { result, query, ms: end - start }
        : result;
    },
    listen: {} as SanityClient<DocumentValues<SanityValues>>["listen"],
    getDocument: async <const TId extends string>(id: TId) =>
      (await datasetByIdPromise).get(id),
    getDocuments: async <const TIds extends readonly string[]>(ids: TIds) => {
      const datasetById = await datasetByIdPromise;

      return ids.map((id) => datasetById.get(id) ?? null) as GetDocuments<
        TDocument,
        WritableDeep<TIds>
      >;
    },
    create: async <
      Doc extends TDocument extends never
        ? never
        : Omit<
            SetOptional<TDocument, "_id">,
            "_createdAt" | "_rev" | "_updatedAt"
          >,
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      document: Doc,
      options?: TOptions
    ) => client.mutate({ create: document } as any, options) as any,
    createOrReplace: async <
      Doc extends TDocument extends never
        ? never
        : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt">,
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      document: Doc,
      options?: TOptions
    ) => client.mutate({ createOrReplace: document } as any, options) as any,
    createIfNotExists: async <
      Doc extends TDocument extends never
        ? never
        : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt">,
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      document: Doc,
      options?: TOptions
    ) => client.mutate({ createIfNotExists: document } as any, options) as any,
    delete: async <
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      idOrSelection: MutationSelection | string,
      options?: TOptions
    ) =>
      client.mutate(
        {
          delete:
            typeof idOrSelection === "string"
              ? { id: idOrSelection }
              : idOrSelection,
        } as any,
        options
      ) as any,
    patch: <
      TAttrs extends Partial<TDocument>,
      TKeys extends TDocument extends never ? never : (keyof TDocument)[]
    >(
      idOrSelection: PatchSelection,
      operations?: PatchOperations<TDocument, TAttrs, TKeys>
    ) =>
      new Patch(idOrSelection, operations, client as any) as PatchType<
        Extract<TDocument, Partial<TAttrs>> &
          (TDocument extends never
            ? never
            : TKeys extends never
            ? never
            : TKeys[number] extends keyof TDocument
            ? TDocument
            : never),
        TDocument,
        true,
        true
      >,
    transaction: <
      TMutations extends Mutation<
        TDocument,
        Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
          _type: string;
        }
      >[] = []
    >(
      operations?: TMutations
    ) =>
      new Transaction(operations, client as any) as TransactionType<
        AnySanityDocument[] & {
          [index in keyof TMutations]: MutationDoc<
            TDocument,
            TMutations[index]
          >;
        },
        TDocument,
        true,
        true
      >,
    mutate: (async <
      Doc extends AnySanityDocument,
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      operations:
        | Mutation<
            TDocument,
            Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
              _type: string;
            }
          >
        | Mutation<
            TDocument,
            Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
              _type: string;
            }
          >[]
        | PatchType<Doc, AnySanityDocument, true, false>
        | TransactionType<[Doc, ...any[]], AnySanityDocument, true, false>,
      options?: TOptions
    ) => {
      if (Array.isArray(operations)) {
        return operations.map(async (operation) =>
          client.mutate(operation, options)
        )[0];
      }

      if (isTransaction(operations)) {
        return client.mutate(operations.serialize() as any, options);
      }

      const datasetById = await datasetByIdPromise;

      if ("create" in operations) {
        const { create: document } = operations;

        const now = new Date();
        const _id =
          ("_id" in document ? document._id : undefined) ?? faker.string.uuid();

        const doc = {
          ...document,
          _id,
          _createdAt: now.toISOString(),
          _rev: faker.string.alphanumeric(22),
          _updatedAt: now.toISOString(),
        } as Extract<TDocument, { _type: Doc["_type"] }>;

        // eslint-disable-next-line fp/no-unused-expression -- Map
        datasetById.set(_id, doc);

        return doc;
      }

      if ("createOrReplace" in operations) {
        const { createOrReplace: document } = operations;

        const now = new Date();

        const doc = {
          ...document,
          _createdAt: now.toISOString(),
          _rev: faker.string.alphanumeric(22),
          _updatedAt: now.toISOString(),
        } as Extract<TDocument, { _type: Doc["_type"] }>;

        // eslint-disable-next-line fp/no-unused-expression -- Map
        datasetById.set(document._id, doc);

        return doc;
      }

      if ("createIfNotExists" in operations) {
        const { createIfNotExists: document } = operations;

        const now = new Date();

        const previousDoc = datasetById.get(document._id);
        const newDoc = previousDoc
          ? undefined
          : ({
              ...document,
              _createdAt: now.toISOString(),
              _rev: faker.string.alphanumeric(22),
              _updatedAt: now.toISOString(),
            } as Extract<TDocument, { _type: Doc["_type"] }>);

        if (newDoc) {
          // eslint-disable-next-line fp/no-unused-expression -- Map
          datasetById.set(document._id, newDoc);
        }

        return (newDoc ?? previousDoc)!;
      }

      if ("delete" in operations) {
        const { delete: mutationSelection } = operations;
        const { id: idOrSelection } = mutationSelection as { id: string };

        const doc = datasetById.get(idOrSelection as string)!;

        // eslint-disable-next-line fp/no-unused-expression -- Map
        datasetById.delete(idOrSelection as string);

        return doc;
      }

      const patchOperation =
        "patch" in operations ? operations.patch : operations.serialize();

      const previousDoc = datasetById.get(
        // @ts-expect-error TODO Not sure
        patchOperation.id as string
      )!;

      const newDoc = flow(
        flow(
          identity<TDocument>,
          !Object.keys(patchOperation.setIfMissing ?? {}).length
            ? identity<TDocument>
            : (doc) =>
                ({
                  ...patchOperation.setIfMissing,
                  ...doc,
                } as TDocument),
          !Object.keys(patchOperation.set ?? {}).length
            ? identity<TDocument>
            : (doc) =>
                ({
                  ...doc,
                  ...patchOperation.set,
                } as TDocument),
          reduceAcc(Object.keys(patchOperation.inc ?? {}), (doc, key) => ({
            ...doc,
            [key]: (doc[key] ?? 0) + (patchOperation.inc![key] as number),
          })),
          reduceAcc(Object.keys(patchOperation.dec ?? {}), (doc, key) => ({
            ...doc,
            [key]: (doc[key] ?? 0) - (patchOperation.dec![key] as number),
          })),
          reduceAcc(
            Object.keys(patchOperation.diffMatchPatch ?? {}),
            (doc, key) => ({
              ...doc,
              [key]: applyPatches(
                parsePatch(patchOperation.diffMatchPatch![key] as string),
                doc[key]
              )[0],
            })
          ),
          !patchOperation.unset?.length
            ? identity<TDocument>
            : (doc) => omit(patchOperation.unset ?? [], doc) as TDocument
        ),
        (doc) =>
          doc === previousDoc
            ? doc
            : {
                ...doc,
                _rev: faker.string.alphanumeric(22),
                _updatedAt: new Date().toISOString(),
              }
      )(previousDoc);

      if (previousDoc === newDoc) {
        return previousDoc;
      }

      // eslint-disable-next-line fp/no-unused-expression -- Map
      datasetById.set(newDoc._id, newDoc);

      return newDoc;
    }) as SanityClient<DocumentValues<SanityValues>>["mutate"],
    observable: {} as SanityClient<DocumentValues<SanityValues>>["observable"],
  } as SanityClient<DocumentValues<SanityValues>>;

  return client;
};
