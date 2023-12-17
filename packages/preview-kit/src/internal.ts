import { createClient as createClientNative } from "@sanity/preview-kit/client";
import type { PreviewKitClientConfig } from "@sanity/preview-kit/client";

import type { SanityClient, SanityStegaClient } from "@sanity-typed/client";
import type { SanityValuesToDocumentUnion } from "@sanity-typed/client/src/internal";

/**
 * Unfortunately, this has to have a very weird function signature due to this typescript issue:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export const createClient =
  <SanityValues extends { [type: string]: any }>() =>
  <const TClientConfig extends PreviewKitClientConfig>(config: TClientConfig) =>
    createClientNative(config) as unknown as
      | SanityClient<
          TClientConfig,
          SanityValuesToDocumentUnion<SanityValues, TClientConfig>
        >
      | SanityStegaClient<
          TClientConfig,
          SanityValuesToDocumentUnion<SanityValues, TClientConfig>
        >;
