import type { ClientConfig } from "@sanity/client";

import type { SanityClient } from "@sanity-typed/client";
import type { SanityValuesToDocumentUnion } from "@sanity-typed/client/src/internal";

/**
 * Unfortunately, this has to have a very weird function signature due to this typescript issue:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export const createClient =
  <SanityValues extends { [type: string]: any }>() =>
  <const TClientConfig extends ClientConfig>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FIXME
    config: TClientConfig
  ) =>
    ({} as unknown as SanityClient<
      TClientConfig,
      SanityValuesToDocumentUnion<SanityValues, TClientConfig>
    >);
