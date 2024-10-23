import {
  StaticValue as StaticValueNative,
  StreamValue as StreamValueNative,
  evaluate as evaluateNative,
  parse as parseNative,
} from "groq-js";
import type { ExprNode, GroqType, ParseOptions } from "groq-js";
import type { WritableDeep } from "type-fest";

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
  const Dataset extends readonly any[],
  const Parameters extends { [param: string]: unknown },
  const Identity extends string,
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
    identity?: Identity;
    params?: Parameters;
    root?: This;
    sanity?: {
      dataset: SanityDataset;
      projectId: SanityProjectId;
    };
    timestamp?: Date;
  } = {}
) =>
  // @ts-expect-error TODO Type instantiation is excessively deep and possibly infinite.
  evaluateNative(node, options) as MaybePromiseLike<
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
            identity: Identity;
            parameters: WritableDeep<Parameters>;
          };
          parent: null;
          this: WritableDeep<This>;
        }
      >,
      any
    >
  >;
