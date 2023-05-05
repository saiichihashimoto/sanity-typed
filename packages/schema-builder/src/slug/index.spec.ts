import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import type { SlugValue } from "sanity";

import { slug } from ".";
import { mockRule } from "../test-utils";
import type { Equal, Expect } from "../test-utils";
import type { InferValue } from "../types";

describe("slug", () => {
  it("builds a sanity config", () =>
    expect(slug().schema()).toStrictEqual({
      type: "slug",
    }));

  it("passes through schema values", () =>
    expect(slug({ hidden: false }).schema()).toHaveProperty("hidden", false));

  it("parses into a string", () => {
    const type = slug();

    const value = {
      _type: "slug",
      current: "foo",
    } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    type Assertions = [
      Expect<Equal<typeof value, SlugValue>>,
      Expect<Equal<typeof parsedValue, string>>
    ];

    expect(parsedValue).toBe("foo");
  });

  it("resolves into a string", () => {
    const type = slug();

    const value = {
      _type: "slug",
      current: "foo",
    } as InferValue<typeof type>;
    const resolvedValue = type.resolve(value);

    type Assertions = [
      Expect<Equal<typeof value, SlugValue>>,
      Expect<Equal<typeof resolvedValue, string>>
    ];

    expect(resolvedValue).toBe("foo");
  });

  it("mocks a slug", () =>
    expect(slug().mock(faker)).toStrictEqual({
      _type: "slug",
      current: expect.any(String),
    }));

  it("mocks the same value with the same path", () => {
    expect(slug().mock(faker)).toStrictEqual(slug().mock(faker));
    expect(slug().mock(faker, ".foo")).toStrictEqual(
      slug().mock(faker, ".foo")
    );

    expect(slug().mock(faker, ".foo")).not.toStrictEqual(slug().mock(faker));
    expect(slug().mock(faker)).not.toStrictEqual(slug().mock(faker, ".foo"));
  });

  it("allows defining the mocks", () =>
    expect([
      { _type: "slug", current: "a-slug" },
      { _type: "slug", current: "b-slug" },
    ]).toContainEqual(
      slug({
        mock: (faker) =>
          faker.helpers.arrayElement([
            { _type: "slug", current: "a-slug" },
            { _type: "slug", current: "b-slug" },
          ]),
      }).mock(faker)
    ));

  it("allows defining the zod", () => {
    const type = slug({
      zod: (zod) => zod.transform(({ _type }) => _type),
    });

    const value = { _type: "slug", current: "a-slug" };
    const parsedValue = type.parse(value);

    type Assertions = [Expect<Equal<typeof parsedValue, "slug">>];

    expect(parsedValue).toBe("slug");
  });

  it("types custom validation", () => {
    const type = slug({
      validation: (Rule) =>
        Rule.custom((value) => {
          type Assertions = [
            Expect<Equal<typeof value, SlugValue | undefined>>
          ];

          return (
            (value?.current?.length ?? 0) > 50 || "Needs to be 50 characters"
          );
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
