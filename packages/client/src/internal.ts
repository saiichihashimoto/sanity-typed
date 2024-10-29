import {
  ObservablePatch as ObservablePatchNative,
  ObservableTransaction as ObservableTransactionNative,
  Patch as PatchNative,
  Transaction as TransactionNative,
  createClient as createClientNative,
} from "@sanity/client";
import type {
  BaseMutationOptions,
  BasePatch,
  ClientConfig,
  FilteredResponseQueryOptions,
  InitializedClientConfig,
  ListenEvent as ListenEventNative,
  ListenOptions,
  MultipleMutationResult,
  MutationEvent as MutationEventNative,
  Mutation as MutationNative,
  MutationSelection,
  ObservableSanityClient as ObservableSanityClientNative,
  PatchOperations as PatchOperationsNative,
  PatchSelection,
  QueryParams,
  RawQueryResponse as RawQueryResponseNative,
  SanityAssetDocument,
  SanityClient as SanityClientNative,
  SingleMutationResult,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type {
  GroqBuilder,
  createGroqBuilder as createGroqBuilderType,
} from "groq-builder";
import { bindAll } from "lodash/fp";
import type { Observable } from "rxjs";
import type {
  Except,
  IsNever,
  Merge,
  SetOptional,
  WritableDeep,
} from "type-fest";

import type { ExecuteQuery, RootScope } from "@sanity-typed/groq";
import type { DocumentValues, referenced } from "@sanity-typed/types";
import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

// HACK Couldn't use type-fest's Merge >=3.0.0
type MergeOld<FirstType, SecondType> = Except<
  FirstType,
  Extract<keyof FirstType, keyof SecondType>
> &
  SecondType;

declare const README: unique symbol;

type PromiseOrObservable<
  TIsPromise extends boolean,
  T
> = TIsPromise extends true ? Promise<T> : Observable<T>;

export type MutationOptions = BaseMutationOptions & {
  returnDocuments?: boolean;
  returnFirst?: boolean;
};

type MutationResult<
  Value,
  TOptions extends MutationOptions | undefined
> = TOptions extends { returnDocuments: false; returnFirst: false }
  ? MultipleMutationResult
  : TOptions extends { returnFirst: false }
  ? Value extends any[]
    ? Value
    : Value[]
  : TOptions extends { returnDocuments: false }
  ? SingleMutationResult
  : Value extends any[]
  ? Value[0]
  : Value;

export type PatchOperations<
  TDocument extends AnySanityDocument,
  TAttrs extends Partial<TDocument>,
  TKeys extends TDocument extends never ? never : (keyof TDocument)[]
> = MergeOld<
  PatchOperationsNative,
  {
    dec?: TAttrs & { [key: string]: number };
    diffMatchPatch?: TAttrs & { [key: string]: string };
    inc?: TAttrs & { [key: string]: number };
    set?: TAttrs;
    setIfMissing?: TAttrs;
    unset?: TKeys;
  }
>;

export type PatchMutationOperation<
  TDocument extends AnySanityDocument,
  TAttrs extends Partial<TDocument>,
  TKeys extends TDocument extends never ? never : (keyof TDocument)[]
> = MutationSelection & PatchOperations<TDocument, TAttrs, TKeys>;

export type PatchType<
  TDocument extends AnySanityDocument,
  TOriginalDocument extends AnySanityDocument,
  TIsPromise extends boolean,
  TIsScoped extends boolean
> = MergeOld<
  BasePatch,
  {
    append: (
      ...args: Parameters<BasePatch["append"]>
    ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    clone: () => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    commit: TIsScoped extends false
      ? never
      : <const TOptions extends MutationOptions = BaseMutationOptions>(
          options?: TOptions
        ) => PromiseOrObservable<
          TIsPromise,
          MutationResult<TDocument, TOptions>
        >;
    dec: <
      TAttrs extends TIsScoped extends true
        ? Partial<TDocument> & { [key: string]: number }
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
    diffMatchPatch: <
      TAttrs extends TIsScoped extends true
        ? Partial<TDocument> & { [key: string]: string }
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
    ifRevisionId: (
      ...args: Parameters<BasePatch["ifRevisionId"]>
    ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    inc: <
      TAttrs extends TIsScoped extends true
        ? Partial<TDocument> & { [key: string]: number }
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
      ...args: Parameters<BasePatch["insert"]>
    ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    prepend: (
      ...args: Parameters<BasePatch["prepend"]>
    ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    reset: (
      ...args: Parameters<BasePatch["reset"]>
    ) => PatchType<TOriginalDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    serialize: () => PatchMutationOperation<
      TDocument,
      Partial<TDocument>,
      TDocument extends never ? never : (keyof TDocument)[]
    >;
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
      ...args: Parameters<BasePatch["splice"]>
    ) => PatchType<TDocument, TOriginalDocument, TIsPromise, TIsScoped>;
    toJSON: () => PatchMutationOperation<
      TDocument,
      Partial<TDocument>,
      TDocument extends never ? never : (keyof TDocument)[]
    >;
    unset: <
      TKeys extends TDocument extends never
        ? never
        : TIsScoped extends true
        ? (keyof TDocument)[]
        : string[]
    >(
      keys: TKeys
    ) => PatchType<
      TIsScoped extends true
        ? TDocument extends never
          ? never
          : TKeys[number] extends keyof TDocument
          ? TDocument
          : never
        : TDocument & { [key in TKeys[number]]: any },
      TOriginalDocument,
      TIsPromise,
      TIsScoped
    >;
  }
>;

export const Patch = PatchNative as unknown as new <
  const TDocument extends AnySanityDocument,
  const TAttrs extends Partial<TDocument>,
  const TKeys extends TDocument extends never ? never : (keyof TDocument)[],
  const TClient extends SanityClient<TDocument> | undefined = undefined
>(
  idOrSelection: PatchSelection,
  operations?: PatchOperations<TDocument, TAttrs, TKeys>,
  client?: TClient
) => PatchType<
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
  undefined extends TClient ? false : true
>;

export const ObservablePatch = ObservablePatchNative as unknown as new <
  const TDocument extends AnySanityDocument,
  const TAttrs extends Partial<TDocument>,
  const TKeys extends TDocument extends never ? never : (keyof TDocument)[],
  const TClient extends SanityClient<TDocument> | undefined = undefined
>(
  idOrSelection: PatchSelection,
  operations?: PatchOperations<TDocument, TAttrs, TKeys>,
  client?: TClient
) => PatchType<
  Extract<TDocument, Partial<TAttrs>> &
    (TDocument extends never
      ? never
      : TKeys extends never
      ? never
      : TKeys[number] extends keyof TDocument
      ? TDocument
      : never),
  TDocument,
  false,
  undefined extends TClient ? false : true
>;

export type TransactionType<
  TDocuments extends AnySanityDocument[],
  TOriginalDocument extends AnySanityDocument,
  TIsPromise extends boolean,
  TIsScoped extends boolean
> = MergeOld<
  TransactionNative,
  {
    commit: TIsScoped extends false
      ? never
      : <const TOptions extends MutationOptions = BaseMutationOptions>(
          options?: TOptions
        ) => PromiseOrObservable<
          TIsPromise,
          MutationResult<TDocuments, TOptions>
        >;
    create: <
      Doc extends TOriginalDocument extends never
        ? never
        : Omit<
            SetOptional<TOriginalDocument, "_id">,
            "_createdAt" | "_rev" | "_updatedAt"
          > & { _type: string }
    >(
      document: Doc
    ) => TransactionType<
      [
        ...TDocuments,
        TIsScoped extends true
          ? Extract<TOriginalDocument, { _type: Doc["_type"] }>
          : Doc & TOriginalDocument
      ],
      TOriginalDocument,
      TIsPromise,
      TIsScoped
    >;
    createIfNotExists: <
      Doc extends TOriginalDocument extends never
        ? never
        : Omit<TOriginalDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
            _type: string;
          }
    >(
      document: Doc
    ) => TransactionType<
      [
        ...TDocuments,
        TIsScoped extends true
          ? Extract<TOriginalDocument, { _type: Doc["_type"] }>
          : Doc & TOriginalDocument
      ],
      TOriginalDocument,
      TIsPromise,
      TIsScoped
    >;
    createOrReplace: <
      Doc extends TOriginalDocument extends never
        ? never
        : Omit<TOriginalDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
            _type: string;
          }
    >(
      document: Doc
    ) => TransactionType<
      [
        ...TDocuments,
        TIsScoped extends true
          ? Extract<TOriginalDocument, { _type: Doc["_type"] }>
          : Doc & TOriginalDocument
      ],
      TOriginalDocument,
      TIsPromise,
      TIsScoped
    >;
    delete: (
      idOrSelection: MutationSelection | string
    ) => TransactionType<
      [...TDocuments, SanityAssetDocument | TOriginalDocument],
      TOriginalDocument,
      TIsPromise,
      TIsScoped
    >;
    patch: <Doc extends TOriginalDocument>(
      ...args:
        | [
            documentId: string,
            patchOps?:
              | PatchOperationsNative
              | ((
                  patch: PatchType<
                    TOriginalDocument,
                    TOriginalDocument,
                    TIsPromise,
                    TIsScoped
                  >
                ) => PatchType<Doc, TOriginalDocument, TIsPromise, TIsScoped>)
          ]
        | [patch: PatchType<Doc, TOriginalDocument, TIsPromise, TIsScoped>]
    ) => TransactionType<
      [...TDocuments, Doc],
      TOriginalDocument,
      TIsPromise,
      TIsScoped
    >;
    reset: (
      ...args: Parameters<TransactionNative["reset"]>
    ) => TransactionType<[], TOriginalDocument, TIsPromise, TIsScoped>;
  }
>;

export type Mutation<
  TDocument extends AnySanityDocument,
  Doc extends Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
    _type: string;
  }
> =
  | Exclude<
      MutationNative,
      | { create: any }
      | { createIfNotExists: any }
      | { createOrReplace: any }
      | { patch: any }
    >
  | {
      patch: PatchMutationOperation<
        TDocument,
        Partial<TDocument>,
        TDocument extends never ? never : (keyof TDocument)[]
      >;
    }
  | { create: SetOptional<Doc & { _id: string }, "_id"> }
  | { createIfNotExists: Doc & { _id: string } }
  | { createOrReplace: Doc & { _id: string } };

export type MutationDoc<
  TDocument extends AnySanityDocument,
  TMutation extends Mutation<any, any>
> = TMutation extends {
  create: infer Doc;
}
  ? Extract<TDocument, Doc>
  : TMutation extends { createOrReplace: infer Doc }
  ? Extract<TDocument, Doc>
  : TMutation extends { createIfNotExists: infer Doc }
  ? Extract<TDocument, Doc>
  : TMutation extends { delete: any }
  ? SanityAssetDocument | TDocument
  : never;

export const Transaction = TransactionNative as unknown as new <
  const TDocument extends AnySanityDocument,
  const TClient extends SanityClient<TDocument> | undefined = undefined
>(
  operations?: Mutation<TDocument, any>[],
  client?: TClient,
  transactionId?: string
) => TransactionType<
  [],
  AnySanityDocument,
  true,
  undefined extends TClient ? false : true
>;

export const ObservableTransaction =
  ObservableTransactionNative as unknown as new <
    const TDocument extends AnySanityDocument,
    const TClient extends SanityClient<TDocument> | undefined = undefined
  >(
    operations?: Mutation<TDocument, any>[],
    client?: TClient,
    transactionId?: string
  ) => TransactionType<
    [],
    AnySanityDocument,
    false,
    undefined extends TClient ? false : true
  >;

export type MutationEvent<TDocument extends AnySanityDocument> = Merge<
  MutationEventNative,
  {
    previous?: TDocument | null;
    result?: TDocument;
  }
>;

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
  Options extends FilteredResponseQueryOptions | UnfilteredResponseQueryOptions
> = Options extends UnfilteredResponseQueryOptions
  ? RawQueryResponse<Result, Query>
  : Result;

export type GetDocuments<
  TDocument extends AnySanityDocument,
  Ids extends string[]
> = {
  [index in keyof Ids]: (TDocument & { _id: Ids[index] }) | null;
};

export type OverrideSanityClient<
  TSanityClient,
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument,
  TObservableClient,
  TIsPromise extends boolean
> = MergeOld<
  TSanityClient,
  {
    clone: () => OverrideSanityClient<
      TSanityClient,
      TClientConfig,
      TDocument,
      TObservableClient,
      TIsPromise
    >;
    config: <
      const NewConfig extends Partial<ClientConfig> | undefined = undefined
    >(
      newConfig?: NewConfig
    ) => NewConfig extends undefined
      ? InitializedClientConfig
      : OverrideSanityClient<
          TSanityClient,
          Merge<TClientConfig, NewConfig>,
          TDocument,
          TObservableClient,
          TIsPromise
        >;
    create: <
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
    ) => PromiseOrObservable<
      TIsPromise,
      MutationResult<Extract<TDocument, { _type: Doc["_type"] }>, TOptions>
    >;
    createIfNotExists: <
      Doc extends TDocument extends never
        ? never
        : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt">,
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      document: Doc,
      options?: TOptions
    ) => PromiseOrObservable<
      TIsPromise,
      MutationResult<Extract<TDocument, { _type: Doc["_type"] }>, TOptions>
    >;
    createOrReplace: <
      Doc extends TDocument extends never
        ? never
        : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt">,
      const TOptions extends MutationOptions = BaseMutationOptions
    >(
      document: Doc,
      options?: TOptions
    ) => PromiseOrObservable<
      TIsPromise,
      MutationResult<Extract<TDocument, { _type: Doc["_type"] }>, TOptions>
    >;
    delete: <const TOptions extends MutationOptions = BaseMutationOptions>(
      idOrSelection: MutationSelection | string,
      options?: TOptions
    ) => PromiseOrObservable<
      TIsPromise,
      MutationResult<SanityAssetDocument | TDocument, TOptions>
    >;
    fetch: <
      const TQuery extends string,
      const TQueryParams extends { [param: string]: unknown },
      const TOptions extends
        | FilteredResponseQueryOptions
        | UnfilteredResponseQueryOptions = FilteredResponseQueryOptions,
      const TResult = never
    >(
      query:
        | TQuery
        | ((
            q: GroqBuilder<
              never,
              {
                documentTypes: TDocument;
                referenceSymbol: typeof referenced;
              }
            >
          ) => GroqBuilder<
            TResult,
            {
              documentTypes: TDocument;
              referenceSymbol: typeof referenced;
            }
          >),
      params?: TQueryParams,
      options?: TOptions
    ) => PromiseOrObservable<
      TIsPromise,
      MaybeRawQueryResponse<
        IsNever<TResult> extends true
          ? ExecuteQuery<
              TQuery,
              RootScope<{
                client: WritableDeep<TClientConfig>;
                dataset: (TDocument extends never ? never : TDocument)[];
                delta: { after: null; before: null };
                identity: string;
                parameters: NonNullable<TQueryParams>;
              }>
            >
          : TResult,
        TQuery,
        TOptions
      >
    >;
    getDocument: <const TId extends string>(
      id: TId,
      options?: Parameters<SanityClientNative["getDocument"]>[1]
    ) => PromiseOrObservable<
      TIsPromise,
      (TDocument & { _id: TId }) | undefined
    >;
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
        | PatchType<Doc, AnySanityDocument, TIsPromise, false>
        | TransactionType<
            [Doc, ...any[]],
            AnySanityDocument,
            TIsPromise,
            false
          >,
      options?: TOptions
    ) => PromiseOrObservable<
      TIsPromise,
      MutationResult<
        Extract<TDocument, Partial<Omit<Doc, keyof AnySanityDocument>>>,
        TOptions
      >
    >;
    observable: TObservableClient;
    patch: <
      TAttrs extends Partial<TDocument>,
      TKeys extends TDocument extends never ? never : (keyof TDocument)[]
    >(
      idOrSelection: PatchSelection,
      operations?: PatchOperations<TDocument, TAttrs, TKeys>
    ) => PatchType<
      Extract<TDocument, Partial<TAttrs>> &
        (TDocument extends never
          ? never
          : TKeys extends never
          ? never
          : TKeys[number] extends keyof TDocument
          ? TDocument
          : never),
      TDocument,
      TIsPromise,
      true
    >;
    transaction: <
      TMutations extends Mutation<
        TDocument,
        TDocument extends never
          ? never
          : Omit<TDocument, "_createdAt" | "_rev" | "_updatedAt"> & {
              _type: string;
            }
      >[] = []
    >(
      operations?: TMutations
    ) => TransactionType<
      AnySanityDocument[] & {
        [index in keyof TMutations]: MutationDoc<TDocument, TMutations[index]>;
      },
      TDocument,
      TIsPromise,
      true
    >;
    withConfig: <const NewConfig extends Partial<ClientConfig>>(
      newConfig?: NewConfig
    ) => OverrideSanityClient<
      TSanityClient,
      Merge<TClientConfig, NewConfig>,
      TDocument,
      TObservableClient,
      TIsPromise
    >;
  }
>;

export type ObservableSanityClient<
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument
> = OverrideSanityClient<
  ObservableSanityClientNative,
  TClientConfig,
  TDocument,
  // TODO
  any,
  false
>;

export type SanityClient<TDocument extends AnySanityDocument> =
  OverrideSanityClient<
    SanityClientNative,
    ClientConfig,
    TDocument,
    ObservableSanityClient<ClientConfig, TDocument>,
    true
  >;

export const createClient = <
  const SanityValues extends { [type: string]: any }
>(
  config: ClientConfig
) => {
  const client = createClientNative(config) as unknown as SanityClient<
    DocumentValues<SanityValues>
  >;

  let clientQ:
    | GroqBuilder<
        never,
        {
          documentTypes: DocumentValues<SanityValues>;
          referenceSymbol: typeof referenced;
        }
      >
    | undefined;

  try {
    const {
      createGroqBuilder,
      // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module -- Optional Dependency
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

  return {
    ...client,
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
              never,
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
      if (typeof queryOrBuilder !== "string" && !clientQ) {
        throw new TypeError(
          "Cannot pass a function to `fetch` unless `groq-query` is installed"
        );
      }

      const { query, parse } = bindAll(
        ["parse"],
        typeof queryOrBuilder === "string"
          ? { query: queryOrBuilder, parse: (value: unknown) => value }
          : queryOrBuilder(clientQ!)
      );

      return parse(client.fetch(query, params, options as any)) as any;
    },
  } as unknown as SanityClient<DocumentValues<SanityValues>>;
};

export const castToTyped =
  <const SanityValues extends { [type: string]: any } = never>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not actually used
    ...args: IsNever<SanityValues> extends false
      ? []
      : [
          error: {
            [README]: "⛔️ Without providing a SanityValues, castToTyped is meaningless. eg. castToTyped<SanityValues>()(untypedClient) ⛔️";
          }
        ]
  ) =>
  <const TClient extends SanityClientNative>(untyped: TClient) =>
    untyped as unknown as SanityClient<DocumentValues<SanityValues>>;
