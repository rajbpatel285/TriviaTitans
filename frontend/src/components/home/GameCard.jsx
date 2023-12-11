import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../auth/FirebaseConfig";

const GameCard = ({
  title,
  category,
  id,
  description,
  timestamp,
  questions,
  participated,
  participateHandler,
  completed,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState("");
  const [noOfParticipants, setNoOfParticipants] = useState(0);

  const db = getFirestore(app);

  // useEffect for timer and get participated quizes
  useEffect(() => {
    // get no of participants
    const getNoOfParticipants = async () => {
      const docRef = doc(db, "quizes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNoOfParticipants(docSnap.data().participants?.length);
      }
    };
    getNoOfParticipants();

    let currentTime = new Date();
    const utcDateStr = timestamp;
    const utcDate = new Date(utcDateStr);
    const localDate = new Date(
      utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000
    );

    let givenTime = new Date(localDate);

    if (givenTime < currentTime) {
      setTime("");
    } else {
      const intervalID = setInterval(() => {
        setTime(getTimeDifference(givenTime, intervalID));
      }, 1000);
      return () => {
        clearInterval(intervalID);
      };
    }
  }, []);

  const getTimeDifference = (quizTimeStamp, intervalID) => {
    let currentTime = new Date();
    let givenTimestamp = new Date(quizTimeStamp);

    let timeDifference = givenTimestamp - currentTime;
    let seconds = Math.floor(timeDifference / 1000) % 60;
    let minutes = Math.floor(timeDifference / 1000 / 60) % 60;
    let hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;
    let days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(intervalID);
      return "";
    }
    return `${days} days : ${hours} hrs : ${minutes} : mins : ${seconds} secs`;
  };

  const dialogFooter = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => {
          setVisible(false);
          participateHandler(id);
        }}
        autoFocus
      />
    </div>
  );

  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );

  let html = null;

  if (time && participated) {
    html = (
      <>
        {time}
        <Button label="Already Participated" disabled />
      </>
    );
  } else if (time) {
    html = (
      <>
        {time}
        <Button
          label="Participate"
          onClick={() => {
            setVisible(true);
          }}
        />
      </>
    );
  } else if (completed) {
    html = <Button label="Already Completed" disabled />;
  } else if (!time && participated) {
    html = (
      <Button
        label="Enter Quiz"
        onClick={() => {
          navigate("/game", {
            state: {
              quiz_id: id,
              questions: questions,
              quizCategory: category,
            },
          });
        }}
      />
    );
  } else {
    html = <Button label="Did not participate" disabled />;
  }

  const cardfooter = (
    <div className="card flex justify-content-center">
      {html}
      <Dialog
        header={title}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={dialogFooter}
      >
        <p className="m-0">Do you want to participate in this quiz?</p>
      </Dialog>
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={title}
        subTitle={category}
        footer={cardfooter}
        header={header}
        className="md:w-25rem"
      >
        <p className="m-0">
          {description} <br /> <br /> No of Participants: {noOfParticipants}{" "}
          <br /> <br />
          Duration:{" "}
          {Math.ceil(([...Object.values(questions[0])].length * 70) / 60)} mins
        </p>
      </Card>
    </div>
  );
};

export default GameCard;
