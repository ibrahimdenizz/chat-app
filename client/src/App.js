import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { io } from "socket.io-client";

import "./App.css";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./components/NotFound";
import Register from "./pages/Register";
import Socket from "./services/socketService";
const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
var socket;
function App() {
  const [socket, setSocket] = useState();
  const [username, setUsername] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (username)
      setSocket(
        new Socket(URL, {
          username,
          room: {
            id: "Public 1",
            name: "Public 1",
          },
        })
      );
  }, [username]);

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
            ) : socket ? (
              <Chat username={username} socket={socket} />
            ) : (
              ""
            )}
          </Route>
          <Redirect to="/not-found" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
