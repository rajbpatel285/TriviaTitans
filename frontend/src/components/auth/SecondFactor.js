import React, { useContext, useEffect, useState } from "react";
import { Button, Box, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteUser } from "firebase/auth";
import { Context } from "../../Context";

const SecondFactor = () => {
  const [display, setDisplay] = useState("Answer for MFA");
  const [isDbDataAvailable, setIsDbDataAvailable] = useState(false);
  const [answers, setAnswers] = useState({ a1: "", a2: "", a3: "" });
  const { shareState } = useContext(Context);
  // Comman style
  const textStyle = { padding: "0.8rem", width: "100%", fontSize: "1rem" };

  const location = useLocation();
  const uid = location.state.uid;
  const email = location.state.email;
  const name = location.state.name;
  const auth = shareState.auth;
  const photoURL = location.state.photoURL;

  const navigate = useNavigate();

  // Method for getting input from user for all the answers
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  // Method for to redirect to sign in and delete user from firebase
  const handleGoToSignIn = () => {
    const tempUser = auth.currentUser;
    if (tempUser) {
      deleteUser(tempUser);
    }
    // Redirect to sign in page
    navigate("/signin");
  };

  // Method for storing data in localstorage
  const storeInLocalStorage = async () => {
    if (auth) {
      const token = await auth.currentUser.getIdToken();
      const userdata = {
        email: email,
        uid: uid,
        token: token,
        name: name,
        photoURL: photoURL,
      };
      localStorage.setItem("sdp18_data", JSON.stringify(userdata));
    }
  };

  // Method for check dynamodb if user data is present or not
  const checkDb = async () => {
    try {
      const resposne = await axios.post(process.env.REACT_APP_VERIFY_QNA_URL, {
        uid: uid,
        task: "check",
      });

      if (resposne.data.statusCode === 200) {
        setIsDbDataAvailable(true);
      } else {
        setDisplay("Register your answers");
        setIsDbDataAvailable(false);
      }
    } catch (err) {
      alert(err);
    }
  };

  // Method for for creating subscription on successful sign up
  const createSubscription = async () => {
    const body = {
      email: email,
    };

    const repsonse = await axios.post(
      process.env.REACT_APP_CREATE_SUBSCRIPTION_URL,
      body
    );
  };

  // Method for checking or registering answer into DynamoDb
  const handleSubmit = async (e) => {
    e.preventDefault();
    storeInLocalStorage();
    try {
      // When user is signing up
      if (!isDbDataAvailable) {
        const body = {
          Item: {
            uid: uid,
            a1: answers.a1,
            a2: answers.a2,
            a3: answers.a3,
          },
        };
        try {
          const response = await axios.post(
            process.env.REACT_APP_REGISTER_QNA_URL,
            body
          );
          if (response.data.statusCode === 200) {
            storeInLocalStorage();
            createSubscription();
            alert("You have successfull registered! Check you email!");
            // Redirect to sign in page
            navigate("/signin");
          }
        } catch (err) {
          alert(err.code);
          const tempUser = auth.currentUser;
          deleteUser(tempUser);
          //   navigate("/signin");
        }
      } else {
        // When user is already sign up
        setDisplay("Answer for MFA");
        const body = {
          uid: uid,
          a1: answers.a1,
          a2: answers.a2,
          a3: answers.a3,
          task: "verify",
        };
        try {
          const result = await axios.post(
            process.env.REACT_APP_VERIFY_QNA_URL,
            body
          );
          if (result.data.statusCode === 200) {
            storeInLocalStorage();

            // Redirect to home page
            navigate("/home");
          } else {
            alert("Answers are not matchcing!");
          }
        } catch (err) {
          alert(err.code);
          //   navigate("/signin");
        }
      }
    } catch (err) {
      alert(err.code);
    }
  };

  // Check user is registered or not
  useEffect(() => {
    checkDb();
  }, [isDbDataAvailable]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        gap: "1.5rem",
      }}
    >
      <h1>SDP-18 Trivia Titans</h1>
      <h3>{display}</h3>
      <h3>*Note: Answers are case sensitive*</h3>
      <form onSubmit={handleSubmit} style={{ width: "50%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3>Q1: Where did you born?</h3>
          <input
            style={textStyle}
            name="a1"
            label="a1"
            placeholder="answer 1"
            value={answers.a1}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <h3>Q2: Which is your favorite color?</h3>
          <input
            style={textStyle}
            name="a2"
            label="a2s"
            placeholder="answer 2"
            value={answers.a2}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <h3>Q3: Which is your favorite hobby?</h3>
          <input
            style={textStyle}
            name="a3"
            label="a3"
            placeholder="answer 3"
            value={answers.a3}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              sx={{
                marginTop: "1rem",
                padding: "1rem 1.2rem",
              }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
            <Link
              onClick={handleGoToSignIn}
              style={{
                textDecoration: "none",
                color: "#4681f4",
                cursor: "pointer",
                paddingTop: "1rem",
              }}
            >
              Go to Sign In
            </Link>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default SecondFactor;
