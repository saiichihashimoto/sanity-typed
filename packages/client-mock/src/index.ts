import { faker } from "@faker-js/faker";
import type {
  BaseMutationOptions,
  ClientConfig,
  FilteredResponseQueryOptions,
  MutationSelection,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type { Merge, SetOptional, WritableDeep } from "type-fest";

import type {
  InitializedClientConfig,
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
  <const TClientConfig extends ClientConfig>(
    config: TClientConfig
  ): SanityClient<
    TClientConfig,
    SanityValuesToDocumentUnion<SanityValues, TClientConfig>
  > => {
    type TDocument = AnySanityDocument &
      SanityValuesToDocumentUnion<SanityValues, TClientConfig>;

    const datasetById = new Map<string, TDocument>(
      options?.dataset?.map((doc) => [doc._id, doc] as [string, TDocument]) ??
        []
    );

    // @ts-expect-error -- FIXME
    return {
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
      patch: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["patch"],
      transaction: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["transaction"],
      mutate: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["mutate"],
      observable: {} as unknown as SanityClient<
        TClientConfig,
        SanityValuesToDocumentUnion<SanityValues, TClientConfig>
      >["observable"],
    };
  };
