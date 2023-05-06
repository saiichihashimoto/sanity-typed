import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";

import { text } from ".";
import { mockRule } from "../test-utils";

describe("text", () => {
  it("builds a sanity config", () =>
    expect(text().schema()).toStrictEqual({
      type: "text",
      validation: expect.any(Function),
    }));

  it("passes through schema values", () =>
    expect(text({ hidden: false }).schema()).toHaveProperty("hidden", false));

  it("parses into a string", () => {
    const type = text();

    const value = "foo";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<string>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into a string", () => {
    const type = text();

    const value = "foo";
    const resolvedValue = type.parse(value);

    expectType<typeof resolvedValue>().toStrictEqual<string>();

    expect(resolvedValue).toStrictEqual(value);
  });

  it("sets min", () => {
    const type = text({ min: 3 });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.min).toHaveBeenCalledWith(3);

    const value = "foo";
    const parsedValue = type.parse(value);

    expect(parsedValue).toStrictEqual(value);

    expect(() => {
      type.parse("fo");
    }).toThrow(z.ZodError);
  });

  it("sets max", () => {
    const type = text({ max: 4 });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.max).toHaveBeenCalledWith(4);

    const value = "foo";
    const parsedValue = type.parse(value);

    expect(parsedValue).toStrictEqual(value);

    expect(() => {
      type.parse("foobar");
    }).toThrow(z.ZodError);
  });

  it("sets length", () => {
    const type = text({ length: 3 });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.length).toHaveBeenCalledWith(3);

    const value = "foo";
    const parsedValue = type.parse(value);

    expect(parsedValue).toStrictEqual(value);

    expect(() => {
      type.parse("fooo");
    }).toThrow(z.ZodError);
  });

  it("sets regex", () => {
    const type = text({ regex: /^foo$/ });

    const rule = mockRule();

    type.schema().validation(rule);

    expect(rule.regex).toHaveBeenCalledWith(/^foo$/);

    const value = "foo";
    const parsedValue = type.parse(value);

    expect(parsedValue).toStrictEqual(value);

    expect(() => {
      type.parse("bar");
    }).toThrow(z.ZodError);
  });

  it("mocks some paragraphs", () =>
    expect(text().mock(faker)).toStrictEqual(expect.any(String)));

  it("mocks the same value with the same path", () => {
    expect(text().mock(faker)).toStrictEqual(text().mock(faker));
    expect(text().mock(faker, ".foo")).toStrictEqual(
      text().mock(faker, ".foo")
    );

    expect(text().mock(faker, ".foo")).not.toStrictEqual(text().mock(faker));
    expect(text().mock(faker)).not.toStrictEqual(text().mock(faker, ".foo"));
  });

  it("allows defining the mocks", () =>
    expect(["Option 1", "Option 2"]).toContainEqual(
      text({
        mock: (faker) => faker.helpers.arrayElement(["Option 1", "Option 2"]),
      }).mock(faker)
    ));

  it("allows defining the zod", () => {
    const type = text({
      zod: (zod) => zod.transform((value) => value.length),
    });

    const value = "Test String";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<number>();

    expect(parsedValue).toBe(11);
  });

  it("types custom validation", () => {
    const type = text({
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
