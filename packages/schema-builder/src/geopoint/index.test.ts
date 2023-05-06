import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import type { GeopointValue } from "sanity";

import { geopoint } from ".";
import { mockRule } from "../test-utils";
import type { Equal, Expect } from "../test-utils";
import type { InferValue } from "../types";

describe("geopoint", () => {
  it("builds a sanity config", () =>
    expect(geopoint().schema()).toStrictEqual({
      type: "geopoint",
    }));

  it("passes through schema values", () =>
    expect(geopoint({ hidden: false }).schema()).toHaveProperty(
      "hidden",
      false
    ));

  it("parses into a geopoint", () => {
    const type = geopoint();

    const value = {
      _type: "geopoint",
      lat: 58.63169011423141,
      lng: 9.089101352587932,
      alt: 13.37,
    } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    type Assertions = [
      Expect<Equal<typeof value, GeopointValue>>,
      Expect<Equal<typeof parsedValue, GeopointValue>>
    ];

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into a geopoint", () => {
    const type = geopoint();

    const value = {
      _type: "geopoint",
      lat: 58.63169011423141,
      lng: 9.089101352587932,
      alt: 13.37,
    } as InferValue<typeof type>;
    const resolvedValue = type.resolve(value);

    type Assertions = [
      Expect<Equal<typeof value, GeopointValue>>,
      Expect<Equal<typeof resolvedValue, GeopointValue>>
    ];

    expect(resolvedValue).toStrictEqual(value);
  });

  it("mocks a geopoint", () =>
    expect(geopoint().mock(faker)).toStrictEqual({
      _type: "geopoint",
      lat: expect.any(Number),
      lng: expect.any(Number),
      alt: expect.any(Number),
    }));

  it("mocks the same value with the same path", () => {
    expect(geopoint().mock(faker)).toStrictEqual(geopoint().mock(faker));
    expect(geopoint().mock(faker, ".foo")).toStrictEqual(
      geopoint().mock(faker, ".foo")
    );

    expect(geopoint().mock(faker, ".foo")).not.toStrictEqual(
      geopoint().mock(faker)
    );
    expect(geopoint().mock(faker)).not.toStrictEqual(
      geopoint().mock(faker, ".foo")
    );
  });

  it("allows defining the mocks", () =>
    expect([
      {
        _type: "geopoint",
        lat: 58.63169011423141,
        lng: 9.089101352587932,
        alt: 13.37,
      },
      {
        _type: "geopoint",
        lat: -58.63169011423141,
        lng: -9.089101352587932,
        alt: 12.37,
      },
    ]).toContainEqual(
      geopoint({
        mock: (faker) =>
          faker.helpers.arrayElement([
            {
              _type: "geopoint",
              lat: 58.63169011423141,
              lng: 9.089101352587932,
              alt: 13.37,
            },
            {
              _type: "geopoint",
              lat: -58.63169011423141,
              lng: -9.089101352587932,
              alt: 12.37,
            },
          ]),
      }).mock(faker)
    ));

  it("allows defining the zod", () => {
    const type = geopoint({
      zod: (zod) => zod.transform(({ lat }) => lat),
    });

    const parsedValue = type.parse({
      _type: "geopoint",
      lat: 58.63169011423141,
      lng: 9.089101352587932,
      alt: 13.37,
    });

    type Assertions = [Expect<Equal<typeof parsedValue, number>>];

    expect(parsedValue).toBe(58.63169011423141);
  });

  it("types custom validation", () => {
    const type = geopoint({
      validation: (Rule) =>
        Rule.custom((value) => {
          type Assertions = [
            Expect<Equal<typeof value, GeopointValue | undefined>>
          ];

          return (value?.lat ?? 0) > 50 || "Needs to be greater than 50";
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
