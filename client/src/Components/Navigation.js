import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "react-avatar";

function Navigation(props) {
  const name = localStorage.getItem("name");
  const userType = localStorage.getItem("userType");

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-ui text-ui-text">
      <nav className="container mx-auto flex items-center px-6 py-2">
        <NavLink
          to="/"
          className="mr-auto hover:text-avatar-hover focus:outline-none focus:text-avatar-hover"
          title="Interview Fox"
        >
          <svg
            className="h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 33"
          >
            <path
              fill="currentColor"
              viewBox="0 0 40 33"
              d="M5 0L0 12.832C10.835 18.333 15 25.667 20 33c5-7.333 9.168-14.667 20-20.168L35 0C31.668 9.166 8.333 9.166 5 0zm.1 1.963c3.056 3.823 8.36 5.664 14.885 5.756L19.996 27H16.78c-3.714-5.218-7.78-10.326-15.758-14.55z"
            />
          </svg>
        </NavLink>
        {props.loggedIn && (
          <div className="flex items-center">
            <NavLink
              to="/channels"
              className="p-1 text-ui-text hover:underline focus:outline-none focus:underline"
              title="Channels"
            >
              <svg
                className="h-5 sm:hidden"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M3 6c0-1.1.9-2 2-2h8l4-4h2v16h-2l-4-4H5a2 2 0 0 1-2-2H1V6h2zm8 9v5H8l-1.67-5H5v-2h8v2h-2z"
                />
              </svg>
              <p className="hidden sm:block">Channels</p>
            </NavLink>
            <NavLink
              to="/conversations"
              className="mx-2 p-1 text-ui-text hover:underline focus:outline-none focus:underline"
              title="Conversations"
            >
              <svg
                className="h-5 sm:hidden"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M17 11v3l-3-3H8a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1zm-3 2v2a2 2 0 0 1-2 2H6l-3 3v-3H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 0 0 4 4h6z"
                />
              </svg>
              <p className="hidden sm:block">Conversations</p>
            </NavLink>
            {userType === "B" ? (
              <NavLink
                to="/applications"
                className="mr-4 p-1 text-ui-text hover:underline focus:outline-none focus:underline"
                title="Applications"
              >
                <svg
                  className="h-5 sm:hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="currentColor"
                    d="M7.03 2.6a3 3 0 0 1 5.94 0L15 3v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h1V3l2.03-.4zM5 6H4v12h12V6h-1v1H5V6zm5-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                </svg>
                <p className="hidden sm:block">Applications</p>
              </NavLink>
            ) : (
              <NavLink
                to="/apply"
                className="mr-4 p-1 text-ui-text hover:underline focus:outline-none focus:underline"
                title="Apply"
              >
                <svg
                  className="h-5 sm:hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="currentColor"
                    d="M7.03 2.6a3 3 0 0 1 5.94 0L15 3v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h1V3l2.03-.4zM5 6H4v12h12V6h-1v1H5V6zm5-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                </svg>
                <p className="hidden sm:block">Apply</p>
              </NavLink>
            )}
          </div>
        )}
        <div className="relative">
          <button
            className="block group focus:outline-none bg-avatar rounded-full overflow-hidden hover:bg-avatar-hover focus:bg-avatar-hover"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
            }}
          >
            {name ? (
              <Avatar
                size="40"
                name={name}
                maxInitials={2}
                color="#0000"
                fgColor="var(--ui)"
                textSizeRatio={2}
                round
                style={{ fontFamily: "Ubuntu" }}
              />
            ) : (
              <svg
                className="h-8 text-avatar bg-ui group-hover:text-avatar-hover group-focus:text-avatar-hover"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7 6v2a3 3 0 1 0 6 0V6a3 3 0 1 0-6 0zm-3.65 8.44a8 8 0 0 0 13.3 0 15.94 15.94 0 0 0-13.3 0z"
                />
              </svg>
            )}
          </button>
          <aside
            className="absolute w-48 right-0 mt-4 border border-ui-accent bg-background text-background-text rounded-lg whitespace-no-wrap overflow-hidden z-10"
            style={{ display: showProfileMenu ? "block" : "none" }}
          >
            <button
              className="p-2 w-full flex items-center justify-between hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
              title="Change Theme"
              onClick={props.toggleTheme}
            >
              <p>Dark Mode</p>
              {props.theme === "dark" ? (
                <svg
                  className="w-6 ml-2 text-form-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 ml-2 text-form-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M192 64h192c106 0 192 86 192 192s-86 192-192 192H192C86 448 0 362 0 256S86 64 192 64zm0 320c70.8 0 128-57.3 128-128 0-70.8-57.3-128-128-128-70.8 0-128 57.3-128 128 0 70.8 57.3 128 128 128z"
                  />
                </svg>
              )}
            </button>
            {props.loggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  className="p-2 flex items-center justify-between hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
                  title="View Profile"
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                >
                  <p>View Profile</p>
                  <svg
                    className="w-6 ml-2 text-form-accent"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="currentColor"
                      d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h274.9c-2.4-6.8-3.4-14-2.6-21.3l6.8-60.9 1.2-11.1 7.9-7.9 77.3-77.3c-24.5-27.7-60-45.5-99.9-45.5zm45.3 145.3l-6.8 61c-1.1 10.2 7.5 18.8 17.6 17.6l60.9-6.8 137.9-137.9-71.7-71.7-137.9 137.8zM633 268.9L595.1 231c-9.3-9.3-24.5-9.3-33.8 0l-37.8 37.8-4.1 4.1 71.8 71.7 41.8-41.8c9.3-9.4 9.3-24.5 0-33.9z"
                    />
                  </svg>
                </NavLink>
                <NavLink
                  to="/logout"
                  className="p-2 flex items-center justify-between hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
                  title="Sign Out"
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                >
                  <p>Sign Out</p>
                  <svg
                    className="p-0.5 w-6 ml-2 text-form-accent"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 297 297"
                  >
                    <path
                      fill="currentColor"
                      d="M155 6.5c-30.147 0-58.95 9.335-83.294 26.995-2.8 2.023-3.547 5.853-1.74 8.787L92.83 79.374a6.58 6.58 0 0 0 4.328 3.004c1.798.354 3.66-.054 5.145-1.13 14.23-10.323 31.07-15.78 48.698-15.78 45.783 0 83.03 37.247 83.03 83.03s-37.247 83.03-83.03 83.03c-17.63 0-34.468-5.456-48.698-15.78a6.58 6.58 0 0 0-5.145-1.129c-1.798.355-3.366 1.444-4.328 3.004l-22.863 37.093c-1.808 2.934-1.05 6.763 1.74 8.787C96.05 281.165 124.853 290.5 155 290.5c78.3 0 142-63.7 142-142s-63.7-142-142-142zM90.4 201.757c1.147-2.142 1.02-4.74-.326-6.76L74.61 171.802h93.566c12.85 0 23.302-10.453 23.302-23.302s-10.453-23.302-23.302-23.302H74.612l15.463-23.195a6.58 6.58 0 0 0 .326-6.76c-1.146-2.14-3.377-3.478-5.806-3.478H40.02a6.59 6.59 0 0 0-5.48 2.933l-33.434 50.15c-1.475 2.212-1.475 5.093 0 7.306l33.433 50.15c1.22 1.832 3.278 2.933 5.48 2.933h44.577c2.43 0 4.66-1.337 5.806-3.478z"
                    />
                  </svg>
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/login"
                className="p-2 flex items-center justify-between hover:bg-ui-accent focus:outline-none focus:bg-ui-accent"
                title="Login"
                onClick={() => {
                  setShowProfileMenu(false);
                }}
              >
                <p>Login</p>
                <svg
                  className="w-6 ml-2 text-form-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 297 297"
                >
                  <path
                    fill="currentColor"
                    d="M142 6.5c30.147 0 58.95 9.335 83.294 26.995 2.8 2.023 3.547 5.853 1.74 8.787L204.17 79.374a-6.58 6.58 0 0 1-4.328 3.004c-1.798.354-3.66-.054-5.145-1.13-14.23-10.323-31.07-15.78-48.698-15.78-45.783 0-83.03 37.247-83.03 83.03s37.247 83.03 83.03 83.03c17.63 0 34.468-5.456 48.698-15.78a-6.58 6.58 0 0 1 5.145-1.129c1.798.355 3.366 1.444 4.328 3.004l22.863 37.093c1.808 2.934 1.05 6.763-1.74 8.787C200.95 281.165 172.147 290.5 142 290.5c-78.3 0-142-63.7-142-142s63.7-142 142-142zm64.6 195.257c-1.147-2.142-1.02-4.74.326-6.76l15.464-23.195h-93.566c-12.85 0-23.302-10.453-23.302-23.302s10.453-23.302 23.302-23.302h93.564l-15.463-23.195a-6.58 6.58 0 0 1-.326-6.76c1.146-2.14 3.377-3.478 5.806-3.478h44.575a-6.59 6.59 0 0 1 5.48 2.933l33.434 50.15c1.475 2.212 1.475 5.093 0 7.306l-33.433 50.15c-1.22 1.832-3.278 2.933-5.48 2.933h-44.577c-2.43 0-4.66-1.337-5.806-3.478z"
                  />
                </svg>
              </NavLink>
            )}
          </aside>
        </div>
        <button
          className={`absolute inset-0 w-full cursor-default focus:outline-none ${
            showProfileMenu ? "block" : "hidden"
          }`}
          onClick={() => {
            setShowProfileMenu(false);
          }}
        ></button>
      </nav>
    </header>
  );
}

export default Navigation;
