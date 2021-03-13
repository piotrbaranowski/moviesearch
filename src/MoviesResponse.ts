export interface MovieResponse {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string | "N/A";
}

export interface MoviesResponse {
  Search?: MovieResponse[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}
