import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { GroqPipeFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";
import type {
  ScopeFromPartialContext,
  ScopeFromPartialScope,
} from "./internal";

describe("precendence and associativity", () => {
  describe("level 1", () => {
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
    it.todo("true=>true=>true");
  });

  describe("level 2", () => {
    it("true||false||true", async () => {
      const query = "true||false||true";

      const tree = parse(query);

      const expectedTree = {
        left: {
          left: { type: "Value", value: true },
          right: { type: "Value", value: false },
          type: "Or",
        },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
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

      const expectedTree = {
        left: {
          left: { type: "Value", value: false },
          right: { type: "Value", value: true },
          type: "And",
        },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("false&&true=>true&&false");
    });

    describe("& level 2", () => {
      it("false||true&&true||false", async () => {
        const query = "false||true&&true||false";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });
  });

  describe("level 4", () => {
    it.todo("asc & desc");

    it("true==false==true", async () => {
      const query = "true==false==true";

      expect(() => parse(query)).toThrow(
        "Syntax error in GROQ query at position 10"
      );
      expectType<Parse<typeof query>>().toStrictEqual<never>();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
    });

    it("true!=false!=true", async () => {
      const query = "true!=false!=true";

      expect(() => parse(query)).toThrow(
        "Syntax error in GROQ query at position 10"
      );
      expectType<Parse<typeof query>>().toStrictEqual<never>();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
    });

    it("true>false>true", async () => {
      const query = "true>false>true";

      expect(() => parse(query)).toThrow(
        "Syntax error in GROQ query at position 9"
      );
      expectType<Parse<typeof query>>().toStrictEqual<never>();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
    });

    it("true>=false>=true", async () => {
      const query = "true>=false>=true";

      expect(() => parse(query)).toThrow(
        "Syntax error in GROQ query at position 10"
      );
      expectType<Parse<typeof query>>().toStrictEqual<never>();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
    });

    it("true<false<true", async () => {
      const query = "true<false<true";

      expect(() => parse(query)).toThrow(
        "Syntax error in GROQ query at position 9"
      );
      expectType<Parse<typeof query>>().toStrictEqual<never>();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
    });

    it("true<=false<=true", async () => {
      const query = "true<=false<=true";

      expect(() => parse(query)).toThrow(
        "Syntax error in GROQ query at position 10"
      );
      expectType<Parse<typeof query>>().toStrictEqual<never>();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
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

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("true==false||false==true", async () => {
        const query = "true==false||false==true";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 3", () => {
      it("true&&false==false&&true", async () => {
        const query = "true&&false==false&&true";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("true==false&&false==true", async () => {
        const query = "true==false&&false==true";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });
  });

  describe("level 5", () => {
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
    it.todo("1..3..5");

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 2", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 3", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 4", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });
  });

  describe("level 6", () => {
    it("1+2+3", async () => {
      const query = "1+2+3";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 6 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("3-2-1", async () => {
      const query = "3-2-1";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 0 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("3+2-1", async () => {
      const query = "3+2-1";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 4 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("3-2+1", async () => {
      const query = "3-2+1";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 2 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("1+2||3+4", async () => {
        const query = "1+2||3+4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("1||2+3||4", async () => {
        const query = "1||2+3||4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 3", () => {
      it("1+2&&3+4", async () => {
        const query = "1+2&&3+4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("1&&2+3&&4", async () => {
        const query = "1&&2+3&&4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 4", () => {
      it("1+2==3+4", async () => {
        const query = "1+2==3+4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false as boolean;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>()
          // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/333
          .toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("1==2+3==4", async () => {
        const query = "1==2+3==4";

        expect(() => parse(query)).toThrow(
          "Syntax error in GROQ query at position 5"
        );
        expectType<Parse<typeof query>>().toStrictEqual<never>();

        expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
      });
    });

    describe("& level 5", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });
  });

  describe("level 7", () => {
    it("1*2*3", async () => {
      const query = "1*2*3";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 6 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("6/3/2", async () => {
      const query = "6/3/2";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("5%3%2", async () => {
      const query = "5%3%2";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 0 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("3*2/6", async () => {
      const query = "3*2/6";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("6/3*2", async () => {
      const query = "6/3*2";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 4 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("1*2||3*4", async () => {
        const query = "1*2||3*4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("1||2*3||4", async () => {
        const query = "1||2*3||4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 3", () => {
      it("1*2&&3*4", async () => {
        const query = "1*2&&3*4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("1&&2*3&&4", async () => {
        const query = "1&&2*3&&4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 4", () => {
      it("1*2==3*4", async () => {
        const query = "1*2==3*4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>()
          // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/333
          .toStrictEqual<WritableDeep<typeof expectedTree>>();
      });

      it("1==2*3==4", async () => {
        const query = "1==2*3==4";

        expect(() => parse(query)).toThrow(
          "Syntax error in GROQ query at position 5"
        );
        expectType<Parse<typeof query>>().toStrictEqual<never>();

        expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
      });
    });

    describe("& level 5", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("1*2+3*4", async () => {
        const query = "1*2+3*4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 14 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("1+2*3+4", async () => {
        const query = "1+2*3+4";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 11 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });
  });

  describe("level 8", () => {
    it("--1", async () => {
      const query = "--1";

      const tree = parse(query);

      const expectedTree = {
        base: { base: { type: "Value", value: 1 }, type: "Neg" },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("-2||-3", async () => {
        const query = "-2||-3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 3", () => {
      it("-2&&-3", async () => {
        const query = "-2&&-3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 4", () => {
      it("-2==-3", async () => {
        const query = "-2==-3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          op: "==",
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 5", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("-2--3", async () => {
        const query = "-2--3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          op: "-",
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 1 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 7", () => {
      it("-2*-3", async () => {
        const query = "-2*-3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Neg" },
          op: "*",
          right: { base: { type: "Value", value: 3 }, type: "Neg" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 6 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });
  });

  describe("level 9", () => {
    it("4**3**2", async () => {
      const query = "4**3**2";

      const tree = parse(query);

      const expectedTree = {
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

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 262144 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("2**3||4**5", async () => {
        const query = "2**3||4**5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("2||3**4||5", async () => {
        const query = "2||3**4||5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 3", () => {
      it("2**3&&4**5", async () => {
        const query = "2**3&&4**5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("2&&3**4&&5", async () => {
        const query = "2&&3**4&&5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 4", () => {
      it("2**3==4**5", async () => {
        const query = "2**3==4**5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false as boolean;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>()
          // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/333
          .toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("2==3**4==5", async () => {
        const query = "2==3**4==5";

        expect(() => parse(query)).toThrow(
          "Syntax error in GROQ query at position 6"
        );
        expectType<Parse<typeof query>>().toStrictEqual<never>();

        expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
      });
    });

    describe("& level 5", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("2**3+4**5", async () => {
        const query = "2**3+4**5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 1032 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("2+3**4+5", async () => {
        const query = "2+3**4+5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 88 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 7", () => {
      it("2**3*4**5", async () => {
        const query = "2**3*4**5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 8192 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("2*3**4*5", async () => {
        const query = "2*3**4*5";

        const tree = parse(query);

        const expectedTree = {
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

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 810 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 8", () => {
      it("-2**-2", async () => {
        const query = "-2**-2";

        const tree = parse(query);

        const expectedTree = {
          base: {
            left: { type: "Value", value: 2 },
            op: "**",
            right: { base: { type: "Value", value: 2 }, type: "Neg" },
            type: "OpCall",
          },
          type: "Neg",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = -0.25 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });
  });

  describe("level 10", () => {
    it("++5", async () => {
      const query = "++5";

      const tree = parse(query);

      const expectedTree = {
        base: { base: { type: "Value", value: 5 }, type: "Pos" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 5;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("!!true", async () => {
      const query = "!!true";

      const tree = parse(query);

      const expectedTree = {
        base: { base: { type: "Value", value: true }, type: "Not" },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("!+5", async () => {
      const query = "!+5";

      const tree = parse(query);

      const expectedTree = {
        base: { base: { type: "Value", value: 5 }, type: "Pos" },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("+!true", async () => {
      const query = "+!true";

      const tree = parse(query);

      const expectedTree = {
        base: { base: { type: "Value", value: true }, type: "Not" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("!true||!false", async () => {
        const query = "!true||!false";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: true }, type: "Not" },
          right: { base: { type: "Value", value: false }, type: "Not" },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 3", () => {
      it("!true&&!false", async () => {
        const query = "!true&&!false";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: true }, type: "Not" },
          right: { base: { type: "Value", value: false }, type: "Not" },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 4", () => {
      it("!true!=!false", async () => {
        const query = "!true!=!false";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: true }, type: "Not" },
          op: "!=",
          right: { base: { type: "Value", value: false }, type: "Not" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 5", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("+1++2", async () => {
        const query = "+1++2";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 1 }, type: "Pos" },
          op: "+",
          right: { base: { type: "Value", value: 2 }, type: "Pos" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 3 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 7", () => {
      it("+2*+3", async () => {
        const query = "+2*+3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Pos" },
          op: "*",
          right: { base: { type: "Value", value: 3 }, type: "Pos" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 6 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 8", () => {
      it("+-5", async () => {
        const query = "+-5";

        const tree = parse(query);

        const expectedTree = {
          base: { base: { type: "Value", value: 5 }, type: "Neg" },
          type: "Pos",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = -5;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("-+5", async () => {
        const query = "-+5";

        const tree = parse(query);

        const expectedTree = {
          base: { base: { type: "Value", value: 5 }, type: "Pos" },
          type: "Neg",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = -5;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });

    describe("& level 9", () => {
      it("+2**+3", async () => {
        const query = "+2**+3";

        const tree = parse(query);

        const expectedTree = {
          left: { base: { type: "Value", value: 2 }, type: "Pos" },
          op: "**",
          right: { base: { type: "Value", value: 3 }, type: "Pos" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = 8 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });
    });
  });

  describe("level 11", () => {
    it("(((10)))", async () => {
      const query = "(((10)))";

      const tree = parse(query);

      const expectedTree = {
        base: {
          base: { base: { type: "Value", value: 10 }, type: "Group" },
          type: "Group",
        },
        type: "Group",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 10;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('foo.bar["baz"]', async () => {
      const query = 'foo.bar["baz"]';

      const tree = parse(query);

      const expectedTree = {
        base: {
          base: { name: "foo", type: "AccessAttribute" },
          name: "bar",
          type: "AccessAttribute",
        },
        name: "baz",
        type: "AccessAttribute",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const root = { foo: { bar: { baz: "baz" } } } as const;

      const result = await (await evaluate(tree, { root })).get();

      const expectedResult = "baz";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialScope<{
            this: WritableDeep<typeof root>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it('foo["bar"].baz', async () => {
      const query = 'foo["bar"].baz';

      const tree = parse(query);

      const expectedTree = {
        base: {
          base: { name: "foo", type: "AccessAttribute" },
          name: "bar",
          type: "AccessAttribute",
        },
        name: "baz",
        type: "AccessAttribute",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const root = { foo: { bar: { baz: "baz" } } } as const;

      const result = await (await evaluate(tree, { root })).get();

      const expectedResult = "baz";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialScope<{
            this: WritableDeep<typeof root>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it('*[_type=="foo"]|order(name)|{age}', async () => {
      const query = '*[_type=="foo"]|order(name)|{age}';

      const tree = parse(query);

      const expectedTree = {
        base: {
          args: [{ name: "name", type: "AccessAttribute" }],
          base: {
            base: { type: "Everything" },
            expr: {
              left: { name: "_type", type: "AccessAttribute" },
              op: "==",
              right: { type: "Value", value: "foo" },
              type: "OpCall",
            },
            type: "Filter",
          },
          func: (() => {}) as unknown as GroqPipeFunction,
          name: "order",
          type: "PipeFuncCall",
        },
        expr: {
          base: { type: "This" },
          expr: {
            attributes: [
              {
                name: "age",
                type: "ObjectAttributeValue",
                value: { name: "age", type: "AccessAttribute" },
              },
            ],
            type: "Object",
          },
          type: "Projection",
        },
        type: "Map",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        base: {
          ...expectedTree.base,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const dataset = [
        { _type: "bar", name: "Bar", age: 4 },
        { _type: "foo", name: "Foo", age: 5 },
      ] as const;

      const result = await (await evaluate(tree, { dataset })).get();

      const expectedResult = [{ age: 5 }] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            dataset: WritableDeep<typeof dataset>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    describe("& level 1", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/197
      it.todo("todo");
    });

    describe("& level 2", () => {
      it("foo.value||bar.value", async () => {
        const query = "foo.value||bar.value";

        const tree = parse(query);

        const expectedTree = {
          left: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          right: {
            base: { name: "bar", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: true }, foo: { value: false } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("foo||bar.value||baz", async () => {
        const query = "foo||bar.value||baz";

        const tree = parse(query);

        const expectedTree = {
          left: {
            left: { name: "foo", type: "AccessAttribute" },
            right: {
              base: { name: "bar", type: "AccessAttribute" },
              name: "value",
              type: "AccessAttribute",
            },
            type: "Or",
          },
          right: { name: "baz", type: "AccessAttribute" },
          type: "Or",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: true }, baz: false, foo: false } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("& level 3", () => {
      it("foo.value&&bar.value", async () => {
        const query = "foo.value&&bar.value";

        const tree = parse(query);

        const expectedTree = {
          left: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          right: {
            base: { name: "bar", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: true }, foo: { value: false } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("foo&&bar.value&&baz", async () => {
        const query = "foo&&bar.value&&baz";

        const tree = parse(query);

        const expectedTree = {
          left: {
            left: { name: "foo", type: "AccessAttribute" },
            right: {
              base: { name: "bar", type: "AccessAttribute" },
              name: "value",
              type: "AccessAttribute",
            },
            type: "And",
          },
          right: { name: "baz", type: "AccessAttribute" },
          type: "And",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: true }, baz: false, foo: false } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("& level 4", () => {
      it("foo.value==bar.value", async () => {
        const query = "foo.value==bar.value";

        const tree = parse(query);

        const expectedTree = {
          left: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          op: "==",
          right: {
            base: { name: "bar", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: true }, foo: { value: false } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("foo==bar.value==baz", async () => {
        const query = "foo==bar.value==baz";

        expect(() => parse(query)).toThrow(
          "Syntax error in GROQ query at position 13"
        );
        expectType<Parse<typeof query>>().toStrictEqual<never>();

        expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
      });
    });

    describe("& level 5", () => {
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/332
      it.todo("todo");
    });

    describe("& level 6", () => {
      it("foo.value+bar.value", async () => {
        const query = "foo.value+bar.value";

        const tree = parse(query);

        const expectedTree = {
          left: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          op: "+",
          right: {
            base: { name: "bar", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: 5 }, foo: { value: 4 } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 9 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("foo+bar.value+baz", async () => {
        const query = "foo+bar.value+baz";

        const tree = parse(query);

        const expectedTree = {
          left: {
            left: { name: "foo", type: "AccessAttribute" },
            op: "+",
            right: {
              base: { name: "bar", type: "AccessAttribute" },
              name: "value",
              type: "AccessAttribute",
            },
            type: "OpCall",
          },
          op: "+",
          right: { name: "baz", type: "AccessAttribute" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: 4 }, baz: 3, foo: 5 } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 12 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("& level 7", () => {
      it("foo.value*bar.value", async () => {
        const query = "foo.value*bar.value";

        const tree = parse(query);

        const expectedTree = {
          left: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          op: "*",
          right: {
            base: { name: "bar", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: 5 }, foo: { value: 4 } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 20 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("foo*bar.value*baz", async () => {
        const query = "foo*bar.value*baz";

        const tree = parse(query);

        const expectedTree = {
          left: {
            left: { name: "foo", type: "AccessAttribute" },
            op: "*",
            right: {
              base: { name: "bar", type: "AccessAttribute" },
              name: "value",
              type: "AccessAttribute",
            },
            type: "OpCall",
          },
          op: "*",
          right: { name: "baz", type: "AccessAttribute" },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: 4 }, baz: 3, foo: 5 } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 60 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("& level 8", () => {
      it("-foo.value", async () => {
        const query = "-foo.value";

        const tree = parse(query);

        const expectedTree = {
          base: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "Neg",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { foo: { value: 4 } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = -4;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("& level 9", () => {
      it("foo.value**bar.value", async () => {
        const query = "foo.value**bar.value";

        const tree = parse(query);

        const expectedTree = {
          left: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          op: "**",
          right: {
            base: { name: "bar", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: 5 }, foo: { value: 4 } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 1024 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("foo**bar.value**baz", async () => {
        const query = "foo**bar.value**baz";

        const tree = parse(query);

        const expectedTree = {
          left: { name: "foo", type: "AccessAttribute" },
          op: "**",
          right: {
            left: {
              base: { name: "bar", type: "AccessAttribute" },
              name: "value",
              type: "AccessAttribute",
            },
            op: "**",
            right: { name: "baz", type: "AccessAttribute" },
            type: "OpCall",
          },
          type: "OpCall",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { bar: { value: 3 }, baz: 2, foo: 4 } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 262144 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("& level 10", () => {
      it("+foo.value", async () => {
        const query = "+foo.value";

        const tree = parse(query);

        const expectedTree = {
          base: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "Pos",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { foo: { value: 4 } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = 4;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("!foo.value", async () => {
        const query = "!foo.value";

        const tree = parse(query);

        const expectedTree = {
          base: {
            base: { name: "foo", type: "AccessAttribute" },
            name: "value",
            type: "AccessAttribute",
          },
          type: "Not",
        } as const;

        expect(tree).toStrictEqual(expectedTree);
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const root = { foo: { value: false } } as const;

        const result = await (await evaluate(tree, { root })).get();

        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            ScopeFromPartialScope<{
              this: WritableDeep<typeof root>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });
  });
});
