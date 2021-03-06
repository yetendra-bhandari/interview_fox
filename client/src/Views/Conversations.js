import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client/dist/socket.io";
import dayjs from "dayjs";

function Conversations() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  const chatEnd = useRef();
  const chatInput = useRef();

  const [socket, setSocket] = useState(null);
  const [application, setApplication] = useState(
    location.state ? location.state.application : ""
  );
  const [applicationName, setApplicationName] = useState(
    location.state ? location.state.applicationName : ""
  );
  const [discussion, setDiscussion] = useState(null);
  const [recent, setRecent] = useState(null);
  const [chat, setChat] = useState("");
  const [chatting, setChatting] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const sendChat = () => {
    if (chat) {
      socket.emit("conversation", chat.trim());
      setChat("");
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/conversation/recent`, {
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
          setRecent(response.recent);
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
  }, [token]);

  useEffect(() => {
    if (!socket) {
      setSocket(io(`${process.env.REACT_APP_SERVER_URL}/?token=${token}`));
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [token, socket]);

  useEffect(() => {
    if (search) {
      setSearchResults(
        recent.filter((conversation) =>
          conversation.name.match(new RegExp(search, "i"))
        )
      );
    } else {
      setSearchResults(null);
    }
  }, [token, search, recent]);

  useEffect(() => {
    if (application && socket) {
      socket.emit("changeConversation", application);
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/conversation?applicationID=${application}`,
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
            setDiscussion(response.conversations);
            setMessage("");
          } else {
            setMessage(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Some Error Occured. Please Try Again Later");
        });
    }
  }, [application, token, socket]);

  useEffect(() => {
    if (discussion) {
      setChatting(true);
      if (discussion.length > 0) {
        chatEnd.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      } else {
        chatInput.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [discussion]);

  useEffect(() => {
    if (chatting) {
      socket.on("conversation", (response) => {
        setDiscussion((tempDiscussion) => {
          return [...tempDiscussion, response];
        });
      });
    }
  }, [socket, chatting]);

  return (
    <main className="container mx-auto p-6 flex flex-col md:flex-row">
      <aside className="md:h-128 md:w-1/3 md:pr-2 overflow-y-auto">
        <h1 className="text-2xl">Conversations</h1>
        <div className="grid content-start gap-4">
          <section
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            {message && (
              <p className="mt-2">
                <strong className="font-normal text-red-600 text-sm">
                  {message}
                </strong>
              </p>
            )}
            <input
              type="text"
              className="py-1 w-full bg-transparent mt-4 border-b border-ui-accent focus:border-form-accent focus:outline-none"
              value={search}
              placeholder="Search"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            {searchResults &&
              (searchResults.length > 0 ? (
                <ul className="mt-2">
                  {searchResults.map((searchResult) => {
                    return (
                      <li key={searchResult.id}>
                        <button
                          className="p-2 w-full rounded-sm flex items-center hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
                          onClick={() => {
                            setApplication(searchResult.id);
                            setApplicationName(searchResult.name);
                          }}
                        >
                          <p className="break-all">{searchResult.name}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 opacity-50">No Conversations Found</p>
              ))}
          </section>
          <section>
            <h2 className="text-lg">Recent</h2>
            {recent ? (
              recent.length > 0 ? (
                <ul className="mt-2">
                  {recent.map((conversation) => {
                    return (
                      <li key={conversation.id}>
                        <button
                          className="p-2 w-full rounded-sm flex items-center hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
                          onClick={() => {
                            setApplication(conversation.id);
                            setApplicationName(conversation.name);
                          }}
                        >
                          <p className="break-all">{conversation.name}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 opacity-50">No Conversations Found</p>
              )
            ) : (
              <ul className="mt-2 animate-pulse">
                <li className="mt-4 h-4 w-1/2 bg-ui-accent rounded-md"></li>
                <li className="mt-4 h-4 w-3/4 bg-ui-accent rounded-md"></li>
                <li className="mt-4 h-4 w-1/3 bg-ui-accent rounded-md"></li>
              </ul>
            )}
          </section>
        </div>
      </aside>
      <div className="mt-4 md:mt-0 h-screen-70 md:h-128 md:w-2/3 flex flex-col">
        {applicationName && (
          <h3 className="mb-1 text-center">{applicationName}</h3>
        )}
        <section className="flex-grow md:p-2 md:pt-0 border-t md:border border-ui-accent md:rounded-md flex flex-col overflow-hidden">
          {discussion ? (
            <>
              <div className="mt-auto flex flex-col overflow-y-auto chatbox">
                {discussion.map((blob, index) => {
                  return (
                    <div key={index} className="flex flex-col">
                      {(index === 0 ||
                        new Date(discussion[index].date).toDateString() !==
                          new Date(
                            discussion[index - 1].date
                          ).toDateString()) && (
                        <p className="text-center px-2 my-1">
                          {dayjs(blob.date).format("D MMMM, YYYY")}
                        </p>
                      )}
                      <article
                        className={`mb-2 bg-ui-accent px-2 py-1 rounded-md flex flex-col max-w-9/10 ${
                          blob.senderID === userID
                            ? "ml-auto rounded-br-sm"
                            : "mr-auto rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {blob.conversation}
                        </p>
                        <p
                          className={`text-xs ${
                            blob.senderID === userID ? "mr-auto" : "ml-auto"
                          }`}
                        >
                          {dayjs(blob.date).format("h:mm a")}
                        </p>
                      </article>
                    </div>
                  );
                })}{" "}
                <div ref={chatEnd}></div>
              </div>
              <div ref={chatInput} className="flex">
                <input
                  type="text"
                  className="bg-background h-full text-background-text p-2 flex-grow border-2 border-ui-accent rounded-md resize-none focus:outline-none focus:border-ui"
                  rows="1"
                  value={chat}
                  placeholder="Type A Message"
                  onChange={(event) => {
                    setChat(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      sendChat();
                    }
                  }}
                />
                <button
                  className="ml-2 p-3 rounded-full bg-ui-accent focus:outline-none group"
                  title="Send Message"
                  onClick={() => {
                    sendChat();
                  }}
                >
                  <svg
                    className="h-5 w-5 text-form-accent group-focus:text-form-accent-hover"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <p className="m-auto">Click On A Conversation To Begin</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Conversations;
