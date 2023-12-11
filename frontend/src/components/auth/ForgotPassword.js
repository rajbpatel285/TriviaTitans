import { Box, Button, Link, TextField } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "./FirebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  // Initialize firebase app
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const navigate = useNavigate();

  // Method for resetting password
  const handleForgotPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link is sent to your email");
        // Redirect to sign in page
        navigate("/signin");
      } catch (err) {
        alert(err.code);
      }
    }
    // Email is not valid
    else {
      alert("Please enter valid email id");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
          gap: "2rem",
        }}
      >
        <h1>SDP-18 Trivia Titans</h1>
        <h3>Forgot Password</h3>
        <TextField
          sx={{ width: "30%" }}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type="button"
          variant="contained"
          onClick={handleForgotPassword}
          sx={{ padding: "0.6rem 1rem", background: "#4681f4" }}
        >
          Reset Password
        </Button>
        <Link
          onClick={() => navigate("/signin")}
          style={{
            textDecoration: "none",
            color: "#4681f4",
            cursor: "pointer",
          }}
        >
          Already have account? Sign In
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
