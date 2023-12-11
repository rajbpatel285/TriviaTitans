import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../../Context";
import { Box, Button } from "@mui/material";
import TeamMemberTable from "./TeamMemberTable";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../auth/FirebaseConfig";
import { verifyToken } from "../auth/VerifyToken";

const TeamManagement = () => {
  const { shareState } = useContext(Context);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [role, setRole] = useState("");
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

  //Method for setting team data in local storage
  const setTeamData = () => {
    setTeamId(localStorage.getItem("teamId"));
    setTeamName(localStorage.getItem("teamName"));
    setRole(localStorage.getItem("role"));
    const userData = JSON.parse(localStorage.getItem("sdp18_data"));
    setUserId(userData.uid);
  };

  //Method for getting team data
  const getTeamData = async () => {
    if (teamId) {
      const teamsRef = collection(db, "teamData");
      const q = query(teamsRef, where("teamId", "==", teamId));

      const querySnapshot = await getDocs(q);

      setTeamMembers(querySnapshot.docs[0].data().teamMembers);
    }
  };

  //Method for sending invite
  const handleSendInvite = async () => {
    const baseUrl = "https://sdp18-frontend-afu3hhd7da-uc.a.run.app";
    const invite_body = {
      email: email,
      teamId: teamId,
      teamName: teamName,
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_ADD_INVITE_DATA_URL,
        invite_body
      );
      if (response) {
        const resp = JSON.parse(response.data.body);
        const inviteId = resp.inviteId;
        const body = {
          emails: [email],
          subject: "Team Invitation",
          message: `You have been invited to join our team ${teamName}. Please click the link to accept: ${baseUrl}/invite/${inviteId}?teamName=${teamName}`,
        };

        const headers = {
          "x-api-key": process.env.REACT_APP_AWS_API_KEY,
        };
        // Check user has valid token
        const isTokenValid = await verifyToken();

        if (isTokenValid) {
          try {
            // Check user has valid token
            const isTokenValid = await verifyToken();
            if (isTokenValid) {
              const response = await axios.post(
                process.env.REACT_APP_SEND_NOTIFICATION_URL,
                body,
                { headers }
              );
              if (response.data.statusCode === 200) {
                alert("Invitation sent!");
              }
            } else {
              alert("you are not authorized");
              // Redirect to sign in page
              navigate("/signin");
            }
          } catch (err) {
            alert(err.code);
          }
        } else {
          alert("you are not authorized");
        }
      }
    } catch (err) {
      alert(err.code);
    }
  };

  //Method for deleting team and check it is only deleted by admin
  const handleDeleteTeam = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the team? This action cannot be undone."
    );

    // If the user clicked "OK" in the popup, proceed with deleting the team
    if (confirmDelete) {
      try {
        // Delete the team from Firestore
        const teamRef = doc(db, "teamData", teamId);
        await deleteDoc(teamRef);

        localStorage.removeItem("teamId");
        localStorage.removeItem("role");
        alert("Team deleted successfully.");
        // Redirect to home page
        navigate("/home");
        // You can navigate to a different page or take any other action after deleting the team.
      } catch (err) {
        alert(err.code);
      }
    }
  };

  //Method for leaving team and remove this user from team and also check if there is only one admin in team, admin cannot leave the team
  const handleLeaveTeam = async () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave the team?"
    );

    // First, check if the user is the last admin in the team.
    // If yes, prevent leaving the team.
    if (confirmLeave) {
      try {
        const teamsRef = collection(db, "teamData");
        const q = query(teamsRef, where("teamId", "==", teamId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const teamDoc = querySnapshot.docs[0];
          const teamData = teamDoc.data();
          const isAdmin = teamData.teamAdminId.includes(userId);

          if (isAdmin && teamData.teamAdminId.length > 1) {
            // Remove the user from the teamAdminId array
            await updateDoc(teamDoc.ref, {
              teamAdminId: arrayRemove(userId),
            });
            const updatedTeamMembers = teamData.teamMembers.filter(
              (member) => member.userId !== userId
            );
            const userRef = doc(db, "teamData", teamId);
            await updateDoc(userRef, {
              teamMembers: updatedTeamMembers,
            });
            // Redirect to home page
            navigate("/home");
          } else {
            alert("You are the only admin left in the group!");
            return;
          }

          if (!isAdmin) {
            const updatedTeamMembers = teamData.teamMembers.filter(
              (member) => member.userId !== userId
            );
            const userRef = doc(db, "teamData", teamId);
            await updateDoc(userRef, {
              teamMembers: updatedTeamMembers,
            });
            // Redirect to home page
            navigate("/home");
          }
        }

        // Update the user's role or remove the user from the team.
        getTeamData();
        localStorage.removeItem("teamId");
        localStorage.removeItem("teamName");
        alert("You have left the team successfully.");
        // You can navigate to a different page or take any other action after leaving the team.
      } catch (err) {
        alert(err.code);
      }
    }
  };

  useEffect(() => {
    setTeamData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        paddingTop: "5rem",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <h2 style={{ paddingRight: "10px" }}>Team Members of Team:</h2>
        <h2 style={{ color: "red" }}>{teamName}</h2>
      </Box>

      <TeamMemberTable
        db={db}
        teamId={teamId}
        userId={userId}
        getTeamData={getTeamData}
        teamMembers={teamMembers}
      />
      <Button
        onClick={() => getTeamData()}
        sx={{ width: "20%", marginTop: "2rem" }}
        variant="contained"
        type="submit"
      >
        check team status
      </Button>
      {role === "admin" ? (
        <>
          <h2 style={{ paddingTop: "2rem" }}>Invite Users</h2>
          <form
            style={{ width: "50%", paddingBottom: "2rem" }}
            onSubmit={(e) => {
              e.preventDefault();

              e.target.reset();
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                style={{
                  padding: "0.5rem",
                  marginRight: "1rem",
                  width: "100%",
                }}
                type="email"
                name="email"
                placeholder="Invite Email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Button
                onClick={handleSendInvite}
                sx={{ width: "40%" }}
                variant="contained"
                type="submit"
              >
                Send Invitation
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <></>
      )}

      <Button
        sx={{ margin: "2rem 0rem" }}
        onClick={() => navigate("/home")}
        variant="contained"
      >
        Go to Lobby
      </Button>
      <h2>Leave Team</h2>

      <Box sx={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        {role === "admin" ? (
          <Button onClick={handleDeleteTeam} variant="contained">
            Delete Team
          </Button>
        ) : (
          <></>
        )}

        <Button onClick={handleLeaveTeam} variant="contained">
          Leave
        </Button>
      </Box>
    </Box>
  );
};

export default TeamManagement;
