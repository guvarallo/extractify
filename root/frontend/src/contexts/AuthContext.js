import React, { useContext } from "react";
import { auth } from "../firebase";
import axios from "axios";

const url = "https://us-central1-extractify-development.cloudfunctions.net/api";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  async function signup(user, history) {
    const res = await axios.post(`${url}/signup`, user);
    const FBIdToken = `Bearer ${res.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
    return history.push("/");
  }

  async function login(user, history) {
    const res = await axios.post(`${url}/login`, user);
    const FBIdToken = `Bearer ${res.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
    return history.push("/");
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
    signup,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
