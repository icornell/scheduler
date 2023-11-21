import { React, useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

    function transition(newMode, replace = false) {
      setHistory((prev) => {
        return replace ? [...prev.slice(0, prev.length - 1), newMode] : [...prev, newMode];
      });
    }

  function back() {
    setHistory((prev) => {
      return prev.length > 1 ? prev.slice(0, prev.length - 1) : prev;
    });
  }
  return { mode: history[history.length - 1], transition, back };
}
                                                                                             