import React from "react";
import { styled } from "styled-components";
import GameList from "../components/home/GameList";

const QuizHome = () => {
  return (
    <StyledQuizHome>
      <GameList />
    </StyledQuizHome>
  );
};

const StyledQuizHome = styled.div``;

export default QuizHome;
