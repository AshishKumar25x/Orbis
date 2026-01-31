"use client";
import { useState, useEffect } from "react";

export default function DebounceSearch({
    placeholder = "Search...",
    fetchOptions,
    onSelect,
    value: controlledValue = "",
    disabledOptions = [],
}) {
    const [query, setQuery] = useState(controlledValue);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timer);
    }, [query, fetchOptions]);

    useEffect(() => {
        if (!debouncedQuery) {
            setOptions([]);
            return;
        }
        let canceled = false;
        async function fetchData() {
            setIsLoading(true);
            try {
                const data = await fetchOptions(debouncedQuery);
                const filtered = data.filter(opt => !disabledOptions.includes(opt));
                if (!canceled) {
                    setOptions(filtered);
                }
            }
            catch (error) {
                console.log("Error fetching options:", error);
            }
            finally {
                if (!canceled) {
                    setIsLoading(false);
                }
            }
        }
        fetchData();
        return () => {
            canceled = true;
        };
    }, [debouncedQuery, disabledOptions, fetchOptions]);
    return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute right-3 top-2.5 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      )}

      {/* Options dropdown */}
      {options.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          {options.map((option, idx) => {
            const isDisabled = disabledOptions.includes(option);
            return (
              <li
                key={idx}
                onClick={() => !isDisabled && onSelect(option)}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-800 ${
                  isDisabled
                    ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}