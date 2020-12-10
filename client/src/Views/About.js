import React from "react";
import Logo from "../assets/images/logo.svg";

function About() {
  return (
    <main className="container mx-auto p-6">
      <section className="flex flex-col-reverse items-center sm:flex-row sm:justify-between">
        <article className="mt-2 text-center sm:mt-0 sm:text-left">
          <h1 className="text-3xl">Interview Fox</h1>
        </article>
        <img src={Logo} alt="Interview Fox" />
      </section>
      <section className="mt-6">
        <ul className="grid gap-4 lg:grid-cols-2">
          <li className="flex items-center">
            <figure className="mr-4 p-2 rounded-full bg-ui-accent">
              <svg
                className="h-6 w-6 text-form-accent"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M480 160H32c-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z"
                />
              </svg>
            </figure>
            <div>
              <h3 className="text-xs opacity-50">Backend Technologies</h3>
              <a
                className="hover:underline focus:outline-none focus:underline"
                href="https://nodejs.org/"
              >
                Node.js
              </a>
              ,{" "}
              <a
                className="hover:underline focus:outline-none focus:underline"
                href="https://expressjs.com/"
              >
                Express
              </a>
            </div>
          </li>
          <li className="flex items-center">
            <figure className="mr-4 p-2 rounded-full bg-ui-accent">
              <svg
                className="h-6 w-6 text-form-accent"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z"
                />
              </svg>
            </figure>
            <div>
              <h3 className="text-xs opacity-50">Database</h3>
              <a
                className="hover:underline focus:outline-none focus:underline"
                href="https://mongodb.com/"
              >
                MongoDB
              </a>
            </div>
          </li>
          <li className="flex items-center">
            <figure className="mr-4 p-2 rounded-full bg-ui-accent">
              <svg className="h-6 w-6 text-form-accent" viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"
                />
              </svg>
            </figure>
            <div>
              <h3 className="text-xs opacity-50">Frontend Libraries</h3>
              <a
                className="hover:underline focus:outline-none focus:underline"
                href="https://reactjs.org/"
              >
                React
              </a>
              ,{" "}
              <a
                className="hover:underline focus:outline-none focus:underline"
                href="https://tailwindcss.com/"
              >
                Tailwind
              </a>
            </div>
          </li>
          <li className="flex items-center">
            <figure className="mr-4 p-2 rounded-full bg-ui-accent">
              <svg className="h-6 w-6 text-form-accent" viewBox="0 0 512 512">
                <path
                  fill="currentColor"
                  d="M116.65 219.35a15.68 15.68 0 0 0 22.65 0l96.75-99.83c28.15-29 26.5-77.1-4.91-103.88C203.75-7.7 163-3.5 137.86 22.44L128 32.58l-9.85-10.14C93.05-3.5 52.25-7.7 24.86 15.64c-31.41 26.78-33 74.85-5 103.88zm143.92 100.49h-48l-7.08-14.24a27.39 27.39 0 0 0-25.66-17.78h-71.71a27.39 27.39 0 0 0-25.66 17.78l-7 14.24h-48A27.45 27.45 0 0 0 0 347.3v137.25A27.44 27.44 0 0 0 27.43 512h233.14A27.45 27.45 0 0 0 288 484.55V347.3a27.45 27.45 0 0 0-27.43-27.46zM144 468a52 52 0 1 1 52-52 52 52 0 0 1-52 52zm355.4-115.9h-60.58l22.36-50.75c2.1-6.65-3.93-13.21-12.18-13.21h-75.59c-6.3 0-11.66 3.9-12.5 9.1l-16.8 106.93c-1 6.3 4.88 11.89 12.5 11.89h62.31l-24.2 83c-1.89 6.65 4.2 12.9 12.23 12.9a13.26 13.26 0 0 0 10.92-5.25l92.4-138.91c4.88-6.91-1.16-15.7-10.87-15.7zM478.08.33L329.51 23.17C314.87 25.42 304 38.92 304 54.83V161.6a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V99.66l112-17.22v47.18a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V32c0-19.48-16-34.42-33.92-31.67z"
                />
              </svg>
            </figure>
            <div>
              <h3 className="text-xs opacity-50">Icons</h3>
              <a
                className="hover:underline focus:outline-none focus:underline"
                href="https://fontawesome.com/"
              >
                Font Awesome
              </a>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default About;
