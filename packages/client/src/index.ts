import { createClient as createClientNative } from "@sanity/client";
import type {
  ClientConfig,
  FilteredResponseQueryOptions,
  QueryParams,
  SanityClient as SanityClientNative,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type { Merge } from "type-fest";

import type { ExecuteQuery } from "@sanity-typed/groq";
import type { SanityDocument } from "@sanity-typed/types";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- recursive type
export interface SanityClient<Client extends ClientConfig, Dataset>
  extends Omit<SanityClientNative, "clone" | "fetch" | "withConfig"> {
  clone: () => SanityClient<Client, Dataset>;
  fetch: <Query extends string, Q = QueryParams>(
    query: Query,
    params?: Q,
    options?: FilteredResponseQueryOptions | UnfilteredResponseQueryOptions
  ) => Promise<
    ExecuteQuery<
      Query,
      {
        client: Client;
        dataset: Dataset;
      }
    >
  >;
  withConfig: <const NewConfig extends Partial<ClientConfig>>(
    newConfig?: NewConfig
  ) => SanityClient<Merge<Client, NewConfig>, Dataset>;
}
/**
 * Unfortunately, this has to have a very weird function signature due to this typescript issue:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export const createClient =
  <Values extends { [type: string]: any }>() =>
  <const Config extends ClientConfig>(config: Config) =>
    createClientNative(config) as unknown as SanityClient<
      Config,
      {
        [type in keyof Values]: Extract<Values[type], SanityDocument<any, any>>;
      }[keyof Values][]
    >;
