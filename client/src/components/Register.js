import React, { useState } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

let url =
  process.env.NODE_ENV === "production"
    ? "/api/users"
    : "http://localhost:5000/api/users";

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

  const onSubmit = async (e) => {
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
      await axios.post(url, {
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
            onChange={(e) => {
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
            }}
            error={error.password === "" ? false : true}
            helperText={error.password === "" ? "" : error.password}
          />
        </div>
        <div className="my-3">
          <TextField
            id="standard-password-input"
            label="Password again"
            type="password"
            value={rePassword}
            onChange={(e) => {
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
            }}
            error={error.rePassword === "" ? false : true}
            helperText={error.rePassword === "" ? "" : error.rePassword}
          />
        </div>
        <div className="my-3">
          <Button
            type="submit"
            className="mx-2"
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

export default Register;
