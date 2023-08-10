import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import { useState, createContext, useReducer, useEffect,UseContext, useContext } from "react";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import FollowingPosts from "./components/screens/FollowingPosts";
export const UserContext = createContext();

const Routing = () => {
  const history = useNavigate();
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
  const user=JSON.parse(localStorage.getItem('user'));
  if(user)
  {
    dispatch({
      type:"USER",
      payload:user
    })
    //we are calling dispatch here again because when the application is closed the reducer is destroyed
    history('/')
  }
  else
  {
    history('/signin')
  }
  },[])
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signin" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/create" element={<CreatePost />} />
        <Route exact path="/followingPosts" element={<FollowingPosts />} />
        <Route exact path="/profile/:userId" element={<UserProfile />} />
        <Route />
        <Route />
      </Routes>
    </>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <div>
        <Router>
          <Navbar />
          <Routing />
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
