import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  definePlugin,
  defineType,
} from ".";
import type { AliasValue, InferSchemaValues, _InferValue } from ".";

describe("array", () => {
  describe("defineArrayMember", () => {
    it("is a typescript error", () => {
      // @ts-expect-error -- arrays can't be children of arrays https://www.sanity.io/docs/array-type#fNBIr84P
      const arrayMember = defineArrayMember({
        type: "array",
        of: [],
      });

      expectType<_InferValue<typeof arrayMember>>().toBeNever();
    });
  });

  describe("defineField", () => {
    it("infers array of the member", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<boolean[]>();
    });

    it("infers unions if there are multiple members", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({ type: "boolean" }),
          defineArrayMember({ type: "string" }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        (boolean | string)[]
      >();
    });

    it('adds "_key" to objects', () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        ({
          _key: string;
        } & {
          bar?: boolean;
        })[]
      >();
    });

    it('adds "_type" to named objects', () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            name: "inlineMemberName",
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        ({
          _key: string;
        } & {
          _type: "inlineMemberName";
        } & {
          bar?: boolean;
        })[]
      >();
    });

    it("infers unions with objects", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "bar",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            type: "object",
            name: "qux",
            fields: [
              defineField({
                name: "qux",
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        (
          | ({
              _key: string;
            } & {
              _type: "bar";
            } & {
              bar?: boolean;
            })
          | ({
              _key: string;
            } & {
              _type: "qux";
            } & {
              qux?: boolean;
            })
        )[]
      >();
    });

    it('adds "_type" to named alias values', () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            name: "inlineMemberName",
            type: "named",
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        (AliasValue<"named"> & {
          _key: string;
        } & {
          _type: "inlineMemberName";
        })[]
      >();
    });
  });

  describe("defineType", () => {
    it("infers array of the member", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<boolean[]>();
    });

    it("infers unions if there are multiple members", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({ type: "boolean" }),
          defineArrayMember({ type: "string" }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        (boolean | string)[]
      >();
    });

    it('adds "_key" to objects', () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        ({
          _key: string;
        } & {
          bar?: boolean;
        })[]
      >();
    });

    it('adds "_type" to named objects', () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            name: "inlineMemberName",
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        ({
          _key: string;
        } & {
          _type: "inlineMemberName";
        } & {
          bar?: boolean;
        })[]
      >();
    });

    it("infers unions with objects", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "bar",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            type: "object",
            name: "qux",
            fields: [
              defineField({
                name: "qux",
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        (
          | ({
              _key: string;
            } & {
              _type: "bar";
            } & {
              bar?: boolean;
            })
          | ({
              _key: string;
            } & {
              _type: "qux";
            } & {
              qux?: boolean;
            })
        )[]
      >();
    });

    it('adds "_type" to named alias values', () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            name: "inlineMemberName",
            type: "named",
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        (AliasValue<"named"> & {
          _key: string;
        } & {
          _type: "inlineMemberName";
        })[]
      >();
    });
  });

  describe("defineConfig", () => {
    it('adds "_type" to inferred types', () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              title: "Body sections",
              name: "thearr",
              type: "array",
              of: [
                defineArrayMember({
                  type: "foo",
                }),
              ],
            }),
            defineType({
              title: "Foo",
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["thearr"]>().toStrictEqual<
        ({
          _key: string;
        } & {
          _type: "foo";
        } & {
          value?: boolean;
        })[]
      >();
    });

    it('overrides "_type" with arrayMember name', () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              title: "Body sections",
              name: "thearr",
              type: "array",
              of: [
                defineArrayMember({
                  name: "aliasedMemberName",
                  type: "foo",
                }),
              ],
            }),
            defineType({
              title: "Foo",
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["thearr"]>().toStrictEqual<
        ({
          _key: string;
          _type: "aliasedMemberName";
        } & {
          value?: boolean;
        })[]
      >();
    });
  });

  describe("definePlugin", () => {
    it('adds "_type" to inferred types', () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              title: "Body sections",
              name: "thearr",
              type: "array",
              of: [
                defineArrayMember({
                  type: "foo",
                }),
              ],
            }),
            defineType({
              title: "Foo",
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      })();

      expectType<InferSchemaValues<typeof plugin>["thearr"]>().toStrictEqual<
        ({
          _key: string;
        } & {
          _type: "foo";
        } & {
          value?: boolean;
        })[]
      >();
    });

    it('overrides "_type" with arrayMember name', () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              title: "Body sections",
              name: "thearr",
              type: "array",
              of: [
                defineArrayMember({
                  name: "aliasedMemberName",
                  type: "foo",
                }),
              ],
            }),
            defineType({
              title: "Foo",
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      })();

      expectType<InferSchemaValues<typeof plugin>["thearr"]>().toStrictEqual<
        ({
          _key: string;
          _type: "aliasedMemberName";
        } & {
          value?: boolean | undefined;
        })[]
      >();
    });
  });
});
