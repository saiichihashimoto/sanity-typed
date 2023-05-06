import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { boolean } from ".";
import { mockRule } from "../test-utils";

describe("boolean", () => {
  it("builds a sanity config", () =>
    expect(boolean().schema()).toStrictEqual({
      type: "boolean",
    }));

  it("passes through schema values", () =>
    expect(boolean({ hidden: false }).schema()).toHaveProperty(
      "hidden",
      false
    ));

  it("parses into a boolean", () => {
    const type = boolean();

    const value = true;
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<boolean>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into a boolean", () => {
    const type = boolean();

    const value = true;
    const resolvedValue = type.resolve(value);

    expectType<typeof resolvedValue>().toStrictEqual<boolean>();

    expect(resolvedValue).toStrictEqual(value);
  });

  it("mocks a boolean", () =>
    expect(boolean().mock(faker)).toStrictEqual(expect.any(Boolean)));

  it("mocks the same value with the same path", () => {
    expect(boolean().mock(faker)).toStrictEqual(boolean().mock(faker));
    expect(boolean().mock(faker, ".foo")).toStrictEqual(
      boolean().mock(faker, ".foo")
    );

    expect(boolean().mock(faker, ".foo")).not.toStrictEqual(
      boolean().mock(faker)
    );
    expect(boolean().mock(faker)).not.toStrictEqual(
      boolean().mock(faker, ".foo")
    );
  });

  it("allows defining the mocks", () =>
    expect([true]).toContainEqual(
      boolean({
        mock: (faker) => faker.helpers.arrayElement([true]),
      }).mock(faker)
    ));

  it("allows defining the zod", () => {
    const type = boolean({
      zod: (zod) => zod.transform((value) => value.toString()),
    });

    const value = true;
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<string>();

    expect(parsedValue).toBe("true");
  });

  it("types custom validation", () => {
    const type = boolean({
      validation: (Rule) =>
        Rule.custom((value) => {
          expectType<typeof value>().toStrictEqual<boolean | undefined>();

          return value || "Needs to be true";
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
