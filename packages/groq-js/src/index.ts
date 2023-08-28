import {
  StaticValue as StaticValueNative,
  StreamValue as StreamValueNative,
  evaluate as evaluateNative,
  parse as parseNative,
} from "groq-js";
import type {
  EvaluateOptions,
  ExprNode,
  GroqType,
  ParseOptions,
} from "groq-js";
import type { Merge } from "type-fest";

import type { Evaluate, Parse } from "@sanity-typed/groq";

export const parse = <const Query extends string>(
  input: Query,
  options: ParseOptions = {}
) => parseNative(input, options) as Parse<Query>;

// eslint-disable-next-line fp/no-class -- retyping an existing class
export declare class StaticValue<
  P,
  T extends GroqType
> extends StaticValueNative<P, T> {
  get(): Promise<P>;
}

// eslint-disable-next-line fp/no-class -- retyping an existing class
export declare class StreamValue<P> extends StreamValueNative {
  get(): Promise<P>;
}

type MaybePromiseLike<T> = PromiseLike<T> | T;

type StaticOrStreamValue<P, T extends GroqType> =
  | StaticValue<P, T>
  | StreamValue<P>;

export const evaluate = <
  const Node extends ExprNode,
  Dataset extends any[] | readonly any[],
  Parameters extends { [param: string]: unknown },
  SanityProjectId extends string,
  SanityDataset extends string,
  Before extends Dataset[number] | null = null,
  After extends Dataset[number] | null = null,
  This = null
>(
  node: Node,
  options: Merge<
    EvaluateOptions,
    {
      after?: After;
      before?: Before;
      dataset?: Dataset;
      params?: Parameters;
      root?: This;
      sanity?: {
        dataset: SanityDataset;
        projectId: SanityProjectId;
      };
    }
  > = {}
) =>
  evaluateNative(node, options) as unknown as MaybePromiseLike<
    StaticOrStreamValue<
      Evaluate<
        Node,
        {
          context: {
            client: {
              dataset: SanityDataset;
              projectId: SanityProjectId;
            };
            dataset: Dataset;
            delta: { after: After; before: Before };
            parameters: Parameters;
          };
          parent: null;
          this: This;
        }
      >,
      any
    >
  >;
