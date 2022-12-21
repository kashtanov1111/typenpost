import { useEffect } from "react";

export function useOutsideAlerter(ref, handleClickedOutside) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleClickedOutside()
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, handleClickedOutside]);
  }