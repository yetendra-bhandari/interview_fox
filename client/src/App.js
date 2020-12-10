import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Navigation from "./Components/Navigation";
import Footer from "./Components/Footer";
import Home from "./Views/Home";
import Channels from "./Views/Channels";
import Conversations from "./Views/Conversations";
import Applications from "./Views/Applications";
import Apply from "./Views/Apply";
import Profile from "./Views/Profile";
import Login from "./Views/Login";
import About from "./Views/About";
import NotFound404 from "./Views/NotFound404";
import Logout from "./Views/Logout";

function App() {
  const userType = localStorage.getItem("userType");

  const [theme, setTheme] = useState("light");
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("userID");
    localStorage.removeItem("name");
    localStorage.removeItem("userType");
    setLoggedIn(false);
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    }
    setLoggedIn(new Date().getTime() < localStorage.getItem("expiresAt"));
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <div
        className={`min-h-screen flex flex-col bg-background text-background-text font-body transition-colors duration-200 ${theme}`}
      >
        <Navigation
          theme={theme}
          toggleTheme={toggleTheme}
          loggedIn={loggedIn}
        />
        <Switch>
          <Route exact path="/">
            {userType ? <Redirect to="/channels" /> : <Home login={login} />}
          </Route>
          <Route exact path="/channels">
            {userType ? <Channels /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/conversations">
            {userType ? <Conversations /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/applications">
            {userType === "B" ? <Applications /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/apply">
            {userType === "E" ? <Apply /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/profile">
            {userType ? <Profile /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/login">
            {userType ? <Redirect to="/channels" /> : <Login login={login} />}
          </Route>
          <Route exact path="/logout">
            <Logout logout={logout} />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route path="*">
            <NotFound404 theme={theme} />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
