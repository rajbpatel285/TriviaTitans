import React, { useState } from "react";
import { styled } from "styled-components";

const QuestionCard = ({
  countdown,
  currentQuestionIndex,
  questions,
  correct_option,
  setQuizScore,
  setIsCurrentQuestionCorrect,
}) => {
  const selectHandler = (option) => {
    // if option is correct change state to true
    if (option - 1 === correct_option) {
      setQuizScore((prevScore) => {
        return prevScore + 1;
      });
      setIsCurrentQuestionCorrect(true);
    }
    setSelectedOption(option);
  };

  const [selectedOption, setSelectedOption] = useState(-1);

  return (
    <StyledQuestionCardWrapper>
      <div className="question-card">
        <div className="question">
          {currentQuestionIndex + 1 + "."}
          {" " + questions[currentQuestionIndex].question}
        </div>
        <div className="options">
          <div className="timer">
            <span>{countdown}</span>
          </div>
          <div
            className={`option ${selectedOption === 1 ? "selected" : ""}`}
            onClick={() => selectHandler(1)}
          >
            A. {questions[currentQuestionIndex].options[0]}
          </div>
          <div
            className={`option ${selectedOption === 2 ? "selected" : ""}`}
            onClick={() => selectHandler(2)}
          >
            B. {questions[currentQuestionIndex].options[1]}
          </div>
          <div
            className={`option ${selectedOption === 3 ? "selected" : ""}`}
            onClick={() => selectHandler(3)}
          >
            C. {questions[currentQuestionIndex].options[2]}
          </div>
          <div
            className={`option ${selectedOption === 4 ? "selected" : ""}`}
            onClick={() => selectHandler(4)}
          >
            D. {questions[currentQuestionIndex].options[3]}
          </div>
        </div>
      </div>
    </StyledQuestionCardWrapper>
  );
};

const StyledQuestionCardWrapper = styled.div`
  flex-basis: 72%;
  padding: 4rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  .btn-wrapper {
    display: flex;
    font-size: 1.3rem;
    font-weight: 200;
    justify-content: space-between;
    padding: 1rem 0;
    div {
      box-shadow: 1px 1px 8px #ccc;
      border: thin solid #ccc;
      padding: 1rem;
      border-radius: 20px;
      color: rgb(99, 102, 240);
      cursor: pointer;
    }
  }

  .question-card {
    box-shadow: 1px 1px 8px #ccc;
    border: thin solid #ccc;
    border-radius: 20px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .question {
      padding: 2rem;
    }
    .options {
      padding: 2rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      .timer {
        margin-left: auto;
        width: 50px;
        height: 50px;
        text-align: center;
        border: 5px solid rgb(99, 102, 240);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .option {
        flex-basis: 100%;
        font-size: 1.2rem;
        font-weight: 200;
        cursor: pointer;
        border: thin solid #ccc;
        border-radius: 20px;
        padding: 1rem;
        &.selected {
          background-color: rgb(99, 102, 240);
          color: white;
        }
      }
    }
  }
`;

export default QuestionCard;
