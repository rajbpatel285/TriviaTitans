import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Context } from "../../Context";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../auth/FirebaseConfig";
import { verifyToken } from "../auth/VerifyToken";

// Chat Gpt api key to generate cool team name
const CHATGPT_API_KEY = process.env.REACT_APP_CHAT_GPT_API_KEY;

const TeamRegister = () => {
  const [teamName, setTeamName] = useState("Game");
  const [teamId, setTeamId] = useState("");
  const { shareState } = useContext(Context);
  const navigate = useNavigate();
  let app, auth;

  // Initialize firebase app
  try {
    if (shareState.app) {
      app = shareState.app;
      auth = shareState.auth;
    } else {
      app = initializeApp(firebaseConfig);
    }
  } catch (err) {
    alert(err.code);
  }
  // Create db object
  const db = getFirestore(app);

  // Method for generating cool team name by chat gpt
  const generateTeamName = async () => {
    const headers = {
      Authorization: `Bearer ${CHATGPT_API_KEY}`,
      "Content-Type": "application/json",
    };
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Generate only one unique team name for me. No sentence",
        },
      ],
      stop: "\n",
    };

    try {
      // Check user has valid token
      const isTokenValid = await verifyToken();
      if (isTokenValid) {
        const response = await axios.post(
          process.env.REACT_APP_CHAT_GPT_URL,
          data,
          {
            headers,
          }
        );
        const result = response.data;
        const teamName = result.choices[0].message.content;

        setTeamName(teamName);
      } else {
        alert("you are not authorized");
        // Redirect to sign in page
        navigate("/signin");
      }
    } catch (err) {
      alert(err.code);
    }
  };

  // Method for sending invite
  const handleSendInvite = async (e) => {
    e.preventDefault();
    let newTeamId;
    const userData = JSON.parse(localStorage.getItem("sdp18_data"));

    if (!teamId || teamId === undefined || teamId === "") {
      newTeamId = uuidv4();
      // Create a new document in the teamData collection in Firestore
      const newTeamData = {
        teamId: newTeamId,
        teamAdminId: [userData.uid],
        teamMembers: [
          {
            role: "admin",
            userEmail: userData.email,
            userId: userData.uid,
            userName: userData.name,
          },
        ],
        teamName: teamName,
      };

      try {
        const teamDataRef = doc(db, "teamData", newTeamId);
        await setDoc(teamDataRef, newTeamData);
      } catch (error) {
        console.error("Error adding new teamData to Firestore:", error);
      }
      localStorage.setItem("teamId", newTeamId);
      localStorage.setItem("role", "admin");
      localStorage.setItem("teamName", teamName);
      setTeamId(newTeamId);

      // sendInvite(newTeamId);
      // Redirect to team manage page
      navigate("/team-manage");
    } else {
      alert("You are in a team!");
      // Redirect to team manage page
      navigate("/team-manage");
    }
  };

  useEffect(() => {
    generateTeamName();
    const existingTeamId = localStorage.getItem("teamId");
    if (existingTeamId) {
      setTeamId(existingTeamId);
      alert("You are already in team!");
      // Redirect to team manage page
      navigate("/team-manage");
    }
  }, []);
  return (
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
      <h2 style={{ display: "flex", alignItems: "center" }}>
        Your Team Name is :
        <p style={{ color: "red", marginLeft: "0.3rem" }}>{teamName}</p>
      </h2>
      <form
        style={{
          display: "flex",
          width: "50%",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
        onSubmit={handleSendInvite}
      >
        {/* <TextField
          id="invite"
          label="Enter email id to send invite"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: "50%" }}
          type="email"
          required
        /> */}
        <Button onClick={generateTeamName} variant="contained">
          Generate new team name
        </Button>
        <Button type="submit" variant="contained">
          Create team
        </Button>
        <Button
          sx={{ margin: "2rem 0rem" }}
          onClick={() => navigate("/home")}
          variant="contained"
        >
          Go to Lobby
        </Button>
      </form>
    </Box>
  );
};

export default TeamRegister;
