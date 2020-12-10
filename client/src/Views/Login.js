import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";

function Login(props) {
  const [ready, setReady] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const submitForm = () => {
    setReady(false);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: email.trim().toLowerCase(),
          password: password,
        },
        remember: remember,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("expiresAt", response.expiresAt);
          localStorage.setItem("userID", response.userID);
          localStorage.setItem("name", response.name);
          localStorage.setItem("userType", response.userType);
          props.login();
        } else {
          setMessage(response.message);
          setReady(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("Some Error Occured. Please Try Again Later");
        setReady(true);
      });
  };

  return ready ? (
    <main className="container mx-auto p-6 flex flex-col justify-center">
      <h3 className="text-center text-4xl">Welcome Back To Interview-Fox</h3>
      <form
        className="mt-12 mx-auto max-w-xs"
        onSubmit={(event) => {
          event.preventDefault();
          submitForm();
        }}
      >
        {message && (
          <p className="mb-2">
            <strong className="font-normal text-red-600 text-sm">
              {message}
            </strong>
          </p>
        )}
        <input
          className="w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
          type="email"
          maxLength="64"
          value={email}
          required
          placeholder="Email Address"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          className="mt-4 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
          type="password"
          minLength="8"
          maxLength="64"
          value={password}
          required
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          placeholder="Password"
        />
        <div className="mt-6 flex items-center">
          <input
            id="remember"
            className="mr-2 h-4 w-4 cursor-pointer focus:outline-none"
            type="checkbox"
            checked={remember}
            onChange={(event) => {
              setRemember(event.target.checked);
            }}
          />
          <label htmlFor="remember">Stay Logged In</label>
        </div>
        <input
          className="mt-4 px-4 py-2 rounded-sm bg-ui text-ui-text cursor-pointer text-center hover:bg-ui-hover focus:outline-none focus:bg-ui-hover"
          type="submit"
          value="Login"
          title="Login To Interview-Fox"
        />
      </form>
      <p className="mt-6 text-center">
        Don't Have An Account?{" "}
        <NavLink
          to="/"
          className="text-form-accent hover:underline focus:underline focus:outline-none"
        >
          Sign Up
        </NavLink>
      </p>
    </main>
  ) : (
    <Loading message="Logging You In" />
  );
}

export default Login;
