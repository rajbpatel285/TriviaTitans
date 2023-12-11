import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

const ChatContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "400px",
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "5px",
  height: "400px",
  overflowY: "scroll",
});

const UserMessage = styled("p")({
  color: "red",
  textAlign: "right",
});

const BotMessage = styled("p")({
  color: "blue",
  textAlign: "left",
});

const DeleteButtonContainer = styled("div")({
  marginTop: "10px",
});

const Alert = styled("div")({
  padding: "10px",
  width: "100%",
  backgroundColor: "green",
  color: "#fff",
  textAlign: "center",
});

const LexChatbot = () => {
  const [inputText, setInputText] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showAlert, setShowAlert] = useState(false); // State for showing the alert
  const storedData = localStorage.getItem("sdp18_data");
  const dataObject = JSON.parse(storedData);
  const email = dataObject.email;
  const teamId = localStorage.getItem("teamId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const body = {
        requestType: "GET",
        email: email,
        isUser: false,
        message: "",
      };
      const response = await axios.post(
        "https://d3wf6srhc2.execute-api.us-east-1.amazonaws.com/prod/chatbot-db",
        body
      );
      console.log(JSON.parse(response.data.body));
      const entries = JSON.parse(response.data.body);
      //   entries.sort((a, b) => {
      //     const dateA = new Date(a.date + " " + a.time);
      //     const dateB = new Date(b.date + " " + b.time);
      //     return dateA - dateB;
      //   });
      console.log(entries);
      const messages = entries.map((entry) => ({
        text: entry.message,
        isUser: entry.isUser,
      }));
      setMessages(messages);
      console.log(messages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const addMessage = (message, isUser) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: isUser },
    ]);
    try {
      const body = {
        requestType: "POST",
        email: email,
        isUser: isUser,
        message: message,
      };
      const response = axios.post(
        "https://d3wf6srhc2.execute-api.us-east-1.amazonaws.com/prod/chatbot-db",
        body
      );
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleDeleteMessages = async () => {
    try {
      const body = {
        requestType: "DELETE",
        email: email,
        isUser: false,
        message: "",
      };
      const response = await axios.post(
        "https://d3wf6srhc2.execute-api.us-east-1.amazonaws.com/prod/chatbot-db",
        body
      );
      fetchMessages();
      // Show the alert for 5 seconds
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSendMessage = async () => {
    console.log(lastMessage);
    const userMessage = inputText.trim();
    if (userMessage === "") {
      return;
    }

    addMessage(userMessage, true);
    setInputText("");

    try {
      const response = await axios.post(
        "https://po4vgv9lzl.execute-api.us-east-1.amazonaws.com/prod/chatbot",
        { message: userMessage }
      );
      if (userMessage === "no") {
        addMessage("Thank you!", false);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else if (lastMessage === "") {
        setLastMessage("How can I help you?");
        addMessage("How can I help you?", false);
        addMessage("1. Navigation Support", false);
        addMessage("2. Get Team Score", false);
      } else if (lastMessage === "How can I help you?") {
        if (userMessage === "1") {
          setLastMessage("Please select Navigation Option:");
          addMessage("Please select Navigation Option:", false);
          addMessage("1. How to Create team?", false);
          addMessage("2. How to invite Members to your team?", false);
          addMessage("3. How to participate in a quiz?", false);
          addMessage("4. How to view your and team score?", false);
        } else {
          setLastMessage("Fulfilled");
          try {
            console.log("teamId", teamId);
            const body = {
              teamId: teamId,
            };
            const response = axios.post(
              "https://2qas301ahl.execute-api.us-east-1.amazonaws.com/prod/getTeamStats",
              body
            );
            console.log("Team Score - ", response);
          } catch (error) {
            console.error("Error adding data:", error);
          }
          addMessage("The score for your team is 19", false);
        }
      } else if (lastMessage === "Please select Navigation Option:") {
        if (userMessage === "1") {
          setLastMessage("Fulfilled");
          addMessage(
            "To create a team: Team > Create New Team Name > Create Team",
            false
          );
        } else if (userMessage === "2") {
          setLastMessage("Fulfilled");
          addMessage(
            "To invite members to your team: Create your Team > Send Invitation",
            false
          );
        } else if (userMessage === "3") {
          setLastMessage("Fulfilled");
          addMessage(
            "To participate in a quiz: Register for an active quiz > Enter quiz when it starts",
            false
          );
        } else {
          setLastMessage("Fulfilled");
          addMessage(
            "To view your or team score: Profile > User Score OR Team Score",
            false
          );
        }
      } else if (lastMessage === "Fulfilled") {
        setLastMessage("");
        addMessage("Is there anything else I can do?", false);
      }
    } catch (error) {
      console.log(error);
      addMessage(
        "Sorry, I am experiencing some technical difficulties.",
        false
      );
    }
  };

  return (
    <Container>
      {showAlert && <Alert>Chat deleted successfully</Alert>}
      <ChatContainer>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.isUser ? (
              <UserMessage>{message.text}</UserMessage>
            ) : (
              <BotMessage>{message.text}</BotMessage>
            )}
          </React.Fragment>
        ))}
      </ChatContainer>
      <div style={{ marginTop: "10px" }}>
        <TextField
          variant="outlined"
          label="Type your message"
          value={inputText}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
      <DeleteButtonContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDeleteMessages}
        >
          Delete Chat History
        </Button>
      </DeleteButtonContainer>
    </Container>
  );
};

export default LexChatbot;
