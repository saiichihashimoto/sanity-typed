import type { Faker } from "@faker-js/faker";
import { flow, isObject, map } from "lodash/fp";
import type { Merge } from "type-fest";

import type { TupleOfLength } from "../types";

type ListValue<T> = T | { title: string; value: T };

export type WithTypedOptionsList<
  Value,
  T extends {
    options?: {
      list?: ListValue<any>[];
    };
  }
> = Merge<
  T,
  {
    options?: Omit<T["options"], "list"> & {
      list?: TupleOfLength<ListValue<Value>, 1>;
    };
  }
>;

export const listValueToValue = <T>(item: ListValue<T>) =>
  isObject(item) && "title" in item && "value" in item ? item.value : item;

export const listMock =
  <Input>(list: TupleOfLength<ListValue<Input>, 1>) =>
  (faker: Faker) =>
    flow(
      map(listValueToValue),
      faker.helpers.arrayElement.bind(faker.helpers)
    )(list);
