import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "./Context";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SecondFactorPage from "./pages/SecondFactorPage";
import NameAndProfilePicPage from "./pages/NameAndProfilePicPage";
import TeamRegisterPage from "./pages/TeamRegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import HomeTriviaGames from "./pages/Game Management/HomeTriviaGames";
import AddTriviaGame from "./pages/Game Management/AddTriviaGame";
import EditTriviaGame from "./pages/Game Management/EditTriviaGame";
import HomeTriviaQuestion from "./pages/Question Management/HomeTriviaQuestions";
import AddTriviaQuestion from "./pages/Question Management/AddTriviaQuestion";
import EditTriviaQuestion from "./pages/Question Management/EditTriviaQuestion";
import AdminAnalytics from "./pages/AdminAnalytics";
import InvitationPage from "./pages/InvitationPage";
import TeamManagementPage from "./pages/TeamManagementPage";
import UserScorePage from "./pages/UserScorePage";
import TeamScorePage from "./pages/TeamScorePage";
import AdminSignInPage from "./pages/AdminSignInPage";
import InGame from "./components/Ingame/InGame";
import QuizHome from "./pages/QuizHome";
import Navbar from "./components/Navigation/Navbar";
import Notifications from "./pages/Notifications";
import RequireAuth from "./components/auth/RequireAuth";
import RequireAuthAdmin from "./components/auth/RequireAuthAdmin";
import LexChatbot from "./pages/LexChatbot";

function App() {
  const [shareState, setShareState] = useState({});
  return (
    <BrowserRouter>
      <Context.Provider value={{ shareState, setShareState }}>
        <Routes>
          <Route index element={<SignInPage />} />
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin-login" element={<AdminSignInPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/secondfactor" element={<SecondFactorPage />} />
          <Route path="/invite/:inviteId" element={<InvitationPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <NameAndProfilePicPage />
              </RequireAuth>
            }
          />
          <Route
            path="/team-register"
            element={
              <RequireAuth>
                <TeamRegisterPage />
              </RequireAuth>
            }
          />
          <Route
            path="/team-manage"
            element={
              <RequireAuth>
                <TeamManagementPage />
              </RequireAuth>
            }
          />
          <Route
            path="/user-score"
            element={
              <RequireAuth>
                <UserScorePage />
              </RequireAuth>
            }
          />
          <Route
            path="/team-score"
            element={
              <RequireAuth>
                <TeamScorePage />
              </RequireAuth>
            }
          />
          <Route
            path="/triviagamemanagement"
            element={
              <RequireAuthAdmin>
                <HomeTriviaGames />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/triviagamemanagement/addtriviagame"
            element={
              <RequireAuthAdmin>
                <AddTriviaGame />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/triviagamemanagement/edittriviagame"
            element={
              <RequireAuthAdmin>
                <EditTriviaGame />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/triviaquestionmanagement"
            element={
              <RequireAuthAdmin>
                <HomeTriviaQuestion />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/triviaquestionmanagement/addtriviaquestion"
            element={
              <RequireAuthAdmin>
                <AddTriviaQuestion />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/triviaquestionmanagement/edittriviaquestion"
            element={
              <RequireAuthAdmin>
                <EditTriviaQuestion />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireAuthAdmin>
                <AdminAnalytics />
              </RequireAuthAdmin>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Navbar />
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/chatbot"
            element={
              <RequireAuth>
                <Navbar />
                <LexChatbot />
              </RequireAuth>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <RequireAuth>
                <Navbar />
                <LeaderboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Navbar />
                <QuizHome />
              </RequireAuth>
            }
          />
          <Route
            path="/game"
            element={
              <RequireAuth>
                <Navbar />
                <InGame />
              </RequireAuth>
            }
          />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
