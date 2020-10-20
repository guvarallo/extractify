import React, { useContext, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";

const url = "https://us-central1-extractify-development.cloudfunctions.net/api";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  async function login(user) {
    setLoading(true);
    const data = await axios.post(`${url}/login`, user);
    setCurrentUser(data.data.user);
    localStorage.setItem(
      "FBIdToken",
      `Bearer ${data.data.user.stsTokenManager.accessToken}`
    );
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authorization"];
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
