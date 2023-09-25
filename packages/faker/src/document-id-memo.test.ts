import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "@jest/globals";

import { defineConfig, defineField, defineType } from "@sanity-typed/types";

import { _sanityConfigToFaker } from ".";

describe("document-id-memo", () => {
  beforeEach(() => {
    faker.seed(0);
  });

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
    const sanityFaker = _sanityConfigToFaker(config, { faker });

    // Mixing up the order to ensure it works regardless

    const { _ref: bar0 } = sanityFaker.bar();
    const { _id: foo0 } = sanityFaker.foo();
    const { _id: foo1 } = sanityFaker.foo();
    const { _ref: bar1 } = sanityFaker.bar();
    const { _ref: bar2 } = sanityFaker.bar();
    const { _id: foo2 } = sanityFaker.foo();
    const { _id: foo3 } = sanityFaker.foo();
    const { _ref: bar3 } = sanityFaker.bar();
    const { _ref: bar4 } = sanityFaker.bar();
    const { _id: foo4 } = sanityFaker.foo();
    const { _id: foo5 } = sanityFaker.foo();
    const { _ref: bar5 } = sanityFaker.bar();
    const { _ref: bar6 } = sanityFaker.bar();
    const { _id: foo6 } = sanityFaker.foo();
    const { _id: foo7 } = sanityFaker.foo();
    const { _ref: bar7 } = sanityFaker.bar();
    const { _ref: bar8 } = sanityFaker.bar();
    const { _id: foo8 } = sanityFaker.foo();
    const { _id: foo9 } = sanityFaker.foo();
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
    const sanityFaker = _sanityConfigToFaker(config, {
      faker,
      referencedChunkSize: 2,
    });

    const { _ref: bar0 } = sanityFaker.bar();
    const { _id: foo0 } = sanityFaker.foo();
    const { _id: foo1 } = sanityFaker.foo();
    const { _ref: bar1 } = sanityFaker.bar();
    const { _ref: bar2 } = sanityFaker.bar();
    const { _id: foo2 } = sanityFaker.foo();
    const { _id: foo3 } = sanityFaker.foo();
    const { _ref: bar3 } = sanityFaker.bar();

    expect([foo0, foo1]).toContain(bar0);
    expect([foo0, foo1]).toContain(bar1);

    expect([foo2, foo3]).toContain(bar2);
    expect([foo2, foo3]).toContain(bar3);
  });
});
