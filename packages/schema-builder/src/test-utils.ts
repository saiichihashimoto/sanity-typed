import type {
  ArrayDefinition,
  BlockDefinition,
  BooleanDefinition,
  DateDefinition,
  DatetimeDefinition,
  DocumentDefinition,
  EmailDefinition,
  FileDefinition,
  GeopointDefinition,
  ImageDefinition,
  NumberDefinition,
  ObjectDefinition,
  ReferenceDefinition,
  Rule,
  SlugDefinition,
  StringDefinition,
  TextDefinition,
  UrlDefinition,
} from "sanity";

import type { GetRule } from "./types";

// https://twitter.com/mattpocockuk/status/1646452585006604291
export type Expect<T extends true> = T;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

export const mockRule = () => {
  const rule: GetRule<ArrayDefinition> &
    GetRule<BlockDefinition> &
    GetRule<BooleanDefinition> &
    GetRule<DateDefinition> &
    GetRule<DatetimeDefinition> &
    GetRule<DocumentDefinition> &
    GetRule<EmailDefinition> &
    GetRule<FileDefinition> &
    GetRule<GeopointDefinition> &
    GetRule<ImageDefinition> &
    GetRule<NumberDefinition> &
    GetRule<ObjectDefinition> &
    GetRule<ReferenceDefinition> &
    GetRule<SlugDefinition> &
    GetRule<StringDefinition> &
    GetRule<TextDefinition> &
    GetRule<UrlDefinition> &
    Rule = {
    _fieldRules: undefined,
    _level: undefined,
    _message: undefined,
    _required: undefined,
    _rules: [],
    _type: undefined,
    _typeDef: undefined,
    all: jest.fn(() => rule),
    assetRequired: jest.fn(() => rule),
    clone: jest.fn(() => rule),
    cloneWithRules: jest.fn(() => rule),
    custom: jest.fn(() => rule),
    either: jest.fn(() => rule),
    email: jest.fn(() => rule),
    error: jest.fn(() => rule),
    fields: jest.fn(() => rule),
    greaterThan: jest.fn(() => rule),
    info: jest.fn(() => rule),
    integer: jest.fn(() => rule),
    isRequired: jest.fn(() => false),
    length: jest.fn(() => rule),
    lessThan: jest.fn(() => rule),
    lowercase: jest.fn(() => rule),
    max: jest.fn(() => rule),
    merge: jest.fn(() => rule),
    min: jest.fn(() => rule),
    negative: jest.fn(() => rule),
    optional: jest.fn(() => rule),
    positive: jest.fn(() => rule),
    precision: jest.fn(() => rule),
    reference: jest.fn(() => rule),
    regex: jest.fn(() => rule),
    required: jest.fn(() => rule),
    reset: jest.fn(() => rule),
    type: jest.fn(() => rule),
    unique: jest.fn(() => rule),
    uppercase: jest.fn(() => rule),
    uri: jest.fn(() => rule),
    valid: jest.fn(() => rule),
    validate: jest.fn(async () => []),
    valueOfField: jest.fn(() => ({ type: Symbol("Mock Value"), path: [] })),
    warning: jest.fn(() => rule),
  };

  return rule;
};
