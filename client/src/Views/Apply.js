import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import dayjs from "dayjs";

function Apply() {
  const token = localStorage.getItem("token");

  const [searchCompany, setSearchCompany] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [myApplications, setMyApplications] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [showSubmittedApplication, setShowSubmittedApplication] = useState(
    false
  );
  const [company, setCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companySkills, setCompanySkills] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [workSamples, setWorkSamples] = useState([
    { organisation: "", url: "" },
  ]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [redirect, setRedirect] = useState(false);

  const setOrganisation = (index, organisation) => {
    const tempWorkSamples = [...workSamples];
    tempWorkSamples[index].organisation = organisation;
    setWorkSamples(tempWorkSamples);
  };

  const setURL = (index, url) => {
    const tempWorkSamples = [...workSamples];
    tempWorkSamples[index].url = url;
    setWorkSamples(tempWorkSamples);
  };

  const removeWorkSample = (index) => {
    const tempWorkSamples = [...workSamples];
    tempWorkSamples.splice(index, 1);
    setWorkSamples(tempWorkSamples);
  };

  const sendApplication = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        application: {
          company: company,
          coverLetter: coverLetter,
          workSamples: workSamples.filter((workSample) => {
            return !(workSample.organisation === "" && workSample.url === "");
          }),
        },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setShowApplication(false);
        if (response.success) {
          setSuccess(response.message);
          setMessage("");
        } else {
          setMessage(response.message);
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("Some Error Occured. Please Try Again Later");
      });
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/application/recommended`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: abortController.signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setRecommended(response.recommended);
          setMessage("");
        } else {
          setMessage(response.message);
        }
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          console.error(error);
          setMessage("Some Error Occured. Please Try Again Later");
        }
      });
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/application/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: abortController.signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setMyApplications(response.applications);
          setMessage("");
        } else {
          setMessage(response.message);
        }
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          console.error(error);
          setMessage("Some Error Occured. Please Try Again Later");
        }
      });
    return () => {
      abortController.abort();
    };
  }, [token, showApplication, showSubmittedApplication]);

  useEffect(() => {
    if (searchCompany) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/application/search?company=${searchCompany}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            setSearchResult(response.companies);
            setMessage("");
          } else {
            setMessage(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Some Error Occured. Please Try Again Later");
        });
    } else {
      setSearchResult(null);
    }
  }, [token, searchCompany]);

  useEffect(() => {
    if (company) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/user/skills?userID=${company}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            setCompanySkills(response.skills);
            setMessage("");
          } else {
            setMessage(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Some Error Occured. Please Try Again Later");
        });
    } else {
      setCompanySkills(null);
    }
  }, [token, company]);

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: "/conversations",
          state: {
            application: myApplication._id,
            applicationName: myApplication.companyName,
          },
        }}
      />
    );
  }

  return (
    <>
      <main className="container mx-auto p-6 flex flex-col">
        <h1 className="text-2xl">Apply</h1>
        {message && (
          <p className="mt-4">
            <strong className="font-normal text-red-600 text-sm">
              {message}
            </strong>
          </p>
        )}
        {success && (
          <p className="mt-4">
            <strong className="font-normal text-green-600 text-sm">
              {success}
            </strong>
          </p>
        )}
        <section className="mt-4">
          <input
            type="text"
            className="bg-transparent py-1 w-full border-b border-ui-accent focus:border-form-accent focus:outline-none"
            value={searchCompany}
            placeholder="Search Companies"
            onChange={(event) => {
              setSearchCompany(event.target.value);
            }}
          />
          {searchResult &&
            (searchResult.length > 0 ? (
              <ul className="mt-2">
                {searchResult.map((user) => {
                  return (
                    <li key={user._id}>
                      <button
                        className="p-2 w-full rounded-sm flex justify-between items-baseline hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
                        onClick={() => {
                          setCompanyName(user.company);
                          setCompany(user._id);
                          setShowApplication(true);
                        }}
                        disabled={user.applied}
                      >
                        <p className="flex items-center">
                          <span>{user.company}</span>
                          {user.applied && (
                            <>
                              <svg
                                className="ml-2 h-4 w-4 text-form-accent"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                />
                              </svg>
                              <span className="ml-1 text-sm opacity-50">
                                Applied
                              </span>
                            </>
                          )}
                        </p>
                        <p className="ml-4 text-sm truncate">
                          {user.skills.join(", ")}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 px-2 opacity-25">No Companies Found</p>
            ))}
        </section>
        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <h2 className="px-2 text-lg flex justify-between items-baseline">
              <span>Recommended For You</span>
              <span className="text-sm text-form-accent">Matching Skills</span>
            </h2>
            {recommended ? (
              <>
                {recommended.length > 0 ? (
                  <ul className="mt-2">
                    {recommended.map((user) => {
                      return (
                        <button
                          key={user._id}
                          className="p-2 rounded-sm w-full flex justify-between items-baseline hover:bg-ui-accent focus:bg-ui-accent focus:outline-none"
                          onClick={() => {
                            setCompanyName(user.company);
                            setCompany(user._id);
                            setShowApplication(true);
                          }}
                        >
                          <p>{user.company}</p>
                          <p className="ml-4 text-sm truncate">
                            {user.skills.join(", ")}
                          </p>
                        </button>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-2 px-2 opacity-50 text-sm">
                    Add skills to your profile to get top recommendations
                  </p>
                )}
              </>
            ) : (
              <ul className="mt-4 px-2 animate-pulse">
                <li className="h-4 w-1/2 bg-ui-accent rounded-md"></li>
                <li className="mt-4 h-4 w-3/4 bg-ui-accent rounded-md"></li>
                <li className="mt-4 h-4 w-1/3 bg-ui-accent rounded-md"></li>
              </ul>
            )}
          </div>
          <div>
            <h2 className="px-2 text-lg flex justify-between items-baseline">
              <span>My Applications</span>
              <span className="text-sm text-form-accent">Applied On</span>
            </h2>
            {myApplications ? (
              <>
                {myApplications.length > 0 ? (
                  <ul className="mt-2">
                    {myApplications.map((application) => {
                      return (
                        <button
                          key={application._id}
                          className="p-2 rounded-sm w-full flex justify-between items-baseline hover:bg-ui-accent focus:bg-ui-accent focus:outline-none"
                          onClick={() => {
                            setMyApplication(application);
                            setCompany(application.company);
                            setShowSubmittedApplication(true);
                          }}
                        >
                          <p>{application.companyName}</p>
                          <p className="ml-4 text-sm truncate">
                            {dayjs(application.date).format("D MMMM, YYYY")}
                          </p>
                        </button>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-2 px-2 opacity-50 text-sm">
                    Companies you apply to will be listed here
                  </p>
                )}
              </>
            ) : (
              <ul className="mt-4 px-2 animate-pulse">
                <li className="h-4 w-1/2 bg-ui-accent rounded-md"></li>
                <li className="mt-4 h-4 w-3/4 bg-ui-accent rounded-md"></li>
                <li className="mt-4 h-4 w-1/3 bg-ui-accent rounded-md"></li>
              </ul>
            )}
          </div>
        </section>
        {showApplication && companySkills && (
          <section className="absolute inset-0 p-6 z-10 overflow-y-auto">
            <form
              className="container relative mx-auto p-4 bg-background rounded-lg"
              onSubmit={(event) => {
                event.preventDefault();
                sendApplication();
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl">Applying at "{companyName}"</h2>
                  <p className="mt-1 text-sm">
                    Skills Required: {companySkills.join(", ")}
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-2 group focus:outline-none"
                  onClick={() => {
                    setShowApplication(false);
                    setCompany(null);
                    setCompanyName("");
                  }}
                >
                  <svg
                    className="w-6 h-6 text-red-600 group-hover:text-red-500 group-focus:text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                    />
                  </svg>
                </button>
              </div>
              <label className="block mt-4">
                <h3 className="text-sm opacity-50">Cover Letter</h3>
                <textarea
                  className="mt-2 pb-2 w-full resize-none bg-transparent border-b border-ui-accent focus:border-form-accent focus:outline-none"
                  rows="15"
                  placeholder="Tell Us Why We Should Hire You"
                  value={coverLetter}
                  required
                  onChange={(event) => {
                    setCoverLetter(event.target.value);
                  }}
                ></textarea>
              </label>
              <h3 className="mt-2 text-sm opacity-50">Work Samples</h3>
              <div className="grid gap-2">
                {workSamples.map((workSample, index) => {
                  return (
                    <div key={index} className="flex">
                      <label className="flex-grow mt-2 grid gap-4 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Website Or Organisation"
                          className="py-1 bg-transparent border-b border-ui-accent focus:border-form-accent focus:outline-none"
                          value={workSample.organisation}
                          onChange={(event) => {
                            setOrganisation(index, event.target.value);
                          }}
                        />
                        <input
                          type="url"
                          placeholder="URL"
                          className="py-1 bg-transparent border-b border-ui-accent focus:border-form-accent focus:outline-none"
                          value={workSample.url}
                          onChange={(event) => {
                            setURL(index, event.target.value);
                          }}
                        />
                      </label>
                      {index < workSamples.length - 1 ? (
                        <button
                          type="button"
                          className="ml-4 p-2 self-end group focus:outline-none"
                          title="Remove Work Sample"
                          onClick={() => {
                            removeWorkSample(index);
                          }}
                        >
                          <svg
                            className="h-4 w-4 text-red-600 group-hover:text-red-500 group-focus:text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              fill="currentColor"
                              d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ml-4 p-2 self-end group focus:outline-none"
                          title="Add Work Sample"
                          onClick={() => {
                            setWorkSamples([
                              ...workSamples,
                              { organisation: "", url: "" },
                            ]);
                          }}
                        >
                          <svg
                            className="h-4 w-4 text-green-600 group-hover:text-green-500 group-focus:text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              fill="currentColor"
                              d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-start">
                <input
                  className="px-4 py-2 rounded-sm border bg-ui text-ui-text cursor-pointer border-ui-accent text-center hover:bg-ui-hover focus:outline-none"
                  type="submit"
                  value="Apply"
                  title="Apply"
                />
                <p className="mt-2 sm:mt-0 sm:ml-2 text-sm text-center">
                  Your Contact Details Are Sent Automatically
                </p>
              </div>
            </form>
          </section>
        )}
        {showSubmittedApplication && myApplication && companySkills && (
          <section className="absolute inset-0 p-6 z-10 overflow-y-auto">
            <div className="container relative mx-auto p-4 bg-background rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl">{myApplication.companyName}</h2>
                  <p className="text-sm">
                    Skills Required: {companySkills.join(", ")}
                  </p>
                  <p className="mt-2 text-sm">
                    {dayjs(myApplication.date).format("D MMMM, YYYY")}
                  </p>
                </div>
                <button
                  className="ml-2 group focus:outline-none"
                  onClick={() => {
                    setShowSubmittedApplication(false);
                    setCompany(null);
                    setMyApplication(null);
                  }}
                >
                  <svg
                    className="w-6 h-6 text-red-600 group-hover:text-red-500 group-focus:text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                    />
                  </svg>
                </button>
              </div>
              <div className="block mt-4">
                <h3 className="text-sm opacity-50">Cover Letter</h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {myApplication.coverLetter}
                </p>
              </div>
              <h3 className="mt-4 text-sm opacity-50">Work Samples</h3>
              {myApplication.workSamples.map((workSample, index) => {
                return (
                  <div key={index} className="flex">
                    <div className="flex-grow mt-2 grid sm:gap-4 sm:grid-cols-2">
                      <p>{index + 1 + ". " + workSample.organisation}</p>
                      <a
                        className="text-sm italic hover:underline"
                        href={workSample.url}
                      >
                        {workSample.url}
                      </a>
                    </div>
                  </div>
                );
              })}
              {myApplication.inTouch ? (
                <button
                  className="mt-4 px-4 py-2 rounded-sm bg-ui text-ui-text hover:bg-ui-hover focus:outline-none focus:bg-ui-hover"
                  title="Talk To Company"
                  onClick={() => {
                    setRedirect(true);
                  }}
                >
                  In Touch
                </button>
              ) : (
                <button
                  className="mt-4 px-4 py-2 w-full sm:w-auto rounded-sm border border-ui-accent focus:outline-none"
                  title="Applied"
                  disabled
                >
                  Applied
                </button>
              )}
            </div>
          </section>
        )}
      </main>
      {(showApplication || showSubmittedApplication) && (
        <section className="absolute inset-0 min-h-screen bg-black opacity-75"></section>
      )}
    </>
  );
}

export default Apply;
