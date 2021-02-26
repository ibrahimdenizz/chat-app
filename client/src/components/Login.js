import React, { useState } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

let url =
  process.env.NODE_ENV === "production"
    ? "/api/auth"
    : "http://localhost:5000/api/auth";

console.log(url);

const Login = ({ onSetUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    top: "",
    username: "",
    password: "",
  });
  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url, { username, password });
      onSetUser(response.data.username);
    } catch (err) {
      if (
        err.response.status == 400 ||
        err.response.status == 404 ||
        err.response.status == 500
      ) {
        const { data } = err.response;

        setError({
          username: data.path === "username" ? data.message : "",
          password: data.path === "password" ? data.message : "",
          top: data.path === "top" ? data.message : "",
        });
      }
    }
  };

  const onRegister = () => {
    history.push("/register");
  };

  return (
    <div className="d-flex justify-content-center align-content-center">
      <form onSubmit={onSubmit} className="form-group">
        {error.top === "" ? "" : <p className=" text-danger">{error.top}</p>}
        <div className=" my-3">
          <TextField
            id="standard"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={error.username === "" ? false : true}
            helperText={error.username === "" ? "" : error.username}
            autoFocus
          />
        </div>
        <div className="my-3">
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password === "" ? false : true}
            helperText={error.password === "" ? "" : error.password}
          />
        </div>
        <div className="my-3">
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
          <Button
            className="mx-2"
            onClick={onRegister}
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
