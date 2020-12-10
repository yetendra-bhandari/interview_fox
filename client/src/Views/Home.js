import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";

function Home(props) {
  const [ready, setReady] = useState(true);
  const [userType, setUserType] = useState(false);
  const [message, setMessage] = useState(false);
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState(new Set());
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);

  const skillRef = useRef();

  const addSkill = () => {
    if (skill.trim().length > 0) {
      const tempSkills = new Set(skills);
      tempSkills.add(skill.trim());
      setSkills(tempSkills);
    }
  };

  const removeSkill = (skillToRemove) => {
    const tempSkills = new Set(skills);
    tempSkills.delete(skillToRemove);
    setSkills(tempSkills);
  };

  const isValidForm = () => {
    return password === confirmPassword;
  };

  const submitForm = () => {
    if (isValidForm()) {
      setReady(false);
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            userType: userType,
            ...(userType === "B" && { company: company.trim() }),
            name: name.trim(),
            email: email.trim(),
            phone: phone,
            dateOfBirth: dateOfBirth,
            password: password,
            skills: Array.from(skills).sort(),
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
    }
  };

  useEffect(() => {
    setSkill("");
  }, [skills]);

  return ready ? (
    <main>
      <div className="bg-ui">
        <section className="container mx-auto px-6 pt-8 pb-20 md:text-center text-ui-text leading-tight">
          <h1 className="text-6xl">interviews</h1>
          <h2 className="text-2xl">now easier than ever</h2>
        </section>
      </div>
      <section className="container mx-auto max-w-xl p-6">
        <h2 className="text-center text-4xl">Join Interview-Fox</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <button
            className={`p-2 rounded-sm border border-ui-accent focus:outline-none cursor-pointer text-center ${
              userType === "E"
                ? "bg-ui text-ui-text"
                : "bg-background text-background-text focus:border-form-accent"
            }`}
            onClick={() => {
              setUserType("E");
            }}
          >
            For Employees
          </button>
          <button
            className={`p-2 rounded-sm border border-ui-accent focus:outline-none cursor-pointer text-center ${
              userType === "B"
                ? "bg-ui text-ui-text"
                : "bg-background text-background-text focus:border-form-accent"
            }`}
            onClick={() => {
              setUserType("B");
            }}
          >
            For Businesses
          </button>
        </div>
        {userType && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitForm();
            }}
          >
            <h3 className="mt-6 text-center text-xl">Tell Us About You</h3>
            {message && (
              <p className="mt-4">
                <strong className="font-normal text-red-600 text-sm">
                  {message}
                </strong>
              </p>
            )}
            {userType === "B" && (
              <fieldset className="mt-4">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  className="mt-2 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                  type="text"
                  maxLength="64"
                  value={company}
                  required={userType === "B"}
                  onChange={(event) => {
                    setCompany(event.target.value);
                  }}
                />
              </fieldset>
            )}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="mt-2 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                  type="text"
                  maxLength="64"
                  value={name}
                  required
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="dateOfBirth">Date Of Birth</label>
                <input
                  id="dateOfBirth"
                  className="mt-2 w-full rounded-sm bg-ui-text text-form-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                  type="date"
                  max={new Date().getFullYear() - 18 + "-01-01"}
                  value={dateOfBirth}
                  required
                  onChange={(event) => {
                    setDateOfBirth(event.target.value);
                  }}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  className="mt-2 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                  type="text"
                  pattern="[0-9]+"
                  minLength="10"
                  maxLength="10"
                  value={phone}
                  required
                  onChange={(event) => {
                    setPhone(event.target.value);
                  }}
                />
              </fieldset>
            </div>
            <fieldset className="mt-4">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                className="mt-2 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                type="email"
                maxLength="64"
                value={email}
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </fieldset>
            {password.length > 0 && password.length < 8 ? (
              <p className="mt-4">
                <strong className="font-normal text-red-600 text-sm">
                  Password Must Be At Least 8 Characters Long
                </strong>
              </p>
            ) : (
              confirmPassword.length > 0 &&
              password !== confirmPassword && (
                <p className="mt-4">
                  <strong className="font-normal text-red-600 text-sm">
                    Passwords Do Not Match
                  </strong>
                </p>
              )
            )}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="mt-2 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                  type="password"
                  minLength="8"
                  maxLength="64"
                  value={password}
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  className="mt-2 w-full rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                  type="password"
                  minLength="8"
                  maxLength="64"
                  value={confirmPassword}
                  required
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                />
              </fieldset>
            </div>
            <div className="mt-4">
              <label htmlFor="skill">
                {userType === "E"
                  ? "Skills That I Have"
                  : "Skills We Are Looking For"}
              </label>
              <div className="flex flex-wrap">
                {Array.from(skills)
                  .sort()
                  .map((tempSkill) => {
                    return (
                      <button
                        type="button"
                        key={tempSkill}
                        className={`mt-2 mr-2 px-4 py-2 bg-ui text-ui-text rounded-sm hover:bg-ui-hover focus:outline-none ${
                          tempSkill === skill ? "animate-bounce" : ""
                        }`}
                        title="Remove Skill"
                        onClick={() => {
                          removeSkill(tempSkill);
                        }}
                      >
                        {tempSkill}
                      </button>
                    );
                  })}
                <div className="mt-2 flex">
                  <input
                    id="skill"
                    ref={skillRef}
                    className="w-40 rounded-sm bg-background text-background-text border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
                    type="text"
                    maxLength="32"
                    value={skill}
                    onChange={(event) => {
                      setSkill(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="ml-2 px-4 bg-ui text-ui-text text-2xl font-bold rounded-sm hover:bg-ui-hover focus:outline-none focus:bg-ui-hover"
                    onClick={() => {
                      addSkill();
                      skillRef.current.focus();
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
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
            <div className="mt-4 flex items-center">
              <input
                id="agree"
                className="mr-2 h-4 w-4 cursor-pointer focus:outline-none"
                type="checkbox"
                checked={agree}
                onChange={(event) => {
                  setAgree(event.target.checked);
                }}
              />
              <label htmlFor="agree">
                I Agree To The{" "}
                <strong className="text-form-accent font-normal">
                  Terms And Conditions
                </strong>
                .
              </label>
            </div>
            <input
              className={`mt-4 px-4 py-2 rounded-sm border border-ui-accent text-center cursor-pointer focus:outline-none ${
                agree && userType
                  ? "bg-ui text-ui-text hover:bg-ui-hover focus:bg-ui-hover"
                  : "bg-background text-background-text"
              }`}
              type="submit"
              value="Sign Up"
              title="Sign Up On Interview-Fox"
              disabled={!agree}
            />
          </form>
        )}
        <p className="mt-6 text-center">
          Already Have An Account?{" "}
          <NavLink
            to="/login"
            className="text-form-accent hover:underline focus:underline focus:outline-none"
          >
            Login
          </NavLink>
        </p>
      </section>
    </main>
  ) : (
    <Loading message="Creating New Account" />
  );
}

export default Home;
