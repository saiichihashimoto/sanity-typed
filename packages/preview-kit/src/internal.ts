import { createClient as createClientNative } from "@sanity/preview-kit/client";
import type { PreviewKitClientConfig } from "@sanity/preview-kit/client";

import type { SanityStegaClient } from "@sanity-typed/client";
import type { DocumentValues } from "@sanity-typed/types";

export const createClient = <SanityValues extends { [type: string]: any }>(
  config: PreviewKitClientConfig
) =>
  createClientNative(config) as unknown as SanityStegaClient<
    DocumentValues<SanityValues>
  >;
