import { faker } from "@faker-js/faker";
import type {
  BaseMutationOptions,
  ClientConfig,
  FilteredResponseQueryOptions,
  MutationSelection,
  PatchOperations as PatchOperationsNative,
  PatchSelection,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import { applyPatches, parsePatch } from "@sanity/diff-match-patch";
import { flow, identity, omit, reduce } from "lodash/fp";
import type { Merge, SetOptional, WritableDeep } from "type-fest";

import { Patch } from "@sanity-typed/client";
import type {
  InitializedClientConfig,
  Mutation,
  PatchOperations,
  PatchType,
  SanityClient,
} from "@sanity-typed/client";
import type {
  GetDocuments,
  MutationOptions,
  SanityValuesToDocumentUnion,
} from "@sanity-typed/client/src/internal";
import { evaluate, parse } from "@sanity-typed/groq-js";
import type { DocumentValues, SanityDocument } from "@sanity-typed/types";

type AnySanityDocument = Merge<SanityDocument, { _type: string }>;

const reduceAcc =
  <T, TResult>(
    collection: T[] | null | undefined,
    // eslint-disable-next-line promise/prefer-await-to-callbacks -- lodash/fp reorder
    callback: (prev: TResult, current: T) => TResult
  ) =>
  (accumulator: TResult) =>
    reduce(callback, accumulator, collection);

/**
 * Unfortunately, this has to have a very weird function signature due to this typescript issue:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export const createClient =
  <SanityValues extends { [type: string]: any }>(
    options: {
      dataset?: DocumentValues<SanityValues>[];
    } = {}
  ) =>
  <const TClientConfig extends ClientConfig>(config: TClientConfig) => {
    type TDocument = AnySanityDocument &
      SanityValuesToDocumentUnion<SanityValues, TClientConfig>;

    const datasetById = new Map<string, TDocument>(
      options?.dataset?.map((doc) => [doc._id, doc] as [string, TDocument]) ??
        []
    );

    // @ts-expect-error -- FIXME
    const client: SanityClient<
      TClientConfig,
      SanityValuesToDocumentUnion<SanityValues, TClientConfig>
    > = {
      ...({} as unknown as Pick<
        SanityClient<
          TClientConfig,
          SanityValuesToDocumentUnion<SanityValues, TClientConfig>
        >,
        | "assets"
        | "dataRequest"
        | "datasets"
        | "getDataUrl"
        | "getUrl"
        | "projects"
        | "request"
        | "users"
      >),
      clone: () => createClient<SanityValues>(options)(config),
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
          : createClient<SanityValues>(options)({
              ...config,
              ...newConfig,
            })) as NewConfig extends undefined
          ? InitializedClientConfig<WritableDeep<TClientConfig>>
          : SanityClient<Merge<TClientConfig, NewConfig>, TDocument>,
      withConfig: <const NewConfig extends Partial<ClientConfig>>(
        newConfig?: NewConfig
      ) =>
        createClient<SanityValues>(options)({
          ...config,
          ...newConfig,
        } as unknown as Merge<TClientConfig, NewConfig>),
      fetch: async <
        const TQuery extends string,
        const TQueryParams extends { [param: string]: unknown },
        const TOptions extends
          | FilteredResponseQueryOptions
          | UnfilteredResponseQueryOptions = FilteredResponseQueryOptions
      >(
        query: TQuery,
        params?: TQueryParams,
        options?: TOptions
      ) => {
        const start = performance.now();
        // @ts-expect-error -- FIXME
        const result = await (
          await evaluate(
            // @ts-expect-error -- FIXME
            parse(query),
            {
              params,
              dataset: [...datasetById.values()],
              // @ts-expect-error -- FIXME
              sanity: config,
            }
          )
        ).get();
        const end = performance.now();

        const { filterResponse = true } = options ?? {};

        return !filterResponse
          ? // @ts-expect-error -- FIXME
            { result, query, ms: end - start }
          : result;
      },
      listen: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["listen"],
      getDocument: async <const TId extends string>(id: TId) =>
        datasetById.get(id),
      getDocuments: async <const TIds extends readonly string[]>(ids: TIds) =>
        ids.map((id) => datasetById.get(id) ?? null) as GetDocuments<
          TDocument,
          WritableDeep<TIds>
        >,
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FIXME
        options?: TOptions
      ) => {
        const now = new Date();
        const _id = document._id ?? faker.string.uuid();

        const doc = {
          ...document,
          _id,
          _createdAt: now.toISOString(),
          _rev: faker.string.alphanumeric(22),
          _updatedAt: now.toISOString(),
        } as Extract<
          TDocument,
          {
            _type: // @ts-expect-error -- FIXME
            Doc["_type"];
          }
        >;

        // eslint-disable-next-line fp/no-unused-expression -- Map
        datasetById.set(_id, doc);

        return doc;
      },
      createOrReplace: async <
        Doc extends TDocument extends never
          ? never
          : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt">,
        const TOptions extends MutationOptions = BaseMutationOptions
      >(
        document: Doc,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FIXME
        options?: TOptions
      ) => {
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
      },
      createIfNotExists: async <
        Doc extends TDocument extends never
          ? never
          : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt">,
        const TOptions extends MutationOptions = BaseMutationOptions
      >(
        document: Doc,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FIXME
        options?: TOptions
      ) => {
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
      },
      delete: async <
        const TOptions extends MutationOptions = BaseMutationOptions
      >(
        idOrSelection: MutationSelection | string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FIXME
        options?: TOptions
      ) => {
        const doc = datasetById.get(idOrSelection as string)!;

        // eslint-disable-next-line fp/no-unused-expression -- Map
        datasetById.delete(idOrSelection as string);

        return doc;
      },
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
      transaction: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["transaction"],
      mutate: (<
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
          | PatchType<Doc, AnySanityDocument, true, false>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FIXME
        options?: TOptions
      ) => {
        const patchOperation =
          operations instanceof Patch
            ? (
                operations as PatchType<Doc, AnySanityDocument, true, false>
              ).serialize()
            : "patch" in operations
            ? operations.patch
            : undefined;

        if (patchOperation) {
          const previousDoc = datasetById.get(
            // @ts-expect-error -- FIXME
            patchOperation.id as string
          )!;

          const newDoc = flow(
            flow(
              (doc: TDocument) => doc,
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
        }

        return operations;
      }) as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["mutate"],
      observable: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["observable"],
    };

    return client;
  };
