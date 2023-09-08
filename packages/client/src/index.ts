import { createClient as createClientNative } from "@sanity/client";
import type {
  ClientConfig,
  FilteredResponseQueryOptions,
  InitializedClientConfig as InitializedClientConfigNative,
  QueryParams,
  RawQueryResponse as RawQueryResponseNative,
  SanityClient as SanityClientNative,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type { IsNever, Merge, WritableDeep } from "type-fest";

import type { ExecuteQuery, RootScope } from "@sanity-typed/groq";
import type { SanityDocument } from "@sanity-typed/types";

declare const README: unique symbol;

type AnySanityDocument = Omit<SanityDocument, "_type">;

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
  [index in keyof Ids]: (TDocument & { _id: Ids[index] }) | null;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- recursive type
export interface SanityClient<
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument
> extends Omit<
    SanityClientNative,
    "clone" | "config" | "fetch" | "getDocument" | "getDocuments" | "withConfig"
  > {
  clone: () => SanityClient<TClientConfig, TDocument>;
  config: <
    const NewConfig extends Partial<ClientConfig> | undefined = undefined
  >(
    newConfig?: NewConfig
  ) => NewConfig extends undefined
    ? InitializedClientConfig<WritableDeep<TClientConfig>>
    : SanityClient<Merge<TClientConfig, NewConfig>, TDocument>;
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
  ) => Promise<
    MaybeRawQueryResponse<
      ExecuteQuery<
        Query,
        RootScope<{
          client: WritableDeep<TClientConfig>;
          dataset: (TDocument &
            (TClientConfig extends { perspective: "previewDrafts" }
              ? { _originalId: string }
              : unknown))[];
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
  ) => Promise<(TDocument & { _id: Id }) | undefined>;
  getDocuments: <const Ids extends readonly string[]>(
    ids: Ids,
    options?: Parameters<SanityClientNative["getDocuments"]>[1]
  ) => Promise<GetDocuments<WritableDeep<Ids>, TDocument>>;
  withConfig: <const NewConfig extends Partial<ClientConfig>>(
    newConfig?: NewConfig
  ) => SanityClient<Merge<TClientConfig, NewConfig>, TDocument>;
}

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
