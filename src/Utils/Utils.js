import { useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

export const useResizeObersver = ref => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      })
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    }
  }, [ref]);
  return dimensions
}

export function useInterval(callback, delay) {
  // custom hook to deal with clash between hooks and setInterval
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // create a callback that calls the previous callback
    function tick() {
      savedCallback.current();
    }
    // if not paused through null delay
    // run set interval with callback then clean up
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
