import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

export default function Profile() {
  const [userName,setUserName]=useState(null);
  const [posts,setPosts]=useState([]);
  const [followers,setFollowers]=useState([]);
  const [following,setFollowing]=useState([]);
  const {state,dispatch}=useContext(UserContext);
  const [image,setImage]=useState("");
  const [url,setUrl]=useState("");
  const [pic,setPic]=useState("");
  const userId=JSON.parse(localStorage.getItem('user'));
    const userId1=userId._id;
  useEffect(()=>{
   fetch(`http://localhost:8080/api/showUserProfile/${userId1}`,{
    
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
   
  },[])

  useEffect(()=>{
if(image){
  
  //used cloudinary to upload the image
      //Go through README to understand this
      const data=new FormData();
      data.append("file",image);
      data.append("upload_preset","");
      data.append("cloud_name","")
      fetch('https://api.cloudinary.com/v1_1/',{
        
        method:'post',
        body:data
      }
     ).then(res=>res.json()).then(data=>{
     
      //calling api to update the pic in the database
      fetch('http://localhost:8080/api/updatePic',{
        
        method:'put',
        headers:{
          "Content-Type":"application/json",
          "x-access-token":localStorage.getItem('token')
        },
        body:JSON.stringify({
          pic:data.url
        })
      }).then(res=>res.json()).then(result=>{
        localStorage.setItem('user',JSON.stringify({...state,pic:result.message.pic}))
        dispatch({type:"UPDATEPIC",payload:result.message.pic})
        setPic(data.url)
      })

      
     }).catch(err=>{
      console.log(err)
     })
}
  },[image])

  const updatePhoto=(file)=>{
    setImage(file)
    
  }
return (
  <div style={{maxWidth:'80%',margin:'0px auto'}}>
  <div style={{
        
        margin: "18px 0px",
        borderBottom: "1px solid grey",
      }}>
    <div style={{
        display: "flex",
        justifyContent: "space-around",
        
      }}>
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
      </div>
    
    </div>
    <div className="file-field input-field ">
          <div className="btn waves-effect waves-light #64b5f6 blue darken-2">
            <span>Update Profile Picture</span>
            <input type="file" onChange={(e=>{
              updatePhoto(e.target.files[0])
            })} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
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
