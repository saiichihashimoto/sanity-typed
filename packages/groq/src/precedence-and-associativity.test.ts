import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { ReadonlyDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

describe("precendence and associativity", () => {
  describe("level 1", () => {
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
    it.todo("true=>true=>true");
  });

  describe("level 2", () => {
    it("true||false||true", async () => {
      const query = "true||false||true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: true },
          right: { type: "Value", value: false },
          type: "Or",
        },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("true||false=>false||true");
    });
  });

  describe("level 3", () => {
    it("false && true && false", async () => {
      const query = "false && true && false";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: false },
          right: { type: "Value", value: true },
          type: "And",
        },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("false&&true=>true&&false");
    });

    describe("& level 2", () => {
      it("false||true&&true||false", async () => {
        const query = "false||true&&true||false";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: false },
            right: {
              left: { type: "Value", value: true },
              right: { type: "Value", value: true },
              type: "And",
            },
            type: "Or",
          },
          right: { type: "Value", value: false },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(true);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
      });
    });
  });

  describe("level 4", () => {
    it.todo("asc & desc");

    it("true==false==true", async () => {
      const query = "true==false==true";

      expect(() => parse(query)).toThrow();
      expectType<Parse<typeof query>>().toBeNever();

      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it.failing("true!=false!=true", async () => {
      const query = "true!=false!=true";

      // TODO https://github.com/sanity-io/groq-js/issues/147
      expect(() => parse(query)).toThrow();
      expectType<Parse<typeof query>>().toBeNever();

      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("true>false>true", async () => {
      const query = "true>false>true";

      expect(() => parse(query)).toThrow();
      expectType<Parse<typeof query>>().toBeNever();

      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("true>=false>=true", async () => {
      const query = "true>=false>=true";

      expect(() => parse(query)).toThrow();
      expectType<Parse<typeof query>>().toBeNever();

      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("true<false<true", async () => {
      const query = "true<false<true";

      expect(() => parse(query)).toThrow();
      expectType<Parse<typeof query>>().toBeNever();

      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("true<=false<=true", async () => {
      const query = "true<=false<=true";

      expect(() => parse(query)).toThrow();
      expectType<Parse<typeof query>>().toBeNever();

      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    // https://github.com/saiichihashimoto/sanity-typed/issues/214
    it.todo("something in something in something");

    // https://github.com/saiichihashimoto/sanity-typed/issues/215
    it.todo("something match something match something");

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("asc & desc");

      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("true==false=>false==true");
    });

    describe("& level 2", () => {
      it("true||false==false||true", async () => {
        const query = "true||false==false||true";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: true },
            right: {
              left: { type: "Value", value: false },
              op: "==",
              right: { type: "Value", value: false },
              type: "OpCall",
            },
            type: "Or",
          },
          right: { type: "Value", value: true },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(true);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
      });

      it("true==false||false==true", async () => {
        const query = "true==false||false==true";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: true },
            op: "==",
            right: { type: "Value", value: false },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: false },
            op: "==",
            right: { type: "Value", value: true },
            type: "OpCall",
          },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
      });
    });

    describe("& level 3", () => {
      it("true&&false==false&&true", async () => {
        const query = "true&&false==false&&true";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: true },
            right: {
              left: { type: "Value", value: false },
              op: "==",
              right: { type: "Value", value: false },
              type: "OpCall",
            },
            type: "And",
          },
          right: { type: "Value", value: true },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(true);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
      });

      it("true==false&&false==true", async () => {
        const query = "true==false&&false==true";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: true },
            op: "==",
            right: { type: "Value", value: false },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: false },
            op: "==",
            right: { type: "Value", value: true },
            type: "OpCall",
          },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
      });
    });
  });

  describe("level 5", () => {
    // TODO Ranges only exist in slices
    it.todo("1..3..5");

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 2", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 3", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 4", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });
  });

  describe("level 6", () => {
    it("1+2+3", async () => {
      const query = "1+2+3";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 1 },
          op: "+",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        op: "+",
        right: { type: "Value", value: 3 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(6);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("3-2-1", async () => {
      const query = "3-2-1";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 3 },
          op: "-",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        op: "-",
        right: { type: "Value", value: 1 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(0);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("3+2-1", async () => {
      const query = "3+2-1";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 3 },
          op: "+",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        op: "-",
        right: { type: "Value", value: 1 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(4);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("3-2+1", async () => {
      const query = "3-2+1";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 3 },
          op: "-",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        op: "+",
        right: { type: "Value", value: 1 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(2);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("1+2||3+4", async () => {
        const query = "1+2||3+4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "+",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: 3 },
            op: "+",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("1||2+3||4", async () => {
        const query = "1||2+3||4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            right: {
              left: { type: "Value", value: 2 },
              op: "+",
              right: { type: "Value", value: 3 },
              type: "OpCall",
            },
            type: "Or",
          },
          right: { type: "Value", value: 4 },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 3", () => {
      it("1+2&&3+4", async () => {
        const query = "1+2&&3+4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "+",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: 3 },
            op: "+",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("1&&2+3&&4", async () => {
        const query = "1&&2+3&&4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            right: {
              left: { type: "Value", value: 2 },
              op: "+",
              right: { type: "Value", value: 3 },
              type: "OpCall",
            },
            type: "And",
          },
          right: { type: "Value", value: 4 },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 4", () => {
      it("1+2==3+4", async () => {
        const query = "1+2==3+4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "+",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          op: "==",
          right: {
            left: { type: "Value", value: 3 },
            op: "+",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<
          ExecuteQuery<typeof query>
        >().toStrictEqual<// @ts-expect-error -- TODO == between non-literal numbers always returns true, that's bad
        number>();
      });

      it("1==2+3==4", async () => {
        const query = "1==2+3==4";

        expect(() => parse(query)).toThrow();
        expectType<Parse<typeof query>>().toBeNever();

        expectType<ExecuteQuery<typeof query>>().toBeNever();
      });
    });

    describe("& level 5", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });
  });

  describe("level 7", () => {
    it("1*2*3", async () => {
      const query = "1*2*3";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 1 },
          op: "*",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        op: "*",
        right: { type: "Value", value: 3 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(6);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("6/3/2", async () => {
      const query = "6/3/2";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 6 },
          op: "/",
          right: { type: "Value", value: 3 },
          type: "OpCall",
        },
        op: "/",
        right: { type: "Value", value: 2 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("5%3%2", async () => {
      const query = "5%3%2";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 5 },
          op: "%",
          right: { type: "Value", value: 3 },
          type: "OpCall",
        },
        op: "%",
        right: { type: "Value", value: 2 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(0);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("3*2/6", async () => {
      const query = "3*2/6";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 3 },
          op: "*",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        op: "/",
        right: { type: "Value", value: 6 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("6/3*2", async () => {
      const query = "6/3*2";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: {
          left: { type: "Value", value: 6 },
          op: "/",
          right: { type: "Value", value: 3 },
          type: "OpCall",
        },
        op: "*",
        right: { type: "Value", value: 2 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(4);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("1*2||3*4", async () => {
        const query = "1*2||3*4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "*",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: 3 },
            op: "*",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("1||2*3||4", async () => {
        const query = "1||2*3||4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            right: {
              left: { type: "Value", value: 2 },
              op: "*",
              right: { type: "Value", value: 3 },
              type: "OpCall",
            },
            type: "Or",
          },
          right: { type: "Value", value: 4 },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 3", () => {
      it("1*2&&3*4", async () => {
        const query = "1*2&&3*4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "*",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: 3 },
            op: "*",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("1&&2*3&&4", async () => {
        const query = "1&&2*3&&4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            right: {
              left: { type: "Value", value: 2 },
              op: "*",
              right: { type: "Value", value: 3 },
              type: "OpCall",
            },
            type: "And",
          },
          right: { type: "Value", value: 4 },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 4", () => {
      it("1*2==3*4", async () => {
        const query = "1*2==3*4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "*",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          op: "==",
          right: {
            left: { type: "Value", value: 3 },
            op: "*",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<
          ExecuteQuery<typeof query>
        >().toStrictEqual<// @ts-expect-error -- TODO == between non-literal numbers always returns true, that's bad
        number>();
      });

      it("1==2*3==4", async () => {
        const query = "1==2*3==4";

        expect(() => parse(query)).toThrow();
        expectType<Parse<typeof query>>().toBeNever();

        expectType<ExecuteQuery<typeof query>>().toBeNever();
      });
    });

    describe("& level 5", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("1*2+3*4", async () => {
        const query = "1*2+3*4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "*",
            right: { type: "Value", value: 2 },
            type: "OpCall",
          },
          op: "+",
          right: {
            left: { type: "Value", value: 3 },
            op: "*",
            right: { type: "Value", value: 4 },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(14);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });

      it("1+2*3+4", async () => {
        const query = "1+2*3+4";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 1 },
            op: "+",
            right: {
              left: { type: "Value", value: 2 },
              op: "*",
              right: { type: "Value", value: 3 },
              type: "OpCall",
            },
            type: "OpCall",
          },
          op: "+",
          right: { type: "Value", value: 4 },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(11);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });
  });

  describe("level 8", () => {
    it("--1", async () => {
      const query = "--1";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { base: { type: "Value", value: 1 }, type: "Neg" },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("-2||-3", async () => {
        const query = "-2||-3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 3", () => {
      it("-2&&-3", async () => {
        const query = "-2&&-3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 4", () => {
      it("-2==-3", async () => {
        const query = "-2==-3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          op: "==",
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
      });
    });

    describe("& level 5", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("-2--3", async () => {
        const query = "-2--3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          op: "-",
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(1);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });

    describe("& level 7", () => {
      it("-2*-3", async () => {
        const query = "-2*-3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          op: "*",
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(6);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });
  });

  describe("level 9", () => {
    it("4**3**2", async () => {
      const query = "4**3**2";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "**",
        right: {
          left: { type: "Value", value: 3 },
          op: "**",
          right: { type: "Value", value: 2 },
          type: "OpCall",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(262144);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("2**3||4**5", async () => {
        const query = "2**3||4**5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { type: "Value", value: 3 },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: 4 },
            op: "**",
            right: { type: "Value", value: 5 },
            type: "OpCall",
          },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("2||3**4||5", async () => {
        const query = "2||3**4||5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            right: {
              left: { type: "Value", value: 3 },
              op: "**",
              right: { type: "Value", value: 4 },
              type: "OpCall",
            },
            type: "Or",
          },
          right: { type: "Value", value: 5 },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 3", () => {
      it("2**3&&4**5", async () => {
        const query = "2**3&&4**5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { type: "Value", value: 3 },
            type: "OpCall",
          },
          right: {
            left: { type: "Value", value: 4 },
            op: "**",
            right: { type: "Value", value: 5 },
            type: "OpCall",
          },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("2&&3**4&&5", async () => {
        const query = "2&&3**4&&5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            right: {
              left: { type: "Value", value: 3 },
              op: "**",
              right: { type: "Value", value: 4 },
              type: "OpCall",
            },
            type: "And",
          },
          right: { type: "Value", value: 5 },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });
    });

    describe("& level 4", () => {
      it("2**3==4**5", async () => {
        const query = "2**3==4**5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { type: "Value", value: 3 },
            type: "OpCall",
          },
          op: "==",
          right: {
            left: { type: "Value", value: 4 },
            op: "**",
            right: { type: "Value", value: 5 },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<
          ExecuteQuery<typeof query>
        >().toStrictEqual<// @ts-expect-error -- TODO == between non-literal numbers always returns true, that's bad
        boolean>();
      });

      it("2==3**4==5", async () => {
        const query = "2==3**4==5";

        expect(() => parse(query)).toThrow();
        expectType<Parse<typeof query>>().toBeNever();

        expectType<ExecuteQuery<typeof query>>().toBeNever();
      });
    });

    describe("& level 5", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("2**3+4**5", async () => {
        const query = "2**3+4**5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { type: "Value", value: 3 },
            type: "OpCall",
          },
          op: "+",
          right: {
            left: { type: "Value", value: 4 },
            op: "**",
            right: { type: "Value", value: 5 },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(1032);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });

      it("2+3**4+5", async () => {
        const query = "2+3**4+5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "+",
            right: {
              left: { type: "Value", value: 3 },
              op: "**",
              right: { type: "Value", value: 4 },
              type: "OpCall",
            },
            type: "OpCall",
          },
          op: "+",
          right: { type: "Value", value: 5 },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(88);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });

    describe("& level 7", () => {
      it("2**3*4**5", async () => {
        const query = "2**3*4**5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { type: "Value", value: 3 },
            type: "OpCall",
          },
          op: "*",
          right: {
            left: { type: "Value", value: 4 },
            op: "**",
            right: { type: "Value", value: 5 },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(8192);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });

      it("2*3**4*5", async () => {
        const query = "2*3**4*5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: {
            left: { type: "Value", value: 2 },
            op: "*",
            right: {
              left: { type: "Value", value: 3 },
              op: "**",
              right: { type: "Value", value: 4 },
              type: "OpCall",
            },
            type: "OpCall",
          },
          op: "*",
          right: { type: "Value", value: 5 },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(810);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });

    describe("& level 8", () => {
      it("-2**-2", async () => {
        const query = "-2**-2";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          base: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { base: { type: "Value", value: 2 }, type: "Neg" },
            type: "OpCall",
          },
          type: "Neg",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(-0.25);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });
  });

  describe("level 10", () => {
    it("++5", async () => {
      const query = "++5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { base: { type: "Value", value: 5 }, type: "Pos" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(5);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<5>();
    });

    it("!!true", async () => {
      const query = "!!true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { base: { type: "Value", value: true }, type: "Not" },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("!+5", async () => {
      const query = "!+5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { base: { type: "Value", value: 5 }, type: "Pos" },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("+!true", async () => {
      const query = "+!true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { base: { type: "Value", value: true }, type: "Not" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("!true||!false", async () => {
        const query = "!true||!false";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: true }, type: "Not" },
          right: { base: { type: "Value", value: false }, type: "Not" },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(true);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
      });
    });

    describe("& level 3", () => {
      it("!true&&!false", async () => {
        const query = "!true&&!false";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: true }, type: "Not" },
          right: { base: { type: "Value", value: false }, type: "Not" },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(false);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
      });
    });

    describe("& level 4", () => {
      it("!true!=!false", async () => {
        const query = "!true!=!false";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: true }, type: "Not" },
          op: "!=",
          right: { base: { type: "Value", value: false }, type: "Not" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(true);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
      });
    });

    describe("& level 5", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("+1++2", async () => {
        const query = "+1++2";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 1 }, type: "Pos" },
          op: "+",
          right: { base: { type: "Value", value: 2 }, type: "Pos" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(3);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });

    describe("& level 7", () => {
      it("+2*+3", async () => {
        const query = "+2*+3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Pos" },
          op: "*",
          right: { base: { type: "Value", value: 3 }, type: "Pos" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(6);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });

    describe("& level 8", () => {
      it("+-5", async () => {
        const query = "+-5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          base: { base: { type: "Value", value: 5 }, type: "Neg" },
          type: "Pos",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(-5);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<-5>();
      });

      it("-+5", async () => {
        const query = "-+5";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          base: { base: { type: "Value", value: 5 }, type: "Pos" },
          type: "Neg",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(-5);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<-5>();
      });
    });

    describe("& level 9", () => {
      it("+2**+3", async () => {
        const query = "+2**+3";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          left: { base: { type: "Value", value: 2 }, type: "Pos" },
          op: "**",
          right: { base: { type: "Value", value: 3 }, type: "Pos" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(desiredTree);
        expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
          typeof desiredTree
        >();

        expect(result).toBe(8);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
      });
    });
  });

  describe("level 11", () => {
    it.todo("todo");

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it.todo("todo");
    });

    describe("& level 3", () => {
      it.todo("todo");
    });

    describe("& level 4", () => {
      it.todo("todo");
    });

    describe("& level 5", () => {
      // TODO Ranges only exist in slices
      it.todo("todo");
    });

    describe("& level 6", () => {
      it.todo("todo");
    });

    describe("& level 7", () => {
      it.todo("todo");
    });

    describe("& level 8", () => {
      it.todo("todo");
    });

    describe("& level 9", () => {
      it.todo("todo");
    });

    describe("& level 10", () => {
      it.todo("todo");
    });
  });
});
