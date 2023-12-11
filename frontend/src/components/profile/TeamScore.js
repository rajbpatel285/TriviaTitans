import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { verifyToken } from "../auth/VerifyToken";

const TeamScore = () => {
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [accuracy, setAccuracy] = useState("");
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  // Method for getting team statistics data
  const getTeamStatictics = async () => {
    const teamId = localStorage.getItem("teamId");
    setTeamId(teamId);

    // Check user has valid token
    const isTokenValid = await verifyToken();
    if (isTokenValid) {
      const response = await axios.post(
        process.env.REACT_APP_GET_TEAM_STATS_URL,
        { teamId: teamId }
      );

      if (response.data.body) {
        const data = JSON.parse(response.data.body);

        if (data) {
          setTotalScore(data.Team_Total);
          setAccuracy(`${data.Team_Accuracy * 100}%`);
          setTotalGamesPlayed(data.Team_Total_Games_Played);
        }
      }
    } else {
      alert("you are not authorized");
      // Redirect to sign in page
      navigate("/signin");
    }
  };

  useEffect(() => {
    getTeamStatictics();
  }, [teamId]);

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
        <h2>Team Statistics</h2>
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
      <Button onClick={() => navigate("/user-score")} variant="contained">
        Check User Statistics
      </Button>
      <Button onClick={() => navigate("/home")} variant="contained">
        Go to Lobby
      </Button>
    </Box>
  );
};

export default TeamScore;
