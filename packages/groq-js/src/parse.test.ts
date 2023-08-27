import { describe, expect, it } from "@jest/globals";
import { parse as parseNative } from "groq-js";

import type { Parse } from "@sanity-typed/groq";
import { expectType } from "@sanity-typed/test-utils";

import { parse } from ".";

describe("parse", () => {
  it("returns same value as groq-js", () => {
    const query = '*[_type == "foo"]';
    const node = parse(query);

    expect(node).toStrictEqual(parseNative(query));
  });

  it("returns same type as @sanity-typed/groq", () => {
    const query = '*[_type == "foo"]';
    const node = parse(query);

    expectType<typeof node>().toStrictEqual<Parse<typeof query>>();
  });
});
