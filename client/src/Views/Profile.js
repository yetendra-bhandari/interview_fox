import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "react-avatar";
import Loading from "./Loading";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState(new Set());
  const [update, setUpdate] = useState(false);

  const skillRef = useRef();

  const addSkill = () => {
    if (skill.trim().length > 0) {
      const tempSkills = new Set(skills);
      tempSkills.add(skill.trim());
      setSkills(tempSkills);
      setUpdate(true);
    }
  };

  const removeSkill = (skillToRemove) => {
    const tempSkills = new Set(skills);
    tempSkills.delete(skillToRemove);
    setSkills(tempSkills);
    setUpdate(true);
  };

  const fetchProfile = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setUser(response.user);
          setSkills(new Set(response.user.skills));
        } else {
          setMessage(response.message);
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("Some Error Occured. Please Try Again Later");
      });
  };

  const updateProfile = () => {
    setUpdate(false);
    setUser(null);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ skills: Array.from(skills).sort() }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          fetchProfile();
        } else {
          setMessage(response.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setSkill("");
  }, [skills]);

  return user ? (
    <main className="container mx-auto p-6">
      <section className="flex flex-col-reverse items-center sm:flex-row sm:justify-between">
        <article className="mt-2 text-center sm:mt-0 sm:text-left">
          <h1 className="text-3xl">{user.name}</h1>
          <a
            href={`mailto:${user.email}`}
            className="opacity-50 hover:underline focus:outline-none focus:underline"
          >
            {user.email}
          </a>
        </article>
        <figure>
          <Avatar
            size="160"
            name={user.name}
            maxInitials={2}
            color="var(--ui-accent)"
            fgColor="var(--form-accent)"
            textSizeRatio={2}
            round
            style={{ fontFamily: "Ubuntu" }}
          />
        </figure>
      </section>
      <section className="mt-6">
        <ul className="grid gap-4 lg:grid-cols-2">
          {user.company && (
            <li className="flex items-center">
              <figure className="mr-4 p-2 rounded-full bg-ui-accent">
                <svg
                  className="h-6 w-6 text-form-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"
                  />
                </svg>
              </figure>
              <div>
                <h3 className="text-xs opacity-50">Company</h3>
                <p>{user.company}</p>
              </div>
            </li>
          )}
          <li className="flex items-center">
            <figure className="mr-4 p-2 rounded-full bg-ui-accent">
              <svg
                className="h-6 w-6 text-form-accent"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"
                />
              </svg>
            </figure>
            <div>
              <h3 className="text-xs opacity-50">Date Of Birth</h3>
              <p>{new Date(user.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </li>
          <li className="flex items-center">
            <figure className="mr-4 p-2 rounded-full bg-ui-accent">
              <svg
                className="h-6 w-6 text-form-accent"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
                />
              </svg>
            </figure>
            <div>
              <h3 className="text-xs opacity-50">Phone</h3>
              <a
                href={`tel:${user.phone}`}
                className="hover:underline focus:underline focus:outline-none"
              >
                {user.phone}
              </a>
            </div>
          </li>
          {user.skills.length > 0 && (
            <li className="flex items-center">
              <figure className="mr-4 p-2 rounded-full bg-ui-accent">
                <svg
                  className="h-6 w-6 text-form-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z"
                  />
                </svg>
              </figure>
              <div>
                <h3 className="text-xs opacity-50">
                  {user.userType === "B" ? "Skills Required" : "My Skills"}
                </h3>
                <p>{user.skills.join(", ")}</p>
              </div>
            </li>
          )}
          {user.channels.length > 0 && (
            <li className="flex items-center">
              <figure className="mr-4 p-2 rounded-full bg-ui-accent">
                <svg
                  className="h-6 w-6 text-form-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="currentColor"
                    d="M3 6c0-1.1.9-2 2-2h8l4-4h2v16h-2l-4-4H5a2 2 0 0 1-2-2H1V6h2zm8 9v5H8l-1.67-5H5v-2h8v2h-2z"
                  />
                </svg>
              </figure>
              <div>
                <h3 className="text-xs opacity-50">My Channels</h3>
                {user.channels.map((channel, index) => {
                  return (
                    <React.Fragment key={channel.name}>
                      {index > 0 && <span>, </span>}
                      <NavLink
                        to={{
                          pathname: "/channels",
                          state: { channelName: channel.name },
                        }}
                        className="hover:underline"
                      >
                        {channel.name}
                      </NavLink>
                    </React.Fragment>
                  );
                })}
              </div>
            </li>
          )}
        </ul>
        <div className="mt-6 flex flex-wrap">
          {Array.from(skills)
            .sort()
            .map((tempSkill) => {
              return (
                <button
                  type="button"
                  key={tempSkill}
                  className={`mt-2 mr-2 px-4 py-2 bg-ui text-ui-text rounded-sm hover:bg-ui-hover focus:outline-none focus:bg-ui-hover ${
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
          <form
            className="mt-2 flex"
            onSubmit={(event) => {
              event.preventDefault();
              addSkill();
              skillRef.current.focus();
            }}
          >
            <input
              id="skill"
              ref={skillRef}
              className="w-40 rounded-sm bg-transparent border border-ui-accent p-2 focus:outline-none focus:border-form-accent"
              type="text"
              maxLength="32"
              value={skill}
              placeholder="Add Skill"
              required
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
            <button className="ml-2 px-4 bg-ui text-ui-text text-2xl font-bold rounded-sm hover:bg-ui-hover focus:outline-none focus:bg-ui-hover">
              +
            </button>
          </form>
        </div>
        {update && (
          <button
            className="w-full sm:w-auto mt-2 px-4 py-2 bg-ui text-ui-text cursor-pointer hover:bg-ui-hover rounded-sm focus:outline-none focus:bg-ui-hover"
            value="Create"
            onClick={() => {
              updateProfile();
            }}
          >
            Update Profile
          </button>
        )}
      </section>
    </main>
  ) : message ? (
    <main className="container mx-auto p-6 flex items-center justify-center">
      <h1 className="text-center text-2xl">{message}</h1>
    </main>
  ) : (
    <Loading message="Fetching Profile" />
  );
}

export default Profile;
