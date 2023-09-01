import {
  StaticValue as StaticValueNative,
  StreamValue as StreamValueNative,
  evaluate as evaluateNative,
  parse as parseNative,
} from "groq-js";
import type { ExprNode, GroqType, ParseOptions } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { Evaluate, Parse, QueryParams } from "@sanity-typed/groq";

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
  const Dataset extends readonly any[],
  const Parameters extends QueryParams<Node>,
  const SanityProjectId extends string,
  const SanityDataset extends string,
  const Before extends Dataset[number] | null = null,
  const After extends Dataset[number] | null = null,
  const This = null
>(
  node: Node,
  options: {
    after?: After;
    before?: Before;
    dataset?: Dataset;
    identity?: string;
    params?: Parameters;
    root?: This;
    sanity?: {
      dataset: SanityDataset;
      projectId: SanityProjectId;
    };
    timestamp?: Date;
  } = {}
) =>
  evaluateNative(node, options) as unknown as MaybePromiseLike<
    StaticOrStreamValue<
      Evaluate<
        WritableDeep<Node>,
        {
          context: {
            client: {
              dataset: SanityDataset;
              projectId: SanityProjectId;
            };
            dataset: WritableDeep<Dataset>;
            delta: { after: WritableDeep<After>; before: WritableDeep<Before> };
            parameters: WritableDeep<Parameters>;
          };
          parent: null;
          this: WritableDeep<This>;
        }
      >,
      any
    >
  >;
