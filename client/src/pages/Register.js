import React, { useState } from "react";
import axios from "axios";
import config from "../config";

import useFormInput from "../hooks/useFormInput";
import Button from "../components/common/Button/Button";
import Input from "../components/common/Input/Input";

import "./Form.css";

const URL = config.URL + "/api/users";

const Register = () => {
  const [
    username,
    handleUsernameChange,
    usernameError,
    handleUsernameErrorChange,
  ] = useFormInput("");
  const [
    password,
    handlePasswordChange,
    passwordError,
    handlePasswordErrorChange,
  ] = useFormInput("");
  const [
    rePassword,
    handleRePasswordChange,
    rePasswordError,
    handleRePasswordErrorChange,
  ] = useFormInput("");
  const [topError, setTopError] = useState("");

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        {topError === "" ? "" : <p className=" text-danger">{topError}</p>}
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          error={usernameError}
          autoFocus={true}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange(isMatch)}
          error={passwordError}
        />
        <Input
          label="RePassword"
          type="password"
          value={rePassword}
          onChange={handleRePasswordChange(isMatch)}
          error={rePasswordError}
        />
        <Button type="submit" color="primary">
          Register
        </Button>
      </form>
    </div>
  );

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== rePassword) {
      handleRePasswordErrorChange("Password does not match");
      return;
    } else if (password.indexOf(" ") !== -1) {
      handlePasswordErrorChange("Password cant have blank");
      return;
    } else if (username.indexOf(" ") !== -1) {
      handleUsernameErrorChange("Username cant have blank");
      return;
    }

    try {
      await axios.post(URL, {
        username: username,
        password: password,
      });
      window.location = "/";
    } catch (err) {
      if (err?.response?.status === 400 || err?.response?.status === 500) {
        if (err?.response) {
          const { path, message } = err.response.data;
          handleUsernameErrorChange("");
          handlePasswordErrorChange("");
          setTopError("");

          if (path === "username") handleUsernameErrorChange(message);
          else if (path === "password") handlePasswordErrorChange(message);
          else if (path === "top") setTopError(message);
        }
      }
    }
  }
  function isMatch(e, input) {
    if (input === password && rePassword !== e.target.value) {
      handleRePasswordErrorChange("Passwords does not match");
    } else if (input === rePassword && password !== e.target.value) {
      handlePasswordErrorChange("Passwords does not match");
    } else {
      handlePasswordErrorChange("");
      handleRePasswordErrorChange("");
    }
  }
};

export default Register;
