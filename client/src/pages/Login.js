import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import config from "../config";

import useFormInput from "../hooks/useFormInput";
import Input from "../components/common/Input/Input";
import Button from "../components/common/Button/Button";

import "./Form.css";

let URL = config.URL + "/api/auth";

const Login = ({ onSetUser }) => {
  const [
    username,
    handleUsernameChange,
    usernameError,
    handleUsernameErrorChange,
  ] = useFormInput("test1");

  const [
    password,
    handlePasswordChange,
    passwordError,
    handlePasswordErrorChange,
  ] = useFormInput("test1");
  const [topError, setTopError] = useState("");
  const history = useHistory();

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
          onChange={handlePasswordChange}
          error={passwordError}
        />
        <div className="d-flex">
          <Button type="submit" color="primary">
            Login
          </Button>
          <Button onClick={onRegister} color="secondary">
            Register
          </Button>
        </div>
      </form>
    </div>
  );

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(URL, { username, password });
      onSetUser(response.data.username);
    } catch (err) {
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

  function onRegister() {
    history.push("/register");
  }
};

export default Login;
