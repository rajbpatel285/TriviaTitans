import { Box, Button, Link, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
} from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { initializeApp } from "firebase/app";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // Initialize firebase app
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const navigate = useNavigate();

  // Method for signin up with email and password
  const handleSignUp = async () => {
    if (name && email && password) {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = result.user;
        updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Redirect to second factor authentication page
        navigate("/secondfactor", {
          state: {
            uid: user.uid,
            name: name,
            email: email,
          },
        });
      } catch (err) {
        alert(err.code);
        const tempUser = auth.currentUser;
        if (tempUser) {
          deleteUser(tempUser);
        }
      }
    } else {
      alert("Please enter all the fields");
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
        <TextField
          sx={{ width: "30%" }}
          id="outlined-basic"
          label="Name"
          variant="outlined"
          type={"text"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <TextField
          sx={{ width: "30%" }}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="button"
          variant="contained"
          onClick={handleSignUp}
          sx={{ padding: "0.6rem 1rem", background: "#4681f4" }}
        >
          Sign Up
        </Button>
        <Box sx={{ display: "flex", gap: "1rem" }}></Box>
        <Link
          onClick={() => navigate("/signin")} // Redirect to sign in  page
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
}

export default SignUp;
