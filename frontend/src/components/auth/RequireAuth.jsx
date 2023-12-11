import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  // check if user is logged in or not, if yes route to the desired page or route to signin page
  const user = localStorage.getItem("sdp18_data");
  if (!user) {
    alert("You are not logged in!");
    return <Navigate to="/" />;
  }
  return children;
};

export default RequireAuth;
