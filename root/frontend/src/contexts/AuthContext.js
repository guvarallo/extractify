import React, { useContext, useState, useEffect } from "react";
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

  // function getUser

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(user) {
    axios.post(`${url}/login`, user).then(res => {
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
    });
  }

  function logout() {
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authorization"];
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      console.log(user);
      setCurrentUser(user);
      setLoading(false);
    });
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
