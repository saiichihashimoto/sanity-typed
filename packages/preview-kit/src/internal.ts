import { createClient as createClientNative } from "@sanity/preview-kit/client";
import type {
  FilteredResponseQueryOptions,
  PreviewKitClientConfig,
  UnfilteredResponseQueryOptions,
} from "@sanity/preview-kit/client";
import type {
  GroqBuilder,
  createGroqBuilder as createGroqBuilderType,
  makeSafeQueryRunner as makeSafeQueryRunnerType,
} from "groq-builder";

import type { SanityStegaClient } from "@sanity-typed/client";
import type { DocumentValues, referenced } from "@sanity-typed/types";

export const createClient = <SanityValues extends { [type: string]: any }>(
  config: PreviewKitClientConfig
) => {
  const client = createClientNative(config) as unknown as SanityStegaClient<
    DocumentValues<SanityValues>
  >;

  let clientQ: GroqBuilder<
    never,
    {
      documentTypes: DocumentValues<SanityValues>;
      referenceSymbol: typeof referenced;
    }
  >;
  let runBuilderQuery:
    | ReturnType<
        typeof makeSafeQueryRunnerType<
          (query: string, params: any, options: any) => Promise<any>
        >
      >
    | undefined;

  try {
    const {
      createGroqBuilder,
      makeSafeQueryRunner,
      // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module -- Optional Dependency
    } = require("groq-builder") as {
      createGroqBuilder: typeof createGroqBuilderType;
      makeSafeQueryRunner: typeof makeSafeQueryRunnerType;
    };

    clientQ = createGroqBuilder<{
      documentTypes: DocumentValues<SanityValues>;
      referenceSymbol: typeof referenced;
    }>();

    runBuilderQuery = makeSafeQueryRunner(
      async (query, params: any, options: any) =>
        client.fetch(query, params, options)
    );
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
      query:
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
      if (typeof query === "string") {
        return client.fetch(query, params, options as any) as any;
      }

      if (!runBuilderQuery) {
        throw new TypeError(
          "Cannot pass a function to `fetch` unless `groq-query` is installed"
        );
      }

      return runBuilderQuery(query(clientQ), params, options) as any;
    },
  } as SanityStegaClient<DocumentValues<SanityValues>>;
};
