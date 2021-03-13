import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./App.css";

export const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any>(null);
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
        fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}`, {
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
    }
  }, [setSearchResults, searchQuery, abortController]);

  return (
    <>
      <input onChange={updateSearchQuery} value={searchQuery} />
      {JSON.stringify(searchResults)}
      loading: {JSON.stringify(isLoading)}
      query: {JSON.stringify(searchQuery)}
    </>
  );
};
