// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";

const input = '*[_type == "product"]{productName}';

const tree = parse(input);
/**
 *  typeof tree === {
 *    type: "Projection";
 *    base: {
 *      type: "Filter";
 *      base: {
 *        type: "Everything";
 *      };
 *      expr: {
 *        type: "OpCall";
 *        op: "==";
 *        left: {
 *          name: "_type";
 *          type: "AccessAttribute";
 *        };
 *        right: {
 *          type: "Value";
 *          value: "product";
 *        };
 *      };
 *    };
 *    expr: {
 *      type: "Object";
 *      attributes: [{
 *        type: "ObjectAttributeValue";
 *        name: "productName";
 *        value: {
 *          type: "AccessAttribute";
 *          name: "productName";
 *        };
 *      }];
 *    };
 *  }
 */

const value = await evaluate(tree, {
  dataset: [
    {
      _type: "product",
      productName: "Some Cool Product",
      // ...
    },
    {
      _type: "someOtherType",
      otherField: "foo",
      // ...
    },
  ],
});

const result = await value.get();
/**
 *  typeof result === [{
 *    productName: "Some Cool Product";
 *  }]
 */
