import React, { useState,useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css';
import { UserContext } from "../../App";
export default function Login() {
  const {state,dispatch}=useContext(UserContext)
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const history = useNavigate();
  const signinFormSubmit= async(e)=>{
    e.preventDefault();
    if(!email || !password ){
      M.toast({html: 'Please fill all the fields!',classes:'red'})
    }
    else if (!emailRegex.test(email)) {
      M.toast({ html: 'Invalid email format!', classes: 'red' });
    }
    else
    {
     let obj={
      email:email,
      password:password
     }
     const response=await  fetch('http://localhost:8080/api/signin',{
      
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(obj)
     })
     const json=await response.json();
     if(json.success)
     {
      setEmail("")
      setPassword("");
      M.toast({html: "Successfully SignedIn",classes:'green'})
      localStorage.setItem('token',json.message)
      //we cannot save objects to local storage therefore we are using JSON.stringify
      localStorage.setItem('user',JSON.stringify(json.user))
      dispatch({
        type:"USER",payload:json.user
      })
      history('/')
     }
     else
     {
      setPassword("");
      M.toast({html: json.message,classes:'red'})
     }
    }
  }
  return (
    <>
    <form onSubmit={signinFormSubmit}>
    <div className="myCard">
      <div className="card auth-card">
        <h2>Yuvhub</h2>
        <input type="text" placeholder="E-mail" value={email} onChange={e=>{
        setEmail(e.target.value)
      }} />
      <input type="password" placeholder="Password" value={password} onChange={e=>{
        setPassword(e.target.value)
      }} />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-2"
          
        >
          Login
         
        </button>
        <h6>
          <Link to='/Signup'>Don't have an account?</Link>
        </h6>
      </div>
    </div>
    </form>
    </>
  );
}
