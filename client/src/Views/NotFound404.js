import React from "react";
import { Link } from "react-router-dom";

function NotFound404(props) {
  document.title = "Interview Fox";
  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center leading-none text-center">
      <h1 className="text-6xl">Error 404</h1>
      <figure className="mt-4">
        {props.theme === "dark" ? (
          <svg className="mx-auto h-40" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM6.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm2.16 6a6 6 0 0 0-11.32 0h11.32z"
            />
          </svg>
        ) : (
          <svg className="mx-auto h-40" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.16 6H4.34a6 6 0 0 1 11.32 0z"
            />
          </svg>
        )}
        <figcaption className="mt-6 text-xl">
          The Page You Are Looking For Does Not Exist!
        </figcaption>
      </figure>
      <Link
        to="/"
        className="mt-4 p-2 bg-ui text-ui-text rounded-sm hover:bg-ui-hover focus:outline-none focus:bg-ui-hover"
      >
        Home
      </Link>
    </main>
  );
}

export default NotFound404;
