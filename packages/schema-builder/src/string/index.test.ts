import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";

import { string } from ".";
import { mockRule } from "../test-utils";
import type { InferValue } from "../types";

describe("string", () => {
  it("builds a sanity config", () =>
    expect(string().schema()).toStrictEqual({
      type: "string",
      options: undefined,
      validation: expect.any(Function),
    }));

  it("passes through schema values", () =>
    expect(string({ hidden: false }).schema()).toHaveProperty("hidden", false));

  it("parses into a string", () => {
    const type = string();

    const value = "foo";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<string>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into a string", () => {
    const type = string();

    const value = "foo";
    const resolvedValue = type.parse(value);

    expectType<typeof resolvedValue>().toStrictEqual<string>();

    expect(resolvedValue).toStrictEqual(value);
  });

  it("sets min", () => {
    const type = string({ min: 3 });

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
    const type = string({ max: 4 });

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
    const type = string({ length: 3 });

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
    const type = string({ regex: /^foo$/ });

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

  it("mocks a word", () =>
    expect(string().mock(faker)).toStrictEqual(expect.any(String)));

  it("mocks the same value with the same path", () => {
    expect(string().mock(faker)).toStrictEqual(string().mock(faker));
    expect(string().mock(faker, ".foo")).toStrictEqual(
      string().mock(faker, ".foo")
    );

    expect(string().mock(faker, ".foo")).not.toStrictEqual(
      string().mock(faker)
    );
    expect(string().mock(faker)).not.toStrictEqual(
      string().mock(faker, ".foo")
    );
  });

  it("allows defining the mocks", () =>
    expect(["Option 1", "Option 2"]).toContainEqual(
      string({
        mock: (faker) => faker.helpers.arrayElement(["Option 1", "Option 2"]),
      }).mock(faker)
    ));

  it("allows defining the zod", () => {
    const type = string({
      zod: (zod) => zod.transform((value) => value.length),
    });

    const value = "Test String";
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<number>();

    expect(parsedValue).toBe(11);
  });

  it("types custom validation", () => {
    const type = string({
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

  it("types values from list", () => {
    const type = string({
      options: {
        list: ["foo", { title: "Bar", value: "bar" }],
      },
    });

    const value = "foo" as InferValue<typeof type>;
    const parsedValue = type.parse(value);
    const resolvedValue = type.resolve(value);

    expectType<typeof value>().toStrictEqual<"bar" | "foo">();
    expectType<typeof parsedValue>().toStrictEqual<"bar" | "foo">();
    expectType<typeof resolvedValue>().toStrictEqual<"bar" | "foo">();

    expect(parsedValue).toStrictEqual(value);
    expect(["foo", "bar"]).toContain(type.mock(faker));

    expect(() => {
      type.parse("fo");
    }).toThrow(z.ZodError);
  });
});
