import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import dayjs from "dayjs";

function Applications() {
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [redirect, setRedirect] = useState(false);

  const applicantsPending = () => {
    return applications.filter((application) => !application.inTouch);
  };

  const applicantsInTouch = () => {
    return applications.filter((application) => application.inTouch);
  };

  const deleteApplication = () => {
    setSuccess("");
    setMessage("");
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/application`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ applicationID: currentApplication._id }),
    })
      .then((response) => response.json())
      .then((response) => {
        setCurrentApplication(null);
        if (response.success) {
          setMessage("Application Deleted Successfully");
        } else {
          setMessage(response.message);
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("Some Error Occured. Please Try Again Later");
      });
  };

  const shortlistApplicant = () => {
    setSuccess("");
    setMessage("");
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/application/inTouch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ applicationID: currentApplication._id }),
    })
      .then((response) => response.json())
      .then((response) => {
        setCurrentApplication(null);
        if (response.success) {
          setSuccess("Applicant Shortlisted");
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
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/application/company`, {
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
          setApplications(response.applications);
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
  }, [token, currentApplication]);

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: "/conversations",
          state: {
            application: currentApplication._id,
            applicationName: currentApplication.profile.name,
          },
        }}
      />
    );
  }

  return (
    <>
      <main className="container mx-auto p-6 flex flex-col">
        <h1 className="text-2xl">Applications</h1>
        {success && (
          <p className="mt-4">
            <strong className="font-normal text-green-600 text-sm">
              {success}
            </strong>
          </p>
        )}
        {message && (
          <p className="mt-4">
            <strong className="font-normal text-red-600 text-sm">
              {message}
            </strong>
          </p>
        )}
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h2 className="px-2 text-lg flex justify-between items-baseline">
              <span>Pending Applications</span>
              <span className="text-sm text-form-accent">Applied On</span>
            </h2>
            {applications ? (
              <>
                {applicantsPending().length > 0 ? (
                  <ul className="mt-2">
                    {applicantsPending().map((application) => {
                      return (
                        <button
                          key={application._id}
                          className="p-2 rounded-sm w-full flex justify-between items-baseline hover:bg-ui-accent focus:bg-ui-accent focus:outline-none"
                          onClick={() => {
                            setCurrentApplication(application);
                          }}
                        >
                          <p>{application.profile.name}</p>
                          <p className="ml-4 text-sm truncate">
                            {dayjs(application.date).format("D MMMM, YYYY")}
                          </p>
                        </button>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 px-2 opacity-50 text-sm">
                    Applications for your company are listed here
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
              <span>In Touch</span>
              <span className="text-sm text-form-accent">Applied On</span>
            </h2>
            {applications ? (
              <>
                {applicantsInTouch().length > 0 ? (
                  <ul className="mt-2">
                    {applicantsInTouch().map((application) => {
                      return (
                        <button
                          key={application._id}
                          className="p-2 rounded-sm w-full flex justify-between items-baseline hover:bg-ui-accent focus:bg-ui-accent focus:outline-none"
                          onClick={() => {
                            setCurrentApplication(application);
                          }}
                        >
                          <p>{application.profile.name}</p>
                          <p className="ml-4 text-sm truncate">
                            {dayjs(application.date).format("D MMMM, YYYY")}
                          </p>
                        </button>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 px-2 opacity-50 text-sm">
                    Applicants you are in touch with are listed here
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
        {currentApplication && (
          <section className="absolute inset-0 p-6 z-10 overflow-y-auto">
            <div className="container relative mx-auto p-4 bg-background rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl">
                    {currentApplication.profile.name}
                  </h2>
                  <p>
                    <a
                      href={`mailto:${currentApplication.profile.email}`}
                      className="text-sm hover:underline focus:underline focus:outline-none"
                    >
                      {currentApplication.profile.email}
                    </a>
                    ,{" "}
                    <a
                      href={`tel:${currentApplication.profile.phone}`}
                      className="text-sm hover:underline focus:underline focus:outline-none"
                    >
                      {currentApplication.profile.phone}
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    Skilled In: {currentApplication.profile.skills.join(", ")}
                  </p>
                  <p className="mt-2 text-sm">
                    {dayjs(currentApplication.date).format("D MMMM, YYYY")}
                  </p>
                </div>
                <button
                  className="ml-2 group focus:outline-none"
                  onClick={() => {
                    setCurrentApplication(null);
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
                  {currentApplication.coverLetter}
                </p>
              </div>
              {currentApplication.workSamples.length > 0 && (
                <>
                  <h3 className="mt-4 text-sm opacity-50">Work Samples</h3>
                  <div className="mt-2 grid lg:grid-cols-2 gap-4 sm:gap-2">
                    {currentApplication.workSamples.map((workSample, index) => {
                      return (
                        <div
                          key={index}
                          className="grid items-baseline justify-items-start sm:gap-2 sm:grid-cols-2"
                        >
                          <p>{index + 1 + ". " + workSample.organisation}</p>
                          <a
                            className="text-sm italic truncate hover:underline focus:outline-none focus:underline"
                            href={workSample.url}
                          >
                            {workSample.url}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="mt-4 flex flex-col sm:flex-row">
                {currentApplication.inTouch ? (
                  <button
                    className="px-4 py-2 rounded-sm bg-ui text-ui-text hover:bg-ui-hover focus:outline-none focus:bg-ui-hover"
                    title="Talk To Applicant"
                    onClick={() => {
                      setRedirect(true);
                    }}
                  >
                    Talk
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 rounded-sm bg-ui text-ui-text hover:bg-ui-hover focus:outline-none focus:bg-ui-hover"
                    title="Shortlist Applicant"
                    onClick={() => {
                      shortlistApplicant();
                    }}
                  >
                    Shortlist
                  </button>
                )}
                <button
                  className="sm:ml-2 mt-2 sm:mt-0 px-4 py-2 rounded-sm bg-red-700 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600"
                  title="Delete Application"
                  onClick={() => {
                    deleteApplication();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      {currentApplication && (
        <section className="absolute inset-0 min-h-screen bg-black opacity-75"></section>
      )}
    </>
  );
}

export default Applications;
