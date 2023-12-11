import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import LogOutButton from "../auth/LogOutButton";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <StyledNavbar>
      <div className="title-wrapper" onClick={() => navigate("/home")}>
        Quizzards
      </div>
      <div className="links-wrapper">
        <div onClick={() => navigate("/profile")}>Profile</div>
        <div onClick={() => navigate("/team-register")}>Team</div>
        <div onClick={() => navigate("/leaderboard")}>Leaderboard</div>
        <div onClick={() => navigate("/notifications")}>Notifications</div>
        <div onClick={() => navigate("/chatbot")}>Chatbot</div>
        <LogOutButton />
      </div>
    </StyledNavbar>
  );
};

const StyledNavbar = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: thin solid #ccc;
  box-shadow: 1px 1px 8px #ccc;
  justify-content: space-between;
  align-items: center;
  .title-wrapper {
    cursor: pointer;
  }
  .links-wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
    div {
      cursor: pointer;
    }
    button {
      background-color: rgb(99, 102, 241);
    }
  }
`;

export default Navbar;
