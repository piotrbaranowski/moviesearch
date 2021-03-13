const regexp = /^(\d{4}) | (\d{4})$/;

export interface SearchParameters {
  s: string;
  y?: string;
}

export const queryParser = (query: string) => {
  const parameters: SearchParameters = {
    s: encodeURIComponent(query.replace(regexp, "")),
  };

  const match = query.match(regexp);
  console.log(match);
  if (match != null) {
    parameters.y = encodeURIComponent(match[1] == null ? match[2] : match[1]);
  }

  return parameters;
};
