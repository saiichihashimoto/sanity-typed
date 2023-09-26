import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import { defineConfig, defineField, defineType } from "@sanity-typed/types";

import { sanityConfigToFakerTyped } from "./internal";

describe("document-id-memo", () => {
  it("mocks references that refer to documents", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineType({
            name: "bar",
            type: "reference",
            to: [{ type: "foo" as const }],
          }),
        ],
      },
    });
    const sanityFaker = sanityConfigToFakerTyped(config, {
      faker: { locale: [en, base] },
    });

    const { _id: foo0 } = sanityFaker.foo();
    const { _id: foo1 } = sanityFaker.foo();
    const { _id: foo2 } = sanityFaker.foo();
    const { _id: foo3 } = sanityFaker.foo();
    const { _id: foo4 } = sanityFaker.foo();
    const { _id: foo5 } = sanityFaker.foo();
    const { _id: foo6 } = sanityFaker.foo();
    const { _id: foo7 } = sanityFaker.foo();
    const { _id: foo8 } = sanityFaker.foo();
    const { _id: foo9 } = sanityFaker.foo();
    const { _ref: bar0 } = sanityFaker.bar();
    const { _ref: bar1 } = sanityFaker.bar();
    const { _ref: bar2 } = sanityFaker.bar();
    const { _ref: bar3 } = sanityFaker.bar();
    const { _ref: bar4 } = sanityFaker.bar();
    const { _ref: bar5 } = sanityFaker.bar();
    const { _ref: bar6 } = sanityFaker.bar();
    const { _ref: bar7 } = sanityFaker.bar();
    const { _ref: bar8 } = sanityFaker.bar();
    const { _ref: bar9 } = sanityFaker.bar();

    expect([foo0, foo1, foo2, foo3, foo4]).toContain(bar0);
    expect([foo0, foo1, foo2, foo3, foo4]).toContain(bar1);
    expect([foo0, foo1, foo2, foo3, foo4]).toContain(bar2);
    expect([foo0, foo1, foo2, foo3, foo4]).toContain(bar3);
    expect([foo0, foo1, foo2, foo3, foo4]).toContain(bar4);

    expect([foo5, foo6, foo7, foo8, foo9]).toContain(bar5);
    expect([foo5, foo6, foo7, foo8, foo9]).toContain(bar6);
    expect([foo5, foo6, foo7, foo8, foo9]).toContain(bar7);
    expect([foo5, foo6, foo7, foo8, foo9]).toContain(bar8);
    expect([foo5, foo6, foo7, foo8, foo9]).toContain(bar9);
  });

  it("allows different chunk sizes", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineType({
            name: "bar",
            type: "reference",
            to: [{ type: "foo" as const }],
          }),
        ],
      },
    });
    const sanityFaker = sanityConfigToFakerTyped(config, {
      faker: { locale: [en, base] },
      referencedChunkSize: 2,
    });

    const { _id: foo0 } = sanityFaker.foo();
    const { _id: foo1 } = sanityFaker.foo();
    const { _id: foo2 } = sanityFaker.foo();
    const { _id: foo3 } = sanityFaker.foo();
    const { _ref: bar0 } = sanityFaker.bar();
    const { _ref: bar1 } = sanityFaker.bar();
    const { _ref: bar2 } = sanityFaker.bar();
    const { _ref: bar3 } = sanityFaker.bar();

    expect([foo0, foo1]).toContain(bar0);
    expect([foo0, foo1]).toContain(bar1);

    expect([foo2, foo3]).toContain(bar2);
    expect([foo2, foo3]).toContain(bar3);
  });

  it("mocks the same document and reference ids, regardless of order called", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineType({
            name: "bar",
            type: "reference",
            to: [{ type: "foo" as const }],
          }),
        ],
      },
    });

    const sanityFaker1 = sanityConfigToFakerTyped(config, {
      faker: { locale: [en, base] },
    });
    const { _id: foo10 } = sanityFaker1.foo();
    const { _id: foo11 } = sanityFaker1.foo();
    const { _id: foo12 } = sanityFaker1.foo();
    const { _id: foo13 } = sanityFaker1.foo();
    const { _id: foo14 } = sanityFaker1.foo();
    const { _id: foo15 } = sanityFaker1.foo();
    const { _id: foo16 } = sanityFaker1.foo();
    const { _id: foo17 } = sanityFaker1.foo();
    const { _id: foo18 } = sanityFaker1.foo();
    const { _id: foo19 } = sanityFaker1.foo();
    const { _ref: bar10 } = sanityFaker1.bar();
    const { _ref: bar11 } = sanityFaker1.bar();
    const { _ref: bar12 } = sanityFaker1.bar();
    const { _ref: bar13 } = sanityFaker1.bar();
    const { _ref: bar14 } = sanityFaker1.bar();
    const { _ref: bar15 } = sanityFaker1.bar();
    const { _ref: bar16 } = sanityFaker1.bar();
    const { _ref: bar17 } = sanityFaker1.bar();
    const { _ref: bar18 } = sanityFaker1.bar();
    const { _ref: bar19 } = sanityFaker1.bar();

    const sanityFaker2 = sanityConfigToFakerTyped(config, {
      faker: { locale: [en, base] },
    });
    const { _ref: bar20 } = sanityFaker2.bar();
    const { _ref: bar21 } = sanityFaker2.bar();
    const { _ref: bar22 } = sanityFaker2.bar();
    const { _ref: bar23 } = sanityFaker2.bar();
    const { _ref: bar24 } = sanityFaker2.bar();
    const { _ref: bar25 } = sanityFaker2.bar();
    const { _ref: bar26 } = sanityFaker2.bar();
    const { _ref: bar27 } = sanityFaker2.bar();
    const { _ref: bar28 } = sanityFaker2.bar();
    const { _ref: bar29 } = sanityFaker2.bar();
    const { _id: foo20 } = sanityFaker2.foo();
    const { _id: foo21 } = sanityFaker2.foo();
    const { _id: foo22 } = sanityFaker2.foo();
    const { _id: foo23 } = sanityFaker2.foo();
    const { _id: foo24 } = sanityFaker2.foo();
    const { _id: foo25 } = sanityFaker2.foo();
    const { _id: foo26 } = sanityFaker2.foo();
    const { _id: foo27 } = sanityFaker2.foo();
    const { _id: foo28 } = sanityFaker2.foo();
    const { _id: foo29 } = sanityFaker2.foo();

    expect(foo10).toStrictEqual(foo20);
    expect(foo11).toStrictEqual(foo21);
    expect(foo12).toStrictEqual(foo22);
    expect(foo13).toStrictEqual(foo23);
    expect(foo14).toStrictEqual(foo24);
    expect(foo15).toStrictEqual(foo25);
    expect(foo16).toStrictEqual(foo26);
    expect(foo17).toStrictEqual(foo27);
    expect(foo18).toStrictEqual(foo28);
    expect(foo19).toStrictEqual(foo29);

    expect(bar10).toStrictEqual(bar20);
    expect(bar11).toStrictEqual(bar21);
    expect(bar12).toStrictEqual(bar22);
    expect(bar13).toStrictEqual(bar23);
    expect(bar14).toStrictEqual(bar24);
    expect(bar15).toStrictEqual(bar25);
    expect(bar16).toStrictEqual(bar26);
    expect(bar17).toStrictEqual(bar27);
    expect(bar18).toStrictEqual(bar28);
    expect(bar19).toStrictEqual(bar29);
  });
});
