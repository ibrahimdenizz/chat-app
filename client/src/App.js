import { useState } from "react";
import { io } from "socket.io-client";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Chat from "./components/Chat";
import NotFound from "./components/NotFound";
import Register from "./components/Register";

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

console.log(url);

const socket = io(url);

function App() {
  const [username, setUsername] = useState("");
  const history = useHistory();

  const onSetUser = (name) => {
    setUsername(name);
    history.push("/");
  };

  return (
    <div className="container  h-100 ">
      <div className="row h-100 d-flex justify-content-center align-content-center">
        <Switch>
          <Route path="/login">
            <Login onSetUser={onSetUser} />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/not-found">
            <NotFound />
          </Route>
          <Route exact path="/">
            {username === "" ? (
              <Redirect to="/login" />
            ) : (
              <Chat username={username} socket={socket} />
            )}
          </Route>
          <Redirect to="/not-found" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
