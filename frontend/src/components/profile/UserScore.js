import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../auth/VerifyToken";

const UserScore = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [accuracy, setAccuracy] = useState("");
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  // Method for getting user statistics data
  const getUserStatictics = async () => {
    const sdp18_data = JSON.parse(localStorage.getItem("sdp18_data"));
    setEmail(sdp18_data.email);

    // Check user has valid token
    const isTokenValid = await verifyToken();
    if (isTokenValid) {
      const response = await axios.post(
        process.env.REACT_APP_GET_USER_STATS_URL,
        { email: email }
      );

      if (response.data.body) {
        const data = JSON.parse(response.data.body);
        if (data) {
          setTotalScore(data.totalScore);
          setAccuracy(`${data.accuracy * 100}%`);
          setTotalGamesPlayed(data.totalGamesPlayed);
        }
      }
    } else {
      alert("you are not authorized");
      // Redirect to sign in page
      navigate("/signin");
    }
  };

  useEffect(() => {
    getUserStatictics();
  }, [email]);
  return (
    <Box
      sx={{
        display: "flex",
        gap: "3rem",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      <Box>
        <h2>Your Statistics</h2>
      </Box>
      <Box sx={{ display: "flex", gap: "2rem" }}>
        <Card sx={{ minWidth: 275, marginBottom: 10 }}>
          <CardContent>
            <Typography variant="h5">Score</Typography>
            <Typography variant="h4" color="primary">
              {totalScore > 0 ? totalScore : 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, marginBottom: 10 }}>
          <CardContent>
            <Typography variant="h5">Win/Loss Ratio</Typography>
            <Typography variant="h4" color="secondary">
              {accuracy !== "NaN%" ? accuracy : "0%"}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, marginBottom: 10 }}>
          <CardContent>
            <Typography variant="h5">Games Played</Typography>
            <Typography variant="h4" color="secondary">
              {totalGamesPlayed > 0 ? totalGamesPlayed : 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Button onClick={() => navigate("/team-score")} variant="contained">
        Check Team Statistics
      </Button>
      <Button onClick={() => navigate("/home")} variant="contained">
        Go to Lobby
      </Button>
    </Box>
  );
};

export default UserScore;
