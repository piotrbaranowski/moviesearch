import { queryParser } from "./queryParser";

describe("Given queryParse", () => {
  test.each([
    ["alien alien", { s: "alien alien" }],
    ["alien 1979", { s: "alien", y: "1979" }],
    ["alien1979", { s: "alien1979" }],
    ["alien 1988 alien", { s: "alien 1988 alien" }],
    ["1999 alien alien", { s: "alien alien", y: "1999" }],
    ["2000: alien alien", { s: "2000: alien alien" }],
  ])("When the query is '%s' Then should return %s", (query, expected) => {
    expect(queryParser(query)).toEqual(
      Object.keys(expected).reduce((accumulator, key) => {
        accumulator[key] = encodeURIComponent((expected as any)[key]);
        return accumulator;
      }, {} as any)
    );
  });
});
