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
    (inputEvent: React.ChangeEvent<HTMLInputElement>) =>
      history.push({
        search: `q=${encodeURIComponent(inputEvent.target.value)}`,
      }),
    [history]
  );

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
        fetch(
          `http://www.omdbapi.com/?s=${encodeURIComponent(
            searchQuery
          )}&apikey=${encodeURIComponent(process.env.REACT_APP_OMDB_API_KEY!)}`,
          {
            signal: abortController.current.signal,
          }
        )
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
        <div className={styles.textCenter}>
          <input
            autoFocus
            className={styles.giantInput}
            onChange={updateSearchQuery}
            value={searchQuery}
            placeholder="e.g. Alien 1987"
          />
          {isLoading}
        </div>
      </div>
      <div className={styles.grid}>
        {isLoading === true ? (
          <FontAwesomeIcon
            icon={faCompactDisc}
            spin
            className={styles.loader}
          />
        ) : searchResults == null ? null : searchResults.Search == null ? (
          <>no results</>
        ) : (
          <Movies movies={searchResults.Search} />
        )}
      </div>
    </>
  );
};
