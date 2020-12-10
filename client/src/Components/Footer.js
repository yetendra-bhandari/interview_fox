import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <svg
        className="text-ui -mb-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 160 1440 160"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,192L80,208C160,224,320,256,480,240C640,224,800,160,960,160C1120,160,1280,224,1360,256L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
      <p className="py-2 px-4 bg-ui text-ui-text text-center">
        ©{" "}
        <NavLink
          to="/about"
          className="mr-0.5 hover:underline focus:outline-none focus:underline"
          title="About Interview-Fox"
        >
          <em>Interview-Fox</em>
        </NavLink>{" "}
        Corporation {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default Footer;
