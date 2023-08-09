import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { CleanGROQ, Parse } from ".";

describe("whitespace", () => {
  it("removes whitespace from queries", () => {
    expectType<
      CleanGROQ<`
        *[ _type == "director" && birthYear >= 1970 ]{
            name,
            birthYear,
            "movies": *[ _type == "movie" && director._ref == ^._id ]
        }`>
    >().toStrictEqual<'*[_type=="director"&&birthYear>=1970]{name,birthYear,"movies":*[_type=="movie"&&director._ref==^._id]}'>();
  });

  it("ignores whitespace in double quoted strings", () => {
    expectType<
      CleanGROQ<'"   this     has     spaces  "'>
    >().toStrictEqual<'"   this     has     spaces  "'>();
  });

  it("ignores escaped double quotes in double quoted strings", () => {
    expectType<
      CleanGROQ<'"   this  \\"   has  \\"   spaces  "'>
    >().toStrictEqual<'"   this  \\"   has  \\"   spaces  "'>();
  });

  it("ignores whitespace in single quoted strings", () => {
    expectType<
      CleanGROQ<"'   this     has     spaces  '">
    >().toStrictEqual<"'   this     has     spaces  '">();
  });

  it("ignores escaped single quotes in single quoted strings", () => {
    expectType<
      CleanGROQ<"'   this  \\'   has  \\'   spaces  '">
    >().toStrictEqual<"'   this  \\'   has  \\'   spaces  '">();
  });

  it('leave whitespace for "in"', () => {
    expectType<
      CleanGROQ<"   value       in   values     ">
    >().toStrictEqual<"value in values">();
  });

  it('leave whitespace for "match"', () => {
    expectType<
      CleanGROQ<"   value       match   values     ">
    >().toStrictEqual<"value match values">();
  });

  it('leave whitespace for "asc"', () => {
    expectType<
      CleanGROQ<"   value       asc     ">
    >().toStrictEqual<"value asc">();
  });

  it('leave whitespace for "desc"', () => {
    expectType<
      CleanGROQ<"   value       desc     ">
    >().toStrictEqual<"value desc">();
  });

  it("parse removes whitespace", () => {
    expectType<Parse<'  *    [    _type ==      "foo" ]   '>>().toStrictEqual<
      Parse<'*[_type=="foo"]'>
    >();
  });

  it("avoids space excessive type instantiation issues", () => {
    expectType<
      CleanGROQ<`
                                                                                                                                     *[ _type == "director" && birthYear >= 1970 ]{
                                                                                                                                         name,
                                                                                                                                         birthYear,
                                                                                                                                         "movies": *[ _type == "movie" && director._ref == ^._id ]
                                                                                                                                     }`>
    >().toStrictEqual<'*[_type=="director"&&birthYear>=1970]{name,birthYear,"movies":*[_type=="movie"&&director._ref==^._id]}'>();
  });
});
