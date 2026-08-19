import { useEffect, useMemo, useReducer, useRef } from "react";
import { apiClient } from "../services/api/client.js";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { data: null, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

/**
 * Generic data-fetching hook.
 * @param {string|null} path - API path to fetch. Pass null to skip fetching.
 * @param {object}  [options] - Additional apiClient options.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export function useApi(path, options) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: Boolean(path),
    error: null,
  });

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Stable reference object used as the effect dependency —
  // changes only when `path` changes.
  const fetchKey = useMemo(() => ({ path }), [path]);

  useEffect(() => {
    if (!fetchKey.path) return;
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });
    apiClient(fetchKey.path, { ...optionsRef.current, signal: controller.signal })
      .then((result) => dispatch({ type: "FETCH_SUCCESS", payload: result }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        dispatch({ type: "FETCH_ERROR", payload: err.message || "Something went wrong. Please try again." });
      });
    return () => controller.abort();
  }, [fetchKey]);

  return state;
}

export default useApi;
