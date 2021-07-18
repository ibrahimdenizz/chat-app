import React, { useState } from "react";
import axios from "axios";
import config from "../../config";
import Button from "../components/common/Button/Button";
import Input from "../components/common/Input/Input";
import "./Form.css";

const URL = config.URL + "/api/users";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
    rePassword: "",
    top: "",
  });

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        {error.top === "" ? "" : <p className=" text-danger">{error.top}</p>}
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={error.username}
          autoFocus={true}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={error.password}
        />
        <Input
          label="RePassword"
          type="password"
          value={rePassword}
          onChange={handleRePasswordChange}
          error={error.rePassword}
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
      const errors = error;
      errors.rePassword = "Password does not match";
      setError(errors);
      return;
    }

    if (password.indexOf(" ") !== -1) {
      const errors = error;
      errors.password = "Password cant have blank";
      setError(errors);
      return;
    }

    if (username.indexOf(" ") !== -1) {
      const errors = error;
      errors.username = "Username cant have blank";
      setError(errors);
      return;
    }

    try {
      await axios.post(URL, {
        username: username,
        password: password,
      });
      window.location = "/";
    } catch (err) {
      if (err.response.status === 400 || err.response.status === 500) {
        const { data } = err.response;

        setError({
          username: data.path === "username" ? data.message : "",
          password: data.path === "password" ? data.message : "",
          top: data.path === "top" ? data.message : "",
        });
      }
    }
  }

  function handlePasswordChange(e) {
    if (rePassword !== e.target.value) {
      const errors = error;
      errors.rePassword = "Password does not match";
      setError(errors);
    } else {
      const errors = error;
      errors.rePassword = "";
      setError(errors);
    }

    setPassword(e.target.value);
  }

  function handleRePasswordChange(e) {
    if (password !== e.target.value) {
      const errors = error;
      errors.rePassword = "Password does not match";
      setError(errors);
    } else {
      const errors = error;
      errors.rePassword = "";
      setError(errors);
    }
    setRePassword(e.target.value);
  }
};

export default Register;
