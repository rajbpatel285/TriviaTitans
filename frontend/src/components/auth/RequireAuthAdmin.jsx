import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuthAdmin = ({ children }) => {
  // check if user is admin in or not, if yes route to the desired page or route to signin page
  let data = localStorage.getItem("sdp18_data");
  data = JSON.parse(data);
  if (!data) {
    alert("You are not logged in!");
    return <Navigate to="/" />;
  }
  const userEmail = data.email;
  if (userEmail !== "sdp18@admin.com") {
    alert("You are not an admin!");
    return <Navigate to="/" />;
  }
  return children;
};

export default RequireAuthAdmin;
