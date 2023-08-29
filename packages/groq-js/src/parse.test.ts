import { describe, expect, it } from "@jest/globals";
import { parse as parseNative } from "groq-js";

import type { Parse } from "@sanity-typed/groq";
import { expectType } from "@sanity-typed/test-utils";

import { parse } from ".";

describe("parse", () => {
  it("returns same value as groq-js", () => {
    const query = '*[_type == "foo"]';
    const tree = parse(query);

    expect(tree).toStrictEqual(parseNative(query));
  });

  it("returns same type as @sanity-typed/groq", () => {
    const query = '*[_type == "foo"]';
    const tree = parse(query);

    expectType<typeof tree>().toStrictEqual<Parse<typeof query>>();
  });
});
