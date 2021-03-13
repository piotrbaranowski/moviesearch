import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./App.module.scss";
import { MoviesResponse } from "./MoviesResponse";
import { Movies } from "./Movies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import {
  faSmile,
  faSmileWink,
  faTimesCircle,
} from "@fortawesome/free-regular-svg-icons";
import { queryParser } from "./queryParser";

export const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<MoviesResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const searchQuery = useMemo(
    () => new URLSearchParams(location.search).get("q") ?? "",
    [location.search]
  );

  const updateSearchQuery = useCallback(
    (newSearchQuery: string) =>
      history.push({
        search:
          newSearchQuery === ""
            ? ""
            : `q=${encodeURIComponent(newSearchQuery)}`,
      }),
    [history]
  );

  const updateSearchQueryByEvent = useCallback(
    (inputEvent: React.ChangeEvent<HTMLInputElement>) =>
      updateSearchQuery(inputEvent.target.value),
    [updateSearchQuery]
  );

  const clearSearchQuery = useCallback(() => updateSearchQuery(""), [
    updateSearchQuery,
  ]);

  const abortController = useRef<AbortController | null>(null);
  const timeoutReference = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutReference.current != null) {
      clearTimeout(timeoutReference.current);
      timeoutReference.current = null;
    }
    if (abortController.current != null) {
      abortController.current?.abort();
      abortController.current = null;
    }
    setIsLoading(false);
    if (searchQuery !== "") {
      setIsLoading(true);
      timeoutReference.current = setTimeout(() => {
        abortController.current = new AbortController();
        const parameters = new URLSearchParams({
          apikey: process.env.REACT_APP_OMDB_API_KEY!,
          ...queryParser(searchQuery),
        });
        fetch(`http://www.omdbapi.com/?${parameters.toString()}`, {
          signal: abortController.current.signal,
        })
          .then((results) => results.json())
          .then((results) => {
            setSearchResults(results);
            setIsLoading(false);
          })
          .catch((error) => {
            if (error.name !== "AbortError") throw error;
          });
      }, 300);
    } else {
      setSearchResults(null);
    }
  }, [setSearchResults, searchQuery, abortController]);

  return (
    <>
      <div className={styles.background}>
        <h1>Movie search</h1>
        <input
          autoFocus
          className={styles.giantInput}
          onChange={updateSearchQueryByEvent}
          value={searchQuery}
          placeholder="e.g. Alien 1979"
        />
        <button onClick={clearSearchQuery} className={styles.inputSuffix}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      </div>
      <div className={styles.grid}>
        {isLoading === true ? (
          <FontAwesomeIcon
            icon={faCompactDisc}
            spin
            className={styles.loader}
          />
        ) : searchResults == null ? (
          <span className={styles.faded}>
            Start with a movie title, you can add a production year to narrow
            down results <FontAwesomeIcon icon={faSmile} />
          </span>
        ) : searchResults.Search == null ? (
          <span className={styles.faded}>
            No movies found, try ask in another way{" "}
            <FontAwesomeIcon icon={faSmileWink} />
          </span>
        ) : (
          <Movies movies={searchResults.Search} />
        )}
      </div>
    </>
  );
};
