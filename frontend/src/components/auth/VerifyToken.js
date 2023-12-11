import axios from "axios";

// Util method to verify token
export const verifyToken = async () => {
  const sdp18_data = JSON.parse(localStorage.getItem("sdp18_data"));
  const token = sdp18_data.token;

  try {
    const response = await axios.post(
      process.env.REACT_APP_GET_ACCESS_TOKEN_URL,
      {
        token: token,
      }
    );

    if (response.data.message === "Authorized") {
      return true; // Token is valid
    } else {
      return false; // Token is not valid
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};
