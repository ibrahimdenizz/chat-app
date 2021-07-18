import { useState } from "react";

function useFormInput(initialValue = "") {
  const [input, setInput] = useState(initialValue);
  const [error, setError] = useState("");

  function handleChange(e) {
    if (typeof e === "function")
      return function (el) {
        e(el, input);
        setInput(el.target.value);
      };

    setInput(e.target.value);
  }

  return [input, setInput, handleChange, error, setError];
}

export default useFormInput;
