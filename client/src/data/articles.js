/**
 * Pure utility helpers.
 * All live data now comes from the API — see src/hooks/useApi.js.
 */

export const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
