import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Chat from "./Chat";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import axios from "axios";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { app } from "../auth/FirebaseConfig";
import {
  Timestamp,
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { Button } from "primereact/button";

const InGame = () => {
  const [quizCategory, setQuizCategory] = useState("");
  const [quizId, setQuizID] = useState("");
  const [questions, setQuestions] = useState([]);
  const [countdown, setCountdown] = useState(15);
  const [quizEnd, setQuizEnd] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCurrentQuestionCorrect, setIsCurrentQuestionCorrect] =
    useState(false);
  const [teamScore, setTeamScore] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const database = getDatabase(app);
  const db = getFirestore(app);

  const teamID = window.localStorage.getItem("teamId");
  const teamName = localStorage.getItem("teamName");
  let data = window.localStorage.getItem("sdp18_data");
  data = JSON.parse(data);
  let userID;
  let userEmail;
  let username;

  if (data) {
    userID = data.uid;
    userEmail = data.email;
    username = data.name;
  }

  useEffect(() => {
    if (!location.state) {
      navigate("/home");
    } else {
      setQuestions([...Object.values(location.state.questions[0])]);
      setQuizCategory(location.state.quizCategory);
      setQuizID(location.state.quiz_id);

      const getTeamScore = () => {
        // getting score of a particular team. team1 in current example
        const scoreRef = ref(
          database,
          `teams/${teamID}/quizes/${location.state.quiz_id}`
        );
        onValue(scoreRef, (snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().score) {
              setTeamScore(snapshot.val().score);
            }
          }
        });
      };
      getTeamScore();
    }
  }, []);

  useEffect(() => {
    // Function to change the question index after 60 seconds
    const changeQuestion = () => {
      // send the score of that question to the database
      if (isCurrentQuestionCorrect) {
        const scoreRef = ref(
          database,
          `teams/${teamID}/quizes/${quizId}/score`
        );

        set(scoreRef, teamScore + 1);
      }
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex < questions.length - 1 ? prevIndex + 1 : 0
      );
      setCountdown(15);
      setIsCurrentQuestionCorrect(false);
    };

    // Set an interval to change the question every 60 seconds
    const intervalId = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
        return;
      }
      // show answer
      else if (showAnswer === false) {
        setShowAnswer(true);
        setCountdown(5);
        return;
      }
      // end quiz
      else if (currentQuestionIndex === questions.length - 1) {
        clearInterval(intervalId);
        if (isCurrentQuestionCorrect) {
          const scoreRef = ref(
            database,
            `teams/${teamID}/quizes/${quizId}/score`
          );

          set(scoreRef, teamScore + 1);
        }
        endQuiz();
        return;
      }
      setShowAnswer(false);
      changeQuestion();
    }, 1000);
    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [countdown]);

  const endQuiz = async () => {
    const result = await axios.post(process.env.REACT_APP_SUBMIT_SCORE_URL, {
      email: userEmail,
      teamid: teamID,
      username: username,
      teamname: teamName,
      quizzes: [
        {
          quizid: quizId,
          quiztype: quizCategory,
          quizscore: quizScore,
          noOfQuestions: questions.length,
          date: Timestamp.fromDate(new Date()).toDate(),
        },
      ],
    });

    const teamsDocRef = doc(db, "teams", teamID);

    // user completed quiz
    await setDoc(
      teamsDocRef,
      { [userID]: { completed: arrayUnion(quizId) } },
      { merge: true }
    );
    setQuizEnd(true);
  };

  if (!quizId) {
    return;
  }

  return (
    <StyledInGame>
      <Chat quizId={quizId} />

      {quizEnd ? (
        <>
          QuizEnded, your score is {quizScore}
          <Button
            label="Home"
            onClick={() => {
              navigate("/home");
            }}
            style={{ height: "fit-content" }}
          />
        </>
      ) : showAnswer ? (
        `Answer is ${
          questions[currentQuestionIndex].options[
            questions[currentQuestionIndex].correct_option
          ]
        } time remaining: ${countdown}`
      ) : (
        <div className="score-question-wrapper">
          <div className="team-score">Team score: {teamScore}</div>
          <QuestionCard
            countdown={countdown}
            details="details"
            questions={questions}
            correct_option={questions[currentQuestionIndex].correct_option}
            currentQuestionIndex={currentQuestionIndex}
            setQuizScore={setQuizScore}
            setIsCurrentQuestionCorrect={setIsCurrentQuestionCorrect}
          />
        </div>
      )}
    </StyledInGame>
  );
};

const StyledInGame = styled.div`
  display: flex;
  height: 93vh;
  .score-question-wrapper {
    width: 100%;
    .team-score {
      box-shadow: 1px 1px 8px #ccc;
      padding: 1rem;
      width: fit-content;
      border-radius: 20px;
      border: thin solid #ccc;
      margin-left: 4rem;
      margin-top: 1rem;
    }
  }
`;

export default InGame;
