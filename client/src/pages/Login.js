import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import Input from "../components/common/Input/Input";
import Button from "../components/common/Button/Button";
import "./Form.css";

let URL = config.URL + "/api/auth";

const Login = ({ onSetUser }) => {
  const [username, setUsername] = useState("test1");
  const [password, setPassword] = useState("test1");
  const [error, setError] = useState({
    top: "",
    username: "",
    password: "",
  });
  const history = useHistory();

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
          onChange={(e) => setPassword(e.target.value)}
          error={error.password}
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
        const { data } = err.response;

        setError({
          username: data.path === "username" ? data.message : "",
          password: data.path === "password" ? data.message : "",
          top: data.path === "top" ? data.message : "",
        });
      }
    }
  }

  function onRegister() {
    history.push("/register");
  }
};

export default Login;
