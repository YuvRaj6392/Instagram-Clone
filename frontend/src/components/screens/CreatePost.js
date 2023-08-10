import React, { useEffect, useState } from "react";
import M from 'materialize-css'
export default function CreatePost() {
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [image,setImage]=useState("")
  const [url,setUrl]=useState("");
  const finalPostForm= async()=>{
    let obj={
      title:title,
      body:body,
      photo:url
    }
  
    const response=await  fetch('http://localhost:8080/api/uploadpost',{
      method:'post',
      
      headers:{
        'Content-Type':'application/json',
        'x-access-token':localStorage.getItem("token")
      },
      body:JSON.stringify(obj)
     })
     const json=await response.json();
     if(json.success)
     {
      setTitle("");
      setBody("");
      setImage("");
      setUrl("");
      setImage("")
      M.toast({html: 'Post uploaded successfully!',classes:'green'})
     }
     else
     {
      setUrl("");
      M.toast({html: "Failed! Make sure you are loggedIn",classes:'red'})
     }

  }
  useEffect(() => {
    if (url !== "") {
      finalPostForm();
    }
  }, [url]);
  const createPostForm=(e)=>{
    e.preventDefault()
    if(!title || !body || !image)
    {
      M.toast({html: 'Please fill all the fields!',classes:'red'})
    }
    else
    {
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
      setUrl(data.url)
     }).catch(err=>{
      console.log(err)
     })
    }
    
  }
  return (
    <>
    <form onSubmit={createPostForm}>
      <div className="card input-filed" 
      style={{margin:'30px auto',maxwidth:'500px',padding:'20px',textAlign:'center'}}>
        <input type="text" placeholder="title" value={title} onChange={e=>{
          setTitle(e.target.value)
        }} />
        <input type="text" placeholder="body" value={body} onChange={e=>{
          setBody(e.target.value)
        }} />
        <div className="file-field input-field ">
          <div className="btn waves-effect waves-light #64b5f6 blue darken-2">
            <span>Upload Post</span>
            <input type="file" onChange={(e=>{
              setImage(e.target.files[0])
            })} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-2"
          
        >
          Submit Post
         
        </button>
      </div>
      </form>
    </>
  );
}
