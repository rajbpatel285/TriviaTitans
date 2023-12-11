import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import styled from "styled-components";
import { app } from "../auth/FirebaseConfig";

const Chat = ({ quizId }) => {
  const [msgs, setMsgs] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [chatObject, setChatObject] = useState({});
  const chatboxRef = useRef(null);

  let data = window.localStorage.getItem("sdp18_data");
  data = JSON.parse(data);
  let currentUser = data.name;

  const teamID = window.localStorage.getItem("teamId");

  const database = getDatabase(app);

  const scrollToBottom = () => {
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  };

  useEffect(() => {
    const getChat = () => {
      // getting chat of a particular team
      const chatRef = ref(database, `teams/${teamID}/quizes/${quizId}`);
      onValue(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          setChatObject(snapshot.val());
        }
      });
    };
    getChat();
    scrollToBottom();
  }, []);

  useEffect(() => {
    let chat = chatObject.chat;
    let msgs = [];
    if (chatObject.chat) {
      Object.keys(chat).forEach((key) => {
        msgs.push(chat[key]);
      });
      setMsgs([...msgs]);
    } else {
      setMsgs([]);
    }
  }, [chatObject]);

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  const msgsHtml = msgs.map((msg) => {
    return (
      <div
        className={`msg-wrapper ${
          msg.sender === currentUser ? "curr-user" : ""
        }`}
      >
        <span className="msg-sender">{msg.sender}</span>
        <p
          className={`msg-content ${
            msg.sender === currentUser ? "curr-user" : ""
          }`}
        >
          {msg.content}
        </p>
      </div>
    );
  });

  const msgInputHandler = (event) => {
    setMsgInput(event.target.value);
  };

  const sendMsgHandler = (event) => {
    event.preventDefault();

    if (!msgInput) {
      return;
    }

    const chatRef = ref(database, `teams/${teamID}/quizes/${quizId}/chat`);
    const data = { ...msgs };
    data[msgs.length + 1] = {
      content: msgInput,
      sender: currentUser,
      timestamp: new Date().valueOf(),
    };
    set(chatRef, data);
    setMsgInput("");
  };

  return (
    <StyledChat>
      <StyledChatContentWrapper ref={chatboxRef}>
        <StyledChatContents className="chat-contents">
          {msgsHtml}
        </StyledChatContents>
      </StyledChatContentWrapper>

      <StyledChatInputWrapper
        className="chat-input-wrapper"
        onSubmit={sendMsgHandler}
      >
        <input
          type="text"
          placeholder="Type a message"
          onChange={msgInputHandler}
          value={msgInput}
        />
        <div className="send-btn" onClick={sendMsgHandler}>
          <AiOutlineSend />
        </div>
      </StyledChatInputWrapper>
    </StyledChat>
  );
};

const StyledChat = styled.div`
  flex-basis: 28%;
  border-right: thin solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 1px 1px 8px #ccc;
`;

const StyledChatContentWrapper = styled.div`
  overflow: scroll;
  -ms-overflow-style: none; // Hide scrollbar for IE and Edge
  scrollbar-width: none; // Hide scrollbar for Firefox

  // Hide scrollbar for Chrome, Safari and Opera
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledChatContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  .msg-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    .msg-sender {
      font-size: 0.8rem;
      margin-left: 0.5rem;
    }
    .msg-content {
      border: thin solid #ccc;
      padding: 0.5rem 1rem;
      border-radius: 30px;
      width: fit-content;
      &.curr-user {
        background-color: rgb(99, 102, 240);
        color: white;
      }
    }
    &.curr-user {
      align-self: flex-end;
      .msg-sender {
        margin-left: 0;
        margin-right: 0.5rem;
        align-self: flex-end;
      }
    }
  }
`;

const StyledChatInputWrapper = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  input {
    width: 100%;
    outline: none;
    border: thin solid #ccc;
    padding: 1rem;
    border-radius: 2rem;
  }
  .send-btn {
    background-color: rgb(99, 102, 240);
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    text-align: center;
    svg {
      font-size: 2rem;
      margin-left: 5px;
      color: white;
    }
    :hover {
      cursor: pointer;
    }
  }
`;

export default Chat;
