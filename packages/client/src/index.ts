import {
  Patch as PatchNative,
  createClient as createClientNative,
} from "@sanity/client";
import type {
  BaseMutationOptions,
  ClientConfig,
  FilteredResponseQueryOptions,
  InitializedClientConfig as InitializedClientConfigNative,
  ListenEvent as ListenEventNative,
  ListenOptions,
  MultipleMutationResult,
  Mutation,
  MutationEvent as MutationEventNative,
  MutationSelection,
  ObservableSanityClient as ObservableSanityClientNative,
  PatchMutationOperation,
  PatchOperations,
  PatchSelection,
  QueryParams,
  RawQueryResponse as RawQueryResponseNative,
  SanityAssetDocument,
  SanityClient as SanityClientNative,
  SingleMutationResult,
  Transaction,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type { Observable } from "rxjs";
import type { IsNever, Merge, SetOptional, WritableDeep } from "type-fest";

import type { ExecuteQuery, RootScope } from "@sanity-typed/groq";
import type { SanityDocument } from "@sanity-typed/types";

declare const README: unique symbol;

type AnySanityDocument = Omit<SanityDocument, "_type"> & { _type: string };

type PromiseOrObservable<
  TIsPromise extends boolean,
  T
> = TIsPromise extends true ? Promise<T> : Observable<T>;

type MutationOptions = BaseMutationOptions & {
  returnDocuments?: boolean;
  returnFirst?: boolean;
};

type MutationResult<
  Value,
  TOptions extends MutationOptions | undefined
> = TOptions extends { returnDocuments: false; returnFirst: false }
  ? MultipleMutationResult
  : TOptions extends { returnFirst: false }
  ? Value[]
  : TOptions extends { returnDocuments: false }
  ? SingleMutationResult
  : Value;

export type PatchType<
  TDocument extends AnySanityDocument,
  TOriginalDocument extends AnySanityDocument,
  TIsPromise extends boolean,
  /**
   * If TIsScoped extends true, TDocument is a union of types that we're removing from
   * If TIsScoped extends true, TDocument is AnySanityDocument that we're adding to
   */
  TIsScoped extends boolean
> = {
  append: (
    ...args: Parameters<PatchNative["append"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  clone: (
    ...args: Parameters<PatchNative["clone"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  commit: TIsScoped extends false
    ? never
    : <const TOptions extends MutationOptions | undefined = undefined>(
        options?: TOptions
      ) => PromiseOrObservable<TIsPromise, MutationResult<TDocument, TOptions>>;
  dec: <
    TAttrs extends TIsScoped extends true
      ? Partial<TDocument & { [key: string]: number }>
      : any
  >(
    attrs: TAttrs
  ) => PatchType<
    TIsScoped extends true
      ? Extract<TDocument, Partial<TAttrs>>
      : TAttrs & TDocument,
    TOriginalDocument,
    TIsPromise,
    TIsScoped
  >;
  diffMatchPatch: (
    ...args: Parameters<PatchNative["diffMatchPatch"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  ifRevisionId: (
    ...args: Parameters<PatchNative["ifRevisionId"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  inc: <
    TAttrs extends TIsScoped extends true
      ? Partial<TDocument & { [key: string]: number }>
      : any
  >(
    attrs: TAttrs
  ) => PatchType<
    TIsScoped extends true
      ? Extract<TDocument, Partial<TAttrs>>
      : TAttrs & TDocument,
    TOriginalDocument,
    TIsPromise,
    TIsScoped
  >;
  insert: (
    ...args: Parameters<PatchNative["insert"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  prepend: (
    ...args: Parameters<PatchNative["prepend"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  reset: (
    ...args: Parameters<PatchNative["reset"]>
  ) => PatchType<TOriginalDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  serialize: () => PatchMutationOperation;
  set: <TAttrs extends TIsScoped extends true ? Partial<TDocument> : any>(
    attrs: TAttrs
  ) => PatchType<
    TIsScoped extends true
      ? Extract<TDocument, Partial<TAttrs>>
      : TAttrs & TDocument,
    TOriginalDocument,
    TIsPromise,
    TIsScoped
  >;
  setIfMissing: <
    TAttrs extends TIsScoped extends true ? Partial<TDocument> : any
  >(
    attrs: TAttrs
  ) => PatchType<
    TIsScoped extends true
      ? Extract<TDocument, Partial<TAttrs>>
      : TAttrs & TDocument,
    TOriginalDocument,
    TIsPromise,
    TIsScoped
  >;
  splice: (
    ...args: Parameters<PatchNative["splice"]>
  ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
  toJSON: () => PatchMutationOperation;
  unset: <
    TAttrs extends TDocument extends never
      ? never
      : TIsScoped extends true
      ? (keyof TDocument)[]
      : string[]
  >(
    attrs: TAttrs
  ) => PatchType<
    TIsScoped extends true
      ? TDocument extends never
        ? never
        : TAttrs[number] extends keyof TDocument
        ? TDocument
        : never
      : TDocument & { [key in TAttrs[number]]: any },
    TOriginalDocument,
    TIsPromise,
    TIsScoped
  >;
};

export const Patch = PatchNative as unknown as new (
  ...args: ConstructorParameters<typeof PatchNative>
) => PatchType<AnySanityDocument, AnySanityDocument, any, false>;

export type InitializedClientConfig<TClientConfig extends ClientConfig> = Merge<
  InitializedClientConfigNative,
  TClientConfig
>;

export type MutationEvent<TDocument extends AnySanityDocument> = Omit<
  MutationEventNative,
  "previous" | "result"
> & {
  previous?: TDocument | null;
  result?: TDocument;
};

export type ListenEvent<TDocument extends AnySanityDocument> =
  | Exclude<ListenEventNative<any>, MutationEventNative<any>>
  | MutationEvent<TDocument>;

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

type GetDocuments<TDocument extends AnySanityDocument, Ids extends string[]> = {
  [index in keyof Ids]: (TDocument & { _id: Ids[index] }) | null;
};

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
  | "mutate"
  | "observable"
  | "patch"
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
    const TOptions extends MutationOptions | undefined = undefined
  >(
    document: Doc,
    options?: TOptions
  ) => PromiseOrObservable<
    TIsPromise,
    MutationResult<Extract<TDocument, { _type: Doc["_type"] }>, TOptions>
  >;
  createIfNotExists: <
    const Doc extends Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
      _type: string;
    },
    const TOptions extends MutationOptions | undefined = undefined
  >(
    document: Doc,
    options?: TOptions
  ) => PromiseOrObservable<
    TIsPromise,
    MutationResult<Extract<TDocument, { _type: Doc["_type"] }>, TOptions>
  >;
  createOrReplace: <
    const Doc extends Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
      _type: string;
    },
    const TOptions extends MutationOptions | undefined = undefined
  >(
    document: Doc,
    options?: TOptions
  ) => PromiseOrObservable<
    TIsPromise,
    MutationResult<Extract<TDocument, { _type: Doc["_type"] }>, TOptions>
  >;
  delete: <const TOptions extends MutationOptions | undefined = undefined>(
    idOrSelection: MutationSelection | string,
    options?: TOptions
  ) => PromiseOrObservable<
    TIsPromise,
    MutationResult<SanityAssetDocument | TDocument, TOptions>
  >;
  fetch: <
    const TQuery extends string,
    const TQueryParams = QueryParams,
    const TOptions extends
      | FilteredResponseQueryOptions
      | UnfilteredResponseQueryOptions
      | undefined = undefined
  >(
    query: TQuery,
    params?: TQueryParams,
    options?: TOptions
  ) => PromiseOrObservable<
    TIsPromise,
    MaybeRawQueryResponse<
      ExecuteQuery<
        TQuery,
        RootScope<{
          client: WritableDeep<TClientConfig>;
          dataset: (TDocument extends never ? never : TDocument)[];
          delta: { after: null; before: null };
          identity: string;
          parameters: NonNullable<TQueryParams>;
        }>
      >,
      TQuery,
      TOptions
    >
  >;
  getDocument: <const TId extends string>(
    id: TId,
    options?: Parameters<SanityClientNative["getDocument"]>[1]
  ) => PromiseOrObservable<TIsPromise, (TDocument & { _id: TId }) | undefined>;
  getDocuments: <const TIds extends readonly string[]>(
    ids: TIds,
    options?: Parameters<SanityClientNative["getDocuments"]>[1]
  ) => PromiseOrObservable<
    TIsPromise,
    GetDocuments<TDocument, WritableDeep<TIds>>
  >;
  listen: <
    const TQuery extends string,
    const TQueryParams = QueryParams,
    const TOptions extends ListenOptions | undefined = undefined
  >(
    query: TQuery,
    params?: TQueryParams,
    options?: TOptions
  ) => Observable<
    undefined extends TOptions
      ? MutationEvent<
          ExecuteQuery<
            TQuery,
            RootScope<{
              client: WritableDeep<TClientConfig>;
              dataset: (TDocument extends never ? never : TDocument)[];
              delta: { after: null; before: null };
              identity: string;
              parameters: NonNullable<TQueryParams>;
            }>
          > extends (infer Doc extends TDocument)[]
            ? Doc
            : never
        >
      : ListenEvent<
          ExecuteQuery<
            TQuery,
            RootScope<{
              client: WritableDeep<TClientConfig>;
              dataset: (TDocument extends never ? never : TDocument)[];
              delta: { after: null; before: null };
              identity: string;
              parameters: NonNullable<TQueryParams>;
            }>
          > extends (infer Doc extends TDocument)[]
            ? Doc
            : never
        >
  >;
  mutate: <
    const Doc extends AnySanityDocument,
    const TOptions extends MutationOptions | undefined = undefined
  >(
    operations:
      | Mutation<Doc>[]
      | PatchType<Doc, AnySanityDocument, TIsPromise, false>
      | Transaction,
    options?: TOptions
  ) => PromiseOrObservable<
    TIsPromise,
    MutationResult<
      Extract<TDocument, Partial<Omit<Doc, keyof AnySanityDocument>>>,
      TOptions
    >
  >;
  observable: // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Recursive type
  ObservableSanityClient<TClientConfig, TDocument>;
  patch: (
    idOrSelection: PatchSelection,
    // TODO PatchOperations should filter like Patch fns do
    options?: PatchOperations
  ) => PatchType<TDocument, TDocument, TIsPromise, true>;
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

type SanityValuesToDocumentUnion<
  SanityValues extends { [type: string]: any },
  TClientConfig extends ClientConfig
> = TClientConfig extends { perspective: "previewDrafts" }
  ? Extract<SanityValues[keyof SanityValues], AnySanityDocument> & {
      _originalId: string;
    }
  : Extract<SanityValues[keyof SanityValues], AnySanityDocument>;

/**
 * Unfortunately, this has to have a very weird function signature due to this typescript issue:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export const createClient =
  <SanityValues extends { [type: string]: any }>() =>
  <const TClientConfig extends ClientConfig>(config: TClientConfig) =>
    createClientNative(config) as unknown as SanityClient<
      TClientConfig,
      SanityValuesToDocumentUnion<SanityValues, TClientConfig>
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
  <
    Untyped extends SanityClientNative,
    const TClientConfig extends ClientConfig
  >(
    untyped: Untyped,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not actually used
    config?: TClientConfig
  ) =>
    untyped as SanityClient<
      TClientConfig,
      SanityValuesToDocumentUnion<SanityValues, TClientConfig>
    >;

export const castFromTyped = <TSanityClient extends SanityClient<any, any>>(
  typed: TSanityClient
) => typed as unknown as SanityClientNative;
