import { MovieResponse } from "./MoviesResponse";
import React from "react";
import styles from "./Movies.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

interface MoviesProps {
  movies: MovieResponse[];
}

export const Movies: React.FC<MoviesProps> = ({ movies }) => {
  return (
    <>
      {movies.map((movie) => (
        <figure key={movie.imdbID} className={styles.card}>
          {movie.Poster === "N/A" ? null : (
            <img className={styles.image} src={movie.Poster} alt="Poster" />
          )}
          <figcaption className={styles.caption}>
            {movie.Title}
            <div className={styles.sup}>
              <FontAwesomeIcon icon={faCalendar} /> {movie.Year}
            </div>
          </figcaption>
        </figure>
      ))}
    </>
  );
};
