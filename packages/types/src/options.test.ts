import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineField } from ".";
import type { _InferValue } from ".";

describe("number", () => {
  it("infers number with options", () => {
    const field = defineField({
      name: "foo",
      type: "number",
      options: {
        list: [
          { value: 1, title: "One" } as const,
          { value: 2, title: "Two" } as const,
        ],
      },
    });

    expectType<_InferValue<typeof field>>().toStrictEqual<1 | 2>();
  });
});
