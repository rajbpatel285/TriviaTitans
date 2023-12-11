import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../Context";
import { firebaseConfig } from "../auth/FirebaseConfig";
import { verifyToken } from "../auth/VerifyToken";

const Invitation = () => {
  const { inviteId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamName = queryParams.get("teamName");
  const { shareState, setShareState } = useContext(Context);
  // Initialize firebase app
  const app = initializeApp(firebaseConfig);
  const navigate = useNavigate();
  let response;

  // Creat db object
  const db = getFirestore(app);

  const body = {
    inviteId: inviteId,
  };
  const headers = {
    "x-api-key": process.env.REACT_APP_AWS_API_KEY,
  };

  // Method for accepting invite, update invitation status in DynamoDb to accepted and adding this user to that team
  const handleAccept = async () => {
    // Check user has valid token
    const isTokenValid = await verifyToken();
    let response;
    if (isTokenValid) {
      response = await axios.post(
        process.env.REACT_APP_ACCEPT_INVITE_URL,
        body,
        { headers }
      );
    } else {
      alert("you are not authorized");
      // Redirect to sign in page
      navigate("/signin");
    }

    if (response.data.statusCode === 200) {
      const teamId = response.data.body.teamId;
      const userData = JSON.parse(localStorage.getItem("sdp18_data"));
      const newTeamMember = {
        role: "member",
        userEmail: userData.email,
        userName: userData.name,
        userId: userData.uid,
      };

      try {
        const teamsRef = collection(db, "teamData");
        const q = query(teamsRef, where("teamId", "==", teamId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // The document with the given teamId exists
          const teamDocRef = querySnapshot.docs[0].ref;
          const teamData = querySnapshot.docs[0].data();

          const isMemberAlreadyPresent = teamData.teamMembers.some(
            (member) => member.userEmail === userData.email
          );

          if (isMemberAlreadyPresent) {
            alert("Team member is already in the team");
            return;
          }

          const updatedTeamMembers = [...teamData.teamMembers, newTeamMember];

          // Update the teamMembers array in Firestore
          try {
            await updateDoc(teamDocRef, { teamMembers: updatedTeamMembers });
            alert("Team member added successfully!");
          } catch (error) {
            console.error("Error updating team members:", error);
          }
        } else {
          alert("Team with the provided teamId not found.");
        }
      } catch (error) {
        console.error("Error adding new teamData to Firestore:", error);
      }
    } else {
      alert(response.data.body);
    }
  };

  // Method for declining invitation and update invitation status in DynamoDb to declined
  const handleDecline = async () => {
    // Check user has valid token
    const isTokenValid = await verifyToken();
    if (isTokenValid) {
      const response = await axios.post(
        process.env.REACT_APP_DECLINE_INVITE_URL,
        body,
        { headers }
      );
    } else {
      alert("you are not authorized");
      // Redirect to sign in page
      navigate("/signin");
    }
    alert(response.data.body);
  };

  // Check user is already in team or not
  useEffect(() => {
    const sdp18_data = localStorage.getItem("sdp18_data");
    if (!sdp18_data) {
      alert("You are not logged in!");
      // Redirect to sign in page
      navigate("/signin");
    }
    const teamId = localStorage.getItem("teamId");
    if (teamId) {
      alert("You are already in team");
      // Redirect to sign in page
      navigate("/signin");
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "5rem",
        flexDirection: "column",
      }}
    >
      <h2>Invitation to Join Team: {teamName}</h2>
      <Box
        sx={{
          paddingTop: "5rem",
          margin: "auto",
        }}
      >
        <Button
          type="button"
          variant="contained"
          onClick={handleAccept}
          sx={{
            padding: "0.6rem 1rem",
            background: "#4681f4",
            marginRight: "1rem",
          }}
        >
          Accept
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleDecline}
          sx={{ padding: "0.6rem 1rem", background: "#4681f4" }}
        >
          Decline
        </Button>
      </Box>
    </Box>
  );
};

export default Invitation;
