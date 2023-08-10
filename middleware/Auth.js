const {secret}=require('../dbConfig/dbConfig')
const jwt=require('jsonwebtoken')
const db=require('../models/index');
const User=db.users;
module.exports=(req,res,next)=>{
   const token=req.headers["x-access-token"] || req.headers["authorization"];
   if(!token)
   {
    return res.status(403).json({
        success:false,
        message:"No token has been provided"
    })
   }
   try
   {
    const data=jwt.verify(token,secret)
    req.user=data;
    next();

   }catch(ex)
   {
    return res.status(500).json({
        success:false,
        message:'Invalid Token'
    })
   }
}