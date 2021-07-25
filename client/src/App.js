import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./components/NotFound";
import Register from "./pages/Register";
import Socket from "./services/socketService";
import config from "./config";

const URL = config.URL;

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
    <div className="main-wrapper ">
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
  );
}

export default App;
