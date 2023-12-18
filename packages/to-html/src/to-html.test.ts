import { describe, expect, it } from "@jest/globals";
import { toHTML as toHTMLNative } from "@portabletext/to-html";

import { toHTML } from ".";

describe("toHTML", () => {
  it("returns same value as @portabletext/to-html", () =>
    expect(
      toHTML([
        {
          _key: "R5FvMrjo",
          _type: "block",
          children: [
            {
              _key: "cZUQGmh4",
              _type: "span",
              marks: [],
              text: "Span number one. ",
            },
            {
              _key: "toaiCqIK",
              _type: "span",
              marks: [],
              text: "And span number two.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ])
    ).toStrictEqual(
      toHTMLNative([
        {
          _key: "R5FvMrjo",
          _type: "block",
          children: [
            {
              _key: "cZUQGmh4",
              _type: "span",
              marks: [],
              text: "Span number one. ",
            },
            {
              _key: "toaiCqIK",
              _type: "span",
              marks: [],
              text: "And span number two.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ])
    ));
});
