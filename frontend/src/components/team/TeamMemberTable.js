import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
} from "@mui/material";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const TeamMemberTable = ({ db, teamId, userId, getTeamData, teamMembers }) => {
  const [role, setRole] = useState("");
  // Common style
  const borderStyle = { border: "1px solid #e0e0e0", fontSize: "1rem" };

  // Method for removing team member from team by admin
  const handleRemoveMember = async (userId) => {
    try {
      // Find the team member in the data array
      const memberToRemove = teamMembers.find(
        (member) => member.userId === userId
      );
      if (!memberToRemove) {
        console.error("Member not found.");
        return;
      }

      // Update the teamData document in Firestore
      const teamDataRef = doc(db, "teamData", teamId);
      await updateDoc(teamDataRef, {
        // Remove the member from the teamMembers array
        teamMembers: arrayRemove(memberToRemove),
      });

      // After successful removal, fetch data again to get the updated team members
      await getTeamData(); // Call the function to refetch the data
    } catch (err) {
      alert(err.code);
    }
  };

  // Method for promoting team member to admin
  const handlePromote = async (userId) => {
    try {
      // Find the team member in the data array
      const memberToPromote = teamMembers.find(
        (member) => member.userId === userId
      );
      if (!memberToPromote) {
        console.error("Member not found.");
        return;
      }

      // Update the teamData document in Firestore
      const teamDataRef = doc(db, "teamData", teamId);
      await updateDoc(teamDataRef, {
        // Update the role in teamMembers array to "admin"
        teamMembers: teamMembers.map((member) => {
          if (member.userId === userId) {
            return { ...member, role: "admin" };
          }
          return member;
        }),
        // Add the UID to teamAdminId array
        teamAdminId: arrayUnion(userId),
      });

      await getTeamData();
    } catch (err) {
      alert(err.code);
    }
  };

  useEffect(() => {
    getTeamData();
    setRole(localStorage.getItem("role"));
  }, [role, teamId]);
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={borderStyle} align="center"></TableCell>
            <TableCell sx={borderStyle} align="center">
              Name
            </TableCell>
            <TableCell sx={borderStyle} align="center">
              Email
            </TableCell>
            <TableCell sx={borderStyle} align="center">
              Role
            </TableCell>
            {role === "admin" ? (
              <>
                <TableCell sx={borderStyle} align="center">
                  Remove from team
                </TableCell>
                <TableCell sx={borderStyle} align="center">
                  Promote to admin
                </TableCell>
              </>
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {teamMembers &&
            teamMembers.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={borderStyle}>{index + 1}</TableCell>
                <TableCell sx={borderStyle}>{item.userName}</TableCell>
                <TableCell sx={borderStyle}>{item.userEmail}</TableCell>
                <TableCell sx={borderStyle}>{item.role}</TableCell>
                {role === "admin" ? (
                  <>
                    <TableCell sx={borderStyle} align="center">
                      {item.userId !== userId && item.role !== "admin" ? (
                        <Button
                          onClick={() => handleRemoveMember(item.userId)}
                          variant="contained"
                          sx={{ background: "#4681f4" }}
                        >
                          Remove
                        </Button>
                      ) : (
                        <></>
                      )}
                    </TableCell>
                  </>
                ) : (
                  <></>
                )}

                {role === "admin" ? (
                  <>
                    {item.role !== "admin" ? (
                      <TableCell sx={borderStyle} align="center">
                        <Button
                          variant="contained"
                          sx={{ background: "#4681f4" }}
                          onClick={() => handlePromote(item.userId)}
                        >
                          Promote
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell sx={borderStyle} align="center"></TableCell>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TeamMemberTable;
