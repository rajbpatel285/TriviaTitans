import { Box, Button, TextField } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "./FirebaseConfig";

const AdminSiginIn = () => {
  // Initialize firebase app
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Handle Sign in method with email and password
  const handleSignIn = async () => {
    if (email !== "sdp18@admin.com") {
      alert("User is not admin!");
      return;
    }
    if (email && password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        storeInLocalStorage();
      } catch (err) {
        alert(err.code);
      }
    } else {
      alert("Please enter valid email and password");
    }
  };

  //Store details in local storage
  const storeInLocalStorage = async () => {
    const token = await auth.currentUser.getIdToken();
    const user = auth.currentUser;
    const userdata = {
      email: user.email,
      uid: user.uid,
      token: token,
      name: user.displayName,
    };
    localStorage.setItem("sdp18_data", JSON.stringify(userdata));
    // Redirect to Trivia game management page
    navigate("/triviagamemanagement");
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
        <h1>SDP-18 Trivia Titans Admin Login</h1>
        <TextField
          sx={{ width: "20%" }}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ width: "20%" }}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="button"
          variant="contained"
          onClick={handleSignIn}
          sx={{ padding: "0.6rem 1rem", background: "#4681f4" }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSiginIn;
