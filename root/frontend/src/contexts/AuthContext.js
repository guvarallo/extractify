import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";

const url = "https://us-central1-extractify-development.cloudfunctions.net/api";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  async function getUser() {
    const res = await axios.get(`${url}/user`);
    setCurrentUser(res);
  }

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  async function login(user, history) {
    const res = await axios.post(`${url}/login`, user);
    const FBIdToken = `Bearer ${res.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
    getUser().then(() => history.push("/"));
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

  // Clears token on closing/refreshing browser
  window.addEventListener(
    "beforeunload",
    function () {
      localStorage.clear();
    },
    false
  );

  useEffect(() => {
    setLoading(false);
  }, []);

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
