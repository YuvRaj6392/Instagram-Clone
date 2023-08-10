const db=require('../models/index');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const {secret}=require('../dbConfig/dbConfig')
const User=db.users;

//controller for signup
exports.signup = async (req, res) => {
    try {

      const { name, email, password,pic } = req.body;
      // Validate input data
      // ...
      if (!name || !email || !password)
      {
        return res.status(400).json({
            success: false,
            message: "Fill all the fields!",
          });
      }
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists!",
        });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        name,
        email,
        password: hash,
        isLoggedIn: false,
        pic
      });
      
      return res.status(200).json({
        success: true,
        message: newUser,
      });
    } catch (err) {
      // Handle specific errors
      // ...
  
      return res.status(500).json({
        success: false,
        error: "Internal server error!",
      });
    }
  };


  //controller for singin
  exports.signin=async (req,res)=>
  {
    try
    {
      const {email,password}=req.body;
      if(!email || !password)
      {
        return res.status(400).json({
          success:false,
          message:'Fill all the fields!'
        })
      }
      const user= await User.findOne({email:email});
      if(user===null)
      {
        return res.status(400).json({
          success:false,
          message:'Please use correct credentials!'
        })
      }
      const comparePassword=await  bcrypt.compareSync(password,user.password);
      if(!comparePassword)
      {
        return res.status(400).json({
          success:false,
          message:'Please use correct credentials!'
        })
      }
      const update={isLoggedIn:true};
      await User.findOneAndUpdate({email:email},update,{
        userFindAndModify:true
      })
      const data=user.id;
      const jwtToken=jwt.sign(data,secret);
      let obj={
        _id:user._id,
        name:user.name,
        email:user.email,
        followers:user.followers,
        following:user.following
      }
      res.status(200).json({
        success:true,
        message:jwtToken,
        user:obj
      })

    }catch(ex){
      res.status(500).json({
        success:false,
        message:"Internal server error!"
      })
    }
  }


  //controller for following the user
  //2 things happen follower of one user increases and also following of another user increases
  exports.follow = async (req, res) => {
    try {
      const followedUser = await User.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user },
        },
        { new: true }
      ).select("-password");
  
      const currentUser = await User.findByIdAndUpdate(
        req.user,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      ).select("-password");
  
      return res.status(200).json({
        success: true,
        message: {
          followedUser,
          currentUser,
        },
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error,
      });
    }
  };

//controller to unfollow a particular account
  exports.unFollow = async (req, res) => {
    try {
      const followedUser = await User.findByIdAndUpdate(
        req.body.unFollowId,
        {
          $pull: { followers: req.user },
        },
        { new: true }
      ).select("-password");
  
      const currentUser = await User.findByIdAndUpdate(
        req.user,
        {
          $pull: { following: req.body.unFollowId },
        },
        { new: true }
      ).select("-password");
  
      return res.status(200).json({
        success: true,
        message: {
          followedUser,
          currentUser,
        },
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error,
      });
    }
  };

  //controller to update the profile picture
  exports.updatePic=async (req,res)=>{
    try{
      console.log(req.user)
      const user=await User.findByIdAndUpdate(req.user,{$set:{pic:req.body.pic}},{new:true})
      res.status(200).json({
        success:true,
        message:user
      })
    }catch(ex){
      return res.status(422).json({
        success: false,
        message: ex.message,
      });
    }
    
  }

  //controller to get all the user(for searching purpose!)
  exports.getAllUsers=async(req,res)=>{
    try{
    const search = req.body.search;  
      // Use a regular expression to match names starting with the search term
    const regex = new RegExp('^' + search, 'i'); // 'i' for case-insensitive match

    // Use the 'find' method to retrieve all users whose name starts with the search term
    const users = await User.find({ name: regex, _id: { $ne: req.user } }).select('id name email')

    // Respond with the list of matching users
    return res.status(200).json({
      success: true,
      message: users,
    });

    }catch(ex){
      return res.status(422).json({
        success: false,
        message: ex.message,
      });
    }
  }
  
  