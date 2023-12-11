import axios from "axios";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { app } from "../auth/FirebaseConfig";
import GameCard from "./GameCard";

const GameList = () => {
  const [quizTitles, setQuizTitles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState([]);
  const [participatedQuizes, setParticipatedQuizes] = useState([]);
  const [completedQuizes, setCompletedQuizes] = useState([]);

  const db = getFirestore(app);

  // get all quizes
  useEffect(() => {
    const getQuizTitles = async () => {
      try {
        const result = await axios.get(process.env.REACT_APP_GAMES_URL);
        setQuizTitles([...result.data]);
      } catch (err) {
        console.error(err);
      }
    };
    getQuizTitles();

    // get the list of completed quizes and participated quizes for current user
    const getQuizes = async () => {
      const teamID = window.localStorage.getItem("teamId");
      let data = window.localStorage.getItem("sdp18_data");
      data = JSON.parse(data);
      if (data) {
        const userID = data.uid;
        if (teamID) {
          const docRef = doc(db, "teams", teamID);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data[userID]) {
              setParticipatedQuizes([...data[userID].participated]);
              if (data[userID].completed) {
                setCompletedQuizes([...data[userID].completed]);
              }
            }
          }
        }
      }
    };
    getQuizes();
  }, []);

  const handleInput = (event) => {
    setSearchInput(event.target.value);
  };

  const participateHandler = async (quizID) => {
    const teamID = window.localStorage.getItem("teamId");
    let data = window.localStorage.getItem("sdp18_data");
    data = JSON.parse(data);

    // check for user logged in and user team before allowing them to participate
    if (data) {
      if (!teamID) {
        alert("User not in a team");
        return;
      }
    } else {
      alert("User not logged in");
      return;
    }
    const userID = data.uid;

    const teamsDocRef = doc(db, "teams", teamID);
    await setDoc(
      teamsDocRef,
      { [userID]: { participated: arrayUnion(quizID) } },
      { merge: true }
    );

    // user participated quiz
    await setDoc(
      teamsDocRef,
      { [userID]: { participated: arrayUnion(quizID) } },
      { merge: true }
    );
    setParticipatedQuizes((quizes) => {
      return [...quizes, quizID];
    });

    // for no of participants
    const quizesDocRef = doc(db, "quizes", quizID);
    await setDoc(
      quizesDocRef,
      { participants: arrayUnion(userID) },
      { merge: true }
    );
  };

  const filterHanlder = (event) => {
    if (event.target.checked) {
      setFilters([...filters, event.target.name.toLowerCase()]);
    } else {
      let tempFilters = [...filters];
      const index = tempFilters.indexOf(event.target.name);
      tempFilters.splice(index, 1);
      setFilters([...tempFilters]);
    }
  };

  if (!quizTitles) {
    return <div>Loading ...</div>;
  }

  const html = quizTitles.map((quiz) => {
    if (quiz.title.toLowerCase().includes(searchInput.toLowerCase())) {
      if (filters.length === 0) {
        return (
          <GameCard
            key={quiz.id}
            id={quiz.id}
            title={quiz.title}
            timestamp={quiz.date}
            description={quiz.description}
            category={quiz.category}
            questions={quiz.selected_questions}
            participated={participatedQuizes.includes(quiz.id)}
            completed={completedQuizes.includes(quiz.id)}
            participateHandler={participateHandler}
          />
        );
      } else if (
        filters.includes(quiz.category.toLowerCase()) ||
        filters.includes(quiz.difficulty.toLowerCase())
      ) {
        return (
          <GameCard
            key={quiz.id}
            id={quiz.id}
            title={quiz.title}
            timestamp={quiz.date}
            description={quiz.description}
            category={quiz.category}
            questions={quiz.selected_questions}
            participated={participatedQuizes.includes(quiz.id)}
            completed={completedQuizes.includes(quiz.id)}
            participateHandler={participateHandler}
          />
        );
      }
    }
  });

  return (
    <StyledGameList>
      <div className="filter-wrapper">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search quiz"
            value={searchInput}
            onChange={handleInput}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="entertainment">Entertainment</label>
          <input
            type="checkbox"
            name="entertainment"
            id="entertainment"
            onChange={filterHanlder}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="sports">Sports</label>
          <input
            type="checkbox"
            name="sports"
            id="sports"
            onChange={filterHanlder}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="General Knowledge">General Knowledge</label>
          <input
            type="checkbox"
            name="General Knowledge"
            id="General Knowledge"
            onChange={filterHanlder}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="computer science">Computer Science</label>
          <input
            type="checkbox"
            name="computer science"
            id="computer science"
            onChange={filterHanlder}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="easy">Easy</label>
          <input
            type="checkbox"
            name="easy"
            id="easy"
            onChange={filterHanlder}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="medium">Medium</label>
          <input
            type="checkbox"
            name="medium"
            id="medium"
            onChange={filterHanlder}
          />
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="hard">Hard</label>
          <input
            type="checkbox"
            name="hard"
            id="hard"
            onChange={filterHanlder}
          />
        </div>
      </div>
      <div className="quiz-wrapper">{html}</div>
    </StyledGameList>
  );
};

const StyledGameList = styled.div`
  width: fit-content;
  margin: 5rem auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  .filter-wrapper {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search-wrapper {
      input {
        padding: 1rem;
        border: none;
        outline: none;
        box-shadow: 1px 1px 8px 2px #ccc;
        border-radius: 30px;
        width: 400px;
      }
    }
  }
  .quiz-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
`;

export default GameList;
