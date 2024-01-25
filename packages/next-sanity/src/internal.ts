import type { ClientConfig } from "next-sanity";
import { createClient as createClientNative } from "next-sanity";

import type { SanityStegaClient } from "@sanity-typed/client";
import type { DocumentValues } from "@sanity-typed/types";
import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

export type SanityClient<TDocument extends AnySanityDocument> =
  SanityStegaClient<TDocument>;

export type ObservableSanityClient<TDocument extends AnySanityDocument> =
  SanityClient<TDocument>["observable"];

export const createClient = <SanityValues extends { [type: string]: any }>(
  config: ClientConfig
) =>
  createClientNative(config) as unknown as SanityClient<
    DocumentValues<SanityValues>
  >;
