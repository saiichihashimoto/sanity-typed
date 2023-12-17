import type { ClientConfig } from "next-sanity";
import { createClient as createClientNative } from "next-sanity";

import type {
  SanityClient as SanityClientNative,
  SanityStegaClient,
} from "@sanity-typed/client";
import type { SanityValuesToDocumentUnion } from "@sanity-typed/client/src/internal";
import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

export type SanityClient<
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument
> =
  | SanityClientNative<TClientConfig, TDocument>
  | SanityStegaClient<TClientConfig, TDocument>;

export type ObservableSanityClient<
  TClientConfig extends ClientConfig,
  TDocument extends AnySanityDocument
> = SanityClient<TClientConfig, TDocument>["observable"];

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
