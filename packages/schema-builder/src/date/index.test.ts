import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { z } from "zod";

import { date } from ".";
import { expectType, mockRule } from "../test-utils";

describe("date", () => {
  it("builds a sanity config", () =>
    expect(date().schema()).toStrictEqual({
      type: "date",
    }));

  it("passes through schema values", () =>
    expect(date({ hidden: false }).schema()).toHaveProperty("hidden", false));

  it("parses into a string", () => {
    const type = date();

    const value = "2017-02-12";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<string>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into a string", () => {
    const type = date();

    const value = "2017-02-12";
    const resolvedValue = type.resolve(value);

    expectType<typeof resolvedValue>().toStrictEqual<string>();

    expect(resolvedValue).toStrictEqual(value);
  });

  it("mocks a string", () => {
    const value = date().mock(faker);

    expect(value).toStrictEqual(expect.any(String));

    z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .parse(value);
  });

  it("mocks the same value with the same path", () => {
    expect(date().mock(faker)).toStrictEqual(date().mock(faker));
    expect(date().mock(faker, ".foo")).toStrictEqual(
      date().mock(faker, ".foo")
    );

    expect(date().mock(faker, ".foo")).not.toStrictEqual(date().mock(faker));
    expect(date().mock(faker)).not.toStrictEqual(date().mock(faker, ".foo"));
  });

  it("allows defining the mocks", () =>
    expect(["2010-05-06", "2011-04-27"]).toContainEqual(
      date({
        mock: (faker) =>
          faker.helpers.arrayElement(["2010-05-06", "2011-04-27"]),
      }).mock(faker)
    ));

  it("allows defining the zod", () => {
    const type = date({
      zod: (zod) => zod.transform((value) => value.length),
    });

    const value = "2017-02-12";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<number>();

    expect(parsedValue).toBe(10);
  });

  it("types custom validation", () => {
    const type = date({
      validation: (Rule) =>
        Rule.custom((value) => {
          expectType<typeof value>().toStrictEqual<string | undefined>();

          return (value?.length ?? 0) > 50 || "Needs to be 50 characters";
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
