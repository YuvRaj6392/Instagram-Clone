import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../App'
import "../App.css";
export default function Navbar() {
const history=useNavigate()
const {state,dispatch}=useContext(UserContext)
const [users,setUsers]=useState("")
//state has the details of the user!
const searchUser=(search)=>{
  if(search){
    fetch('http://localhost:8080/api/getAllUsers',{
    method:'post',
    headers:{
      'Content-Type':'application/json',
      'x-access-token':localStorage.getItem('token')
    },
    body:JSON.stringify({
      search:search
    })
  }
 ).then(res=>res.json()).then(data=>{
  setUsers(data.message)
 }).catch(err=>{
  console.log(err)
 })
  }
}
useEffect(() => {
  // Add event listener to handle clicks on the entire document
  document.addEventListener('click', handleClick);

  // Clean up the event listener when the component unmounts
  return () => {
    document.removeEventListener('click', handleClick);
  };
}, []);

const handleClick = () => {
  // When clicked anywhere on the screen, set users to null
  setUsers(null);
};
const renderList = () => {
  if (state) {
    return [
      <li id='search'>
        <input
          placeholder='search'
          onInput={(e) => {
            searchUser(e.target.value);
          }}
        />
        {users && users.length > 0 && (
          <div className="search-results">
            {users.map((ele) => (
              <div
                style={{
                  backgroundColor: 'grey',
                  color: 'white',
                  padding: '10px',
                  marginTop: '5px', 
                 // Added margin to separate each result
                }}
                key={ele._id}
              >
                <Link to={"/profile/" + ele._id}>
                  <span style={{ color: 'white' }}>{ele.name}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </li>,
      <li><Link to="/profile">Profile</Link></li>,
      <li><Link to="/create">Post</Link></li>,
      <li><Link to="/followingPosts">Following Posts</Link></li>,
      <li>
        <button
          className="btn waves-effect waves-light #64b5f6 red darken-2"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history('/signin');
          }}
        >
          Logout
        </button>
      </li>
    ];
  } else {
    return [
      <li><Link to="/signin">Login</Link></li>,
      <li><Link to="/signup">Signup</Link></li>,
    ];
  }
};


  return (
    <div style={{marginBottom:'100px'}}>
    
    <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 1 }}>
   
    <div className="nav-wrapper white">
    <Link to={state?"/":"/signin"} className="brand-logo left mb-1" id="instaLogoBig"  onClick={() => window.scrollTo(0, 0)}>Yuvhub</Link>
    <Link to={state?"/":"/signin"} className="brand-logo left mb-1" id="instaLogoSmall"  onClick={() => window.scrollTo(0, 0)}>yH</Link>
      <ul id="nav-mobile" className="right">
       {renderList()}
      </ul>
    </div>
  </nav>
    </div>
  )
}
