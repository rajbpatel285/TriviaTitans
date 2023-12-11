import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseConfig";

const LogOutButton = () => {
  const navigate = useNavigate();
  // Initialize firebase app
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Method for logging out
  const handleLogout = async () => {
    try {
      // Sign out the user using the Firebase Auth API
      signOut(auth)
        .then(() => {
          //Clearing data from local storage
          localStorage.clear();

          alert("Successfully Logged Out!");
          // Redirect to sign in page
          navigate("/signin");
        })
        .catch((err) => {
          alert(err);
        });
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };
  return (
    <Button variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogOutButton;
