import type {
  GroqBuilder,
  createGroqBuilder as createGroqBuilderType,
} from "groq-builder";
import { bindAll } from "lodash/fp";
import type {
  ClientConfig,
  FilteredResponseQueryOptions,
  UnfilteredResponseQueryOptions,
} from "next-sanity";
import { createClient as createClientNative } from "next-sanity";

import type { SanityClient } from "@sanity-typed/client";
import type { DocumentValues, referenced } from "@sanity-typed/types";
import type { AnySanityDocument } from "@sanity-typed/types/src/internal";

export type { SanityClient } from "@sanity-typed/client";

export type ObservableSanityClient<TDocument extends AnySanityDocument> =
  SanityClient<TDocument>["observable"];

export const createClient = <SanityValues extends { [type: string]: any }>(
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
  } as SanityClient<DocumentValues<SanityValues>>;
};
