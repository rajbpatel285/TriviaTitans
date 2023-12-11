import React, { useContext, useEffect, useState } from "react";
import { Button, Box, Avatar } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";

import { Context } from "../../Context";
import { getAuth, updateProfile } from "firebase/auth";
import LogOutButton from "./LogOutButton";

const NameAndProfilePic = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  let app, auth;
  const navigate = useNavigate();

  const { shareState } = useContext(Context);
  // Initialize firebase app
  try {
    if (shareState.app) {
      app = shareState.app;
      auth = shareState.auth;
    } else {
      auth = getAuth(app);
    }
  } catch (err) {
    alert(err.code);
  }

  // Method for getting picture file uploaded
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    // Generate a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Method for changing user name
  const updateName = async (e) => {
    e.preventDefault();
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
    const userDataObject = JSON.parse(localStorage.getItem("sdp18_data"));

    // Update the photoURL property in the object
    userDataObject.name = name;

    // Stringify the updated object and set it back to localStorage
    localStorage.setItem("sdp18_data", JSON.stringify(userDataObject));
    alert("Name is Updated!");
  };

  // Method for changing profile pic
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Upload profile picture to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, profilePic.name);
    await uploadBytes(storageRef, profilePic);
    // Get the download URL of the uploaded profile picture
    const profilePicUrl = await getDownloadURL(storageRef);

    await updateProfile(auth.currentUser, {
      photoURL: profilePicUrl,
    });

    setProfilePic(null);
    const userDataObject = JSON.parse(localStorage.getItem("sdp18_data"));

    // Update the photoURL property in the object
    userDataObject.photoURL = profilePicUrl;

    // Stringify the updated object and set it back to localStorage
    localStorage.setItem("sdp18_data", JSON.stringify(userDataObject));
    alert("Profile is Updated!");
  };

  // Get and set user data
  useEffect(() => {
    const sdp18_data = JSON.parse(localStorage.getItem("sdp18_data"));
    if (sdp18_data) {
      setEmail(sdp18_data.email);
      setUid(sdp18_data.uid);
      setName(sdp18_data.name);
    }
    if (auth) {
      const user = auth.currentUser;
      if (user.photoURL) {
        setPreviewUrl(user.photoURL);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h1>SDP-18 Trivia Titans</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "5rem",
          alignItems: "center",
          marginBottom: "5rem",
          width: "80%",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid black",
            padding: "2rem",
          }}
        >
          <h2>Profile Pic</h2>
          <Avatar
            alt="Profile Picture"
            src={previewUrl}
            sx={{ width: 150, height: 150 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            required
          />
          <Button
            sx={{ marginTop: "1rem" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            justifyItems: "center",
            border: "1px solid black",
            padding: "2rem",
          }}
        >
          <h2 style={{ marginTop: "1rem" }}>Your Name: {name}</h2>
          <p style={{ padding: "0", margin: "1rem 0rem" }}>Change Name</p>
          <input
            style={{ padding: "0.5rem 0rem", width: "100%" }}
            type="text"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Button
            sx={{ marginTop: "2rem", width: "50%", alignSelf: "center" }}
            onClick={updateName}
            type="button"
            variant="contained"
            color="primary"
          >
            Update Name
          </Button>
        </Box>
      </form>
      <Box
        sx={{
          display: "flex",
          gap: "5rem",
          marginBottom: "3rem",
          border: "1px solid black",
          padding: "2rem",
        }}
      >
        <Button onClick={() => navigate("/user-score")} variant="contained">
          User Score
        </Button>
        <Button onClick={() => navigate("/team-score")} variant="contained">
          Team Score
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: "2rem" }}>
        <Button onClick={() => navigate("/home")} variant="contained">
          Go to Lobby
        </Button>
        <LogOutButton />
      </Box>
    </Box>
  );
};

export default NameAndProfilePic;
