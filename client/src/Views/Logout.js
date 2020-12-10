import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

function Logout(props) {
  useEffect(() => {
    props.logout();
  }, [props]);

  return <Redirect to="/" />;
}

export default Logout;
