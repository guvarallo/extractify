import React, { useContext } from "react";
import { auth } from "../firebase";
import axios from "axios";

const url = "https://us-central1-extractify-development.cloudfunctions.net/api";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // const [currentUser, setCurrentUser] = useState();
  // const [loading, setLoading] = useState(true);
  // const [authed, setAuthed] = useState(false);

  // function getAuth() {
  //   return setAuthed(localStorage.getItem("FBIdToken") ? true : false);
  // }
  // async function getUser() {
  //   const res = await axios.get(`${url}/user`);
  //   setCurrentUser({
  //     user: res.data.credentials.user,
  //     id: res.data.credentials.userId,
  //     email: res.data.credentials.email,
  //   });
  // }

  async function signup(user, history) {
    const res = await axios.post(`${url}/signup`, user);
    // setCurrentUser(res.data);
    const FBIdToken = `Bearer ${res.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
    history.push("/");
    // getAuth().then(() => history.push("/"));
    // getUser().then(() => history.push("/"));
  }

  async function login(user, history) {
    const res = await axios.post(`${url}/login`, user);
    // setCurrentUser(res.data);
    const FBIdToken = `Bearer ${res.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
    history.push("/");
    // getAuth().then(() => history.push("/"));
    // getUser().then(() => history.push("/"));
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
