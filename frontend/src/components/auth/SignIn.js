import React, { useContext, useEffect } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseConfig";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { IconButton, Link, TextField } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Context } from "../../Context";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const SignIn = () => {
  // Initialize firebase app
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { shareState, setShareState } = useContext(Context);

  const navigate = useNavigate();
  // Db object is created
  const db = getFirestore(app);

  // Method for navigate to second factor authentication
  const sendToSecondFactor = (user) => {
    navigate("/secondfactor", {
      state: {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  };

  // Method for getting teamId
  const getTeamId = async (id) => {
    const teamsRef = collection(db, "teamData");

    try {
      const querySnapshot = await getDocs(teamsRef);
      const teams = querySnapshot.docs.map((doc) => {
        const teamData = doc.data();
        // Find the team member with the specified userId
        const teamMember = teamData.teamMembers.find(
          (member) => member.userId === id
        );

        // If the team member is found, return an object with the team data and the member's role
        if (teamMember) {
          localStorage.setItem("role", teamMember.role);
          localStorage.setItem("teamId", teamData.teamId);
          localStorage.setItem("teamName", teamData.teamName);
        }
      });
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  // Method for handelling sign in with email and password
  const handleSignIn = async () => {
    if (email && password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        getTeamId(user.uid);
        sendToSecondFactor(user);
      } catch (err) {
        alert(err.code);
      }
    } else {
      alert("Please enter valid email and password");
    }
  };

  // Method for sign in with google
  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      getTeamId(user.uid);
      sendToSecondFactor(user);
    } catch (err) {
      alert(err.code);
    }
  };

  // Method for sign in with facebook
  const handleFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      getTeamId(user.uid);
      sendToSecondFactor(user);
    } catch (err) {
      alert(err.code);
    }
  };

  useEffect(() => {
    setShareState({ ...shareState, auth, app });
  }, []);

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
          label="Email"
          variant="outlined"
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ width: "30%" }}
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
          Sign In with email
        </Button>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <IconButton
            onClick={handleGoogle}
            aria-label="delete"
            sx={{ fontSize: "3.5rem" }}
          >
            <GoogleIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={handleFacebook}
            aria-label="delete"
            sx={{ fontSize: "3.5rem" }}
          >
            <FacebookIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Link
          onClick={() => navigate("/forgotpassword")} // Redirect to forgot password page
          style={{
            textDecoration: "none",
            color: "#4681f4",
            cursor: "pointer",
          }}
        >
          Forgot Password
        </Link>
        <Link
          onClick={() => navigate("/signup")} // Redirect to sign up page
          style={{
            textDecoration: "none",
            color: "#4681f4",
            cursor: "pointer",
          }}
        >
          Create Account
        </Link>
      </Box>
    </Box>
  );
};

export default SignIn;
