import "./App.css";
import { Routes, Route } from "react-router-dom";
import React, { useContext } from "react";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import { getTokenFromCookie } from "./cookieUtils";
import ForgotPassword from "./ForgotPassword";
import { useAuth } from "./context/AuthContext";
import { ChatContextProvider } from "./context/chatContext";
import Random from "./helpers/Random";
function App() {
  const { token, userData, loading } = useAuth();
  return (
    <div className="App">
      <ChatContextProvider user={userData}>
        <Routes>
          <Route
            path="/"
            element={getTokenFromCookie() ? <Home /> : <Login />}
          />
          <Route
            path="/signup"
            element={getTokenFromCookie() ? <Home /> : <Signup />}
          />
          <Route
            path="/login"
            element={getTokenFromCookie() ? <Home /> : <Login />}
          />
          <Route
            path="/forgotpassword"
            element={getTokenFromCookie() ? <Home /> : <ForgotPassword />}
          />
          <Route
            path="/random"
            element={<Random/>}
          />
        </Routes>
      </ChatContextProvider>
    </div>
  );
}

export default App;
