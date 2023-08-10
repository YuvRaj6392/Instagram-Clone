import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
export default function UserProfile() {
    const [userName,setUserName]=useState(null);
    const [posts,setPosts]=useState([]);
    const [followers,setFollowers]=useState([]);
    const [following,setFollowing]=useState([]);
    const [showFollow,setShowFollow]=useState(true);
    const {state,dispatch}=useContext(UserContext);
    const [pic,setPic]=useState("");
    const followingOtherUser=JSON.parse(localStorage.getItem('user'));
    const followingOtherUser1=followingOtherUser.following;
    const {userId}=useParams();
    useEffect(()=>{
     fetch(`http://localhost:8080/api/showUserProfile/${userId}`,{
      method:'get',
      
      headers:{
        'Content-Type':'application/json',
        'x-access-token':localStorage.getItem('token')
      }
     }).then(res=>res.json()).then(
      result=>{
        
        setUserName(result.user.name);
        setPosts(result.posts)
        setFollowers(result.user.followers)
        setFollowing(result.user.following)
        setPic(result.user.pic)
      }  
      )
     
    },[userId])

    const followUser=()=>{
      fetch('http://localhost:8080/api/follow',{
        method:'put',
        
        headers:{
          "Content-Type":"application/json",
          "x-access-token":localStorage.getItem('token')
        },
        body:JSON.stringify({
          followId:userId
        })
      }).then(res=>res.json()).then(result=>{
        dispatch({type:"UPDATE",payload:{following:result.message.followedUser.following,followers:result.message.followedUser.followers}})
        localStorage.setItem('user',JSON.stringify(result.message.currentUser))
        setFollowers(result.message.followedUser.followers)
        setFollowing(result.message.followedUser.following)
        
        setShowFollow(false)
      })
    }


    const unFollowUser=()=>{
      fetch('http://localhost:8080/api/unfollow',{
        method:'put',
        
        headers:{
          "Content-Type":"application/json",
          "x-access-token":localStorage.getItem('token')
        },
        body:JSON.stringify({
          unFollowId:userId
        })
      }).then(res=>res.json()).then(result=>{
        dispatch({type:"UPDATE",payload:{following:result.message.followedUser.following,followers:result.message.followedUser.followers}})
        localStorage.setItem('user',JSON.stringify(result.message.currentUser))
        setFollowers(result.message.followedUser.followers)
        setFollowing(result.message.followedUser.following)
        
        setShowFollow(true)
      })
    }
  return (
    <div style={{maxWidth:'80%',margin:'0px auto'}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={pic?pic:"Loading"}
            alt="profilePic"
          />
        </div>
        <div>
          <h3>{userName?userName:"Loading"}</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h5>{posts.length?posts.length:"0"} posts</h5>
            <h5>{followers.length} followers</h5>
            <h5>{following.length} following</h5>
          </div>
          {followingOtherUser1.includes(userId)?
            <button className="btn waves-effect waves-light #64b5f6 blue darken-2 ms-2" style={{margin:"10px"}} id="UnfollowBtn" onClick={()=>{
            unFollowUser()
          }}>unfollow</button>
           : <button className="btn waves-effect waves-light #64b5f6 blue darken-2" style={{margin:"10px"}} id="followBtn" onClick={()=>{
            followUser()
          }}>Follow</button> 
          }
        </div>
      </div>
      <div className="gallery">
  {posts.length > 0 ? (
    posts.map(item => (
      <img key={item._id} className="item" src={item.photo} alt={item.title} />
    ))
  ) : (
    <p>No post available.</p>
  )}
</div>

    </div>
  );
}

