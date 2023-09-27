import { createClient as createClientNative } from "@sanity/client";
import type {
  BaseMutationOptions,
  ClientConfig,
  FilteredResponseQueryOptions,
  InitializedClientConfig as InitializedClientConfigNative,
  MultipleMutationResult,
  MutationSelection,
  ObservableSanityClient as ObservableSanityClientNative,
  QueryParams,
  RawQueryResponse as RawQueryResponseNative,
  SanityClient as SanityClientNative,
  SingleMutationResult,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type { Observable } from "rxjs";
import type { IsNever, Merge, SetOptional, WritableDeep } from "type-fest";

import type { ExecuteQuery, RootScope } from "@sanity-typed/groq";
import type { SanityDocument } from "@sanity-typed/types";

declare const README: unique symbol;

type AnySanityDocument = Omit<SanityDocument, "_type"> & { _type: string };

export type InitializedClientConfig<TClientConfig extends ClientConfig> = Merge<
  InitializedClientConfigNative,
  TClientConfig
>;

export type RawQueryResponse<Result, Query extends string = string> = Merge<
  RawQueryResponseNative<Result>,
  {
    query: Query;
  }
>;

type MaybeRawQueryResponse<
  Result,
  Query extends string,
  Options extends
    | FilteredResponseQueryOptions
    | UnfilteredResponseQueryOptions
    | undefined
> = Options extends UnfilteredResponseQueryOptions
  ? RawQueryResponse<Result, Query>
  : Result;

type GetDocuments<Ids extends string[], TDocument extends AnySanityDocument> = {
  [index in keyof Ids]:
    | (TDocument extends never ? never : TDocument & { _id: Ids[index] })
    | null;
};

type PromiseOrObservable<
  TIsPromise extends boolean,
  T
> = TIsPromise extends true ? Promise<T> : Observable<T>;

type OverrideSanityClient<
  TSanityClient,
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument,
  TIsPromise extends boolean
> = Omit<
  TSanityClient,
  | "clone"
  | "config"
  | "create"
  | "createIfNotExists"
  | "createOrReplace"
  | "delete"
  | "fetch"
  | "getDocument"
  | "getDocuments"
  | "observable"
  | "withConfig"
> & {
  clone: () => OverrideSanityClient<
    TSanityClient,
    TClientConfig,
    TDocument,
    TIsPromise
  >;
  config: <
    const NewConfig extends Partial<ClientConfig> | undefined = undefined
  >(
    newConfig?: NewConfig
  ) => NewConfig extends undefined
    ? InitializedClientConfig<WritableDeep<TClientConfig>>
    : OverrideSanityClient<
        TSanityClient,
        Merge<TClientConfig, NewConfig>,
        TDocument,
        TIsPromise
      >;
  create: <
    const Doc extends Omit<
      SetOptional<TDocument, "_id">,
      "_createdAt" | "_rev" | "_updatedAt"
    > & { _type: string },
    const Options extends BaseMutationOptions & {
      returnDocuments?: boolean;
      returnFirst?: boolean;
    }
  >(
    document: Doc,
    options?: Options
  ) => PromiseOrObservable<
    TIsPromise,
    Options extends { returnDocuments: false; returnFirst: false }
      ? MultipleMutationResult
      : Options extends { returnFirst: false }
      ? Extract<TDocument, { _type: Doc["_type"] }>[]
      : Options extends { returnDocuments: false }
      ? SingleMutationResult
      : Extract<TDocument, { _type: Doc["_type"] }>
  >;
  createIfNotExists: <
    const Doc extends Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
      _type: string;
    },
    const Options extends BaseMutationOptions & {
      returnDocuments?: boolean;
      returnFirst?: boolean;
    }
  >(
    document: Doc,
    options?: Options
  ) => PromiseOrObservable<
    TIsPromise,
    Options extends { returnDocuments: false; returnFirst: false }
      ? MultipleMutationResult
      : Options extends { returnFirst: false }
      ? Extract<TDocument, { _type: Doc["_type"] }>[]
      : Options extends { returnDocuments: false }
      ? SingleMutationResult
      : Extract<TDocument, { _type: Doc["_type"] }>
  >;
  createOrReplace: <
    const Doc extends Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
      _type: string;
    },
    const Options extends BaseMutationOptions & {
      returnDocuments?: boolean;
      returnFirst?: boolean;
    }
  >(
    document: Doc,
    options?: Options
  ) => PromiseOrObservable<
    TIsPromise,
    Options extends { returnDocuments: false; returnFirst: false }
      ? MultipleMutationResult
      : Options extends { returnFirst: false }
      ? Extract<TDocument, { _type: Doc["_type"] }>[]
      : Options extends { returnDocuments: false }
      ? SingleMutationResult
      : Extract<TDocument, { _type: Doc["_type"] }>
  >;
  delete: <
    const Options extends BaseMutationOptions & {
      returnDocuments?: boolean;
      returnFirst?: boolean;
    }
  >(
    selection: MutationSelection | string,
    options?: Options
  ) => PromiseOrObservable<
    TIsPromise,
    Options extends { returnDocuments: false; returnFirst: false }
      ? MultipleMutationResult
      : Options extends { returnFirst: false }
      ? TDocument[]
      : Options extends { returnDocuments: false }
      ? SingleMutationResult
      : TDocument
  >;
  fetch: <
    const Query extends string,
    const Q = QueryParams,
    const Options extends
      | FilteredResponseQueryOptions
      | UnfilteredResponseQueryOptions
      | undefined = undefined
  >(
    query: Query,
    params?: Q,
    options?: Options
  ) => PromiseOrObservable<
    TIsPromise,
    MaybeRawQueryResponse<
      ExecuteQuery<
        Query,
        RootScope<{
          client: WritableDeep<TClientConfig>;
          dataset: (TDocument extends never
            ? never
            : TClientConfig extends { perspective: "previewDrafts" }
            ? TDocument & { _originalId: string }
            : TDocument)[];
          delta: { after: null; before: null };
          identity: string;
          parameters: NonNullable<Q>;
        }>
      >,
      Query,
      Options
    >
  >;
  getDocument: <const Id extends string>(
    id: Id,
    options?: Parameters<SanityClientNative["getDocument"]>[1]
  ) => PromiseOrObservable<
    TIsPromise,
    (TDocument extends never ? never : TDocument & { _id: Id }) | undefined
  >;
  getDocuments: <const Ids extends readonly string[]>(
    ids: Ids,
    options?: Parameters<SanityClientNative["getDocuments"]>[1]
  ) => PromiseOrObservable<
    TIsPromise,
    GetDocuments<WritableDeep<Ids>, TDocument>
  >;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursive type
  observable: ObservableSanityClient<TClientConfig, TDocument>;
  withConfig: <const NewConfig extends Partial<ClientConfig>>(
    newConfig?: NewConfig
  ) => OverrideSanityClient<
    TSanityClient,
    Merge<TClientConfig, NewConfig>,
    TDocument,
    TIsPromise
  >;
};

export type ObservableSanityClient<
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument
> = OverrideSanityClient<
  ObservableSanityClientNative,
  TClientConfig,
  TDocument,
  false
>;

export type SanityClient<
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument
> = OverrideSanityClient<SanityClientNative, TClientConfig, TDocument, true>;

/**
 * Unfortunately, this has to have a very weird function signature due to this typescript issue:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export const createClient =
  <SanityValues extends { [type: string]: any }>() =>
  <const Config extends ClientConfig>(config: Config) =>
    createClientNative(config) as unknown as SanityClient<
      Config,
      Extract<SanityValues[keyof SanityValues], AnySanityDocument>
    >;

export const castToTyped =
  <SanityValues extends { [type: string]: any } = never>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not actually used
    ...args: IsNever<SanityValues> extends false
      ? []
      : [
          error: {
            [README]: "⛔️ Without providing a SanityValues, castToTyped is meaningless. eg. castToTyped<SanityValues>()(untypedClient) ⛔️";
          }
        ]
  ) =>
  <Untyped extends SanityClientNative, const Config extends ClientConfig>(
    untyped: Untyped,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not actually used
    config?: Config
  ) =>
    untyped as SanityClient<
      Config,
      Extract<SanityValues[keyof SanityValues], AnySanityDocument>
    >;

export const castFromTyped = <TSanityClient extends SanityClient<any, any>>(
  typed: TSanityClient
) => typed as unknown as SanityClientNative;
