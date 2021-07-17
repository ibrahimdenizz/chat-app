import React from "react";
import "./Input.css";

const Input = ({ label, type, value, onChange, error, className }) => {
  return (
    <div className={"input" + " " + className}>
      <label
        className={`input-label ${!value ? "" : "input-label-active"} ${
          !error ? "" : "input-invalid"
        }`}
      >
        {label}
      </label>
      <input
        className={`input-field ${!error ? "" : "input-invalid"}`}
        type={type}
        onChange={onChange}
        value={value}
      />
      <p className="input-error">{error}</p>
    </div>
  );
};

export default Input;
