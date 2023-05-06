import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import { datetime } from ".";
import { expectType, mockRule } from "../test-utils";

describe("datetime", () => {
  it("builds a sanity config", () =>
    expect(datetime().schema()).toStrictEqual({
      type: "datetime",
      validation: expect.any(Function),
    }));

  it("passes through schema values", () =>
    expect(datetime({ hidden: false }).schema()).toHaveProperty(
      "hidden",
      false
    ));

  it("parses into a Date", () => {
    const type = datetime();

    const value = "2022-06-03T03:24:55.395Z";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<Date>();

    expect(parsedValue).toStrictEqual(new Date(value));
  });

  it("resolves into a Date", () => {
    const type = datetime();

    const value = "2022-06-03T03:24:55.395Z";
    const resolvedValue = type.resolve(value);

    expectType<typeof resolvedValue>().toStrictEqual<Date>();

    expect(resolvedValue).toStrictEqual(new Date(value));
  });

  it("enforces a valid Date", () => {
    const type = datetime();

    const value = "not a date";

    expect(() => {
      type.parse(value);
    }).toThrow("Invalid Date");
  });

  it("sets min", () => {
    const type = datetime({ min: "2022-06-03T03:24:55.394Z" });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.min).toHaveBeenCalledWith("2022-06-03T03:24:55.394Z");

    const value = "2022-06-03T03:24:55.395Z";

    expect(type.parse(value)).toStrictEqual(new Date(value));

    expect(() => {
      type.parse("2022-06-03T03:24:55.390Z");
    }).toThrow("Greater than 2022-06-03T03:24:55.394Z");
  });

  it("sets max", () => {
    const type = datetime({ max: "2022-06-03T03:24:55.396Z" });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.max).toHaveBeenCalledWith("2022-06-03T03:24:55.396Z");

    const value = "2022-06-03T03:24:55.395Z";

    expect(type.parse(value)).toStrictEqual(new Date(value));

    expect(() => {
      type.parse("2022-06-03T03:24:55.399Z");
    }).toThrow("Less than 2022-06-03T03:24:55.396Z");
  });

  it("min & max are inclusive", () => {
    const type = datetime({
      max: "2022-06-03T03:24:55.395Z",
      min: "2022-06-03T03:24:55.395Z",
    });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.min).toHaveBeenCalledWith("2022-06-03T03:24:55.395Z");
    expect(rule.max).toHaveBeenCalledWith("2022-06-03T03:24:55.395Z");

    const value = "2022-06-03T03:24:55.395Z";

    expect(type.parse(value)).toStrictEqual(new Date(value));
  });

  it("mocks a string", () => {
    const value = datetime().mock(faker);

    expect(value).toStrictEqual(expect.any(String));
    expect(new Date(value).toString()).not.toBe("Invalid Date");
  });

  it("allows defining the mocks", () =>
    expect([
      "2022-06-03T03:24:55.390Z",
      "2022-06-03T03:24:55.399Z",
    ]).toContainEqual(
      datetime({
        mock: (faker) =>
          faker.helpers.arrayElement([
            "2022-06-03T03:24:55.390Z",
            "2022-06-03T03:24:55.399Z",
          ]),
      }).mock(faker)
    ));

  it("mocks the same value with the same path", () => {
    expect(datetime().mock(faker)).toStrictEqual(datetime().mock(faker));
    expect(datetime().mock(faker, ".foo")).toStrictEqual(
      datetime().mock(faker, ".foo")
    );

    expect(datetime().mock(faker, ".foo")).not.toStrictEqual(
      datetime().mock(faker)
    );
    expect(datetime().mock(faker)).not.toStrictEqual(
      datetime().mock(faker, ".foo")
    );
  });

  it("allows defining the zod", () => {
    const type = datetime({
      zod: (zod) => zod.transform((value) => value.length),
    });

    const value = "2022-06-03T03:24:55.395Z";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<number>();

    expect(parsedValue).toBe(24);
  });

  it("types custom validation", () => {
    const type = datetime({
      validation: (Rule) =>
        Rule.custom((value) => {
          expectType<typeof value>().toStrictEqual<string | undefined>();

          return (value?.length ?? 0) > 50 || "Needs to be 50 characters";
        }),
    });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
