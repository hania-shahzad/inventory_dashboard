import { useEffect } from "react";

/** Custom hook: keeps the browser tab title in sync with a string. */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]); // re-run only when the title text changes
}
