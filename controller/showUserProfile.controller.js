const db=require('../models/index');
const Post=db.posts;
const User=db.users;

//api to show the profile of the loggedIn user
exports.showUserProfile=async (req,res)=>{
    try{
        const user= await User.findOne({_id:req.params.id}).select('-password');
        if(!user)
        {
            return res.status(404).json({
                success:false,
                message:'Cannot find the user'
            })
        }

        const posts=await Post.find({postedBy:req.params.id}).populate('postedBy', '_id name email').exec();
        return res.json({
            
            user,posts
        })

    }catch(ex)
    {
        return res.status(500).json({
            success:false,
            message:'Internal server error!'
        })
    }
    
}