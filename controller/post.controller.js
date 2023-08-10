const db=require('../models/index');
const Post=db.posts;
const User=db.users;

//api to upload post
exports.uploadpost= async (req,res)=>{
    const user=req.user;
    const {title,body,photo}=req.body;
    if(!title || !body || !photo)
    {
        return res.status(400).json({
            success:false,
            message:'Fill all the fields!'
        })
    }
    try{
        const postData = await Post.create({
            title: title,
            body: body,
            photo: photo,
            postedBy: user,
          });
      
          res.status(200).json({
            success: true,
            message: postData,
          });

    }catch(ex)
    {
        return res.status(500).json({
            success:false,
            message:'Internal server error!'
        })
    }
    
}


//api to show all the post 
exports.showallposts = (req, res) => {
  Post.find()
    .populate('comments.postedBy','_id name email pic')
    .populate('postedBy','_id name email pic')
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: data,
      });
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging purposes
      res.status(400).json({
        success: false,
        message: 'Failed to find the posts!',
      });
    });
};

//api to show post uploaded by a single user
exports.myposts= (req,res)=>{
 Post.find({postedBy:req.user})
 .populate('postedBy','_id name email')
 .then(data=>{
  res.status(200).json({
    success:true,
    message:data
  })
 }).catch(ex=>{
  res.status(500).json({
    success:false,
    message:'Internal server error!'
  })
 })
  
}

//api to like the photo 
exports.like = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.user } },
      { new: true }
    )
    .populate('comments.postedBy','_id name email pic')
    .populate('postedBy', '_id name email pic')
    .exec();

    res.json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(422).json({
      success: false,
      message: err,
    });
  }
};

//api to dislike the photo
exports.unlike = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.user } },
      { new: true }
    )
    .populate('comments.postedBy','_id name email pic')
    .populate('postedBy', '_id name email pic')
    .exec();

    res.json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(422).json({
      success: false,
      message: err,
    });
  }
};

//api to make a comment on the photo
exports.comments = async (req, res) => {
  try {
    const comments={
      text:req.body.text,
      postedBy:req.user
    }
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comments } },
      { new: true }
    )
    .populate('comments.postedBy','_id name email pic')
    .populate('postedBy', '_id name email pic')
    .exec();

    res.json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(422).json({
      success: false,
      message: err,
    });
  }
};

//api to delete a post 
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate('postedBy', '_id').exec();
    console.log(post.postedBy.id)
    console.log(req.user)
    if (!post) {
      return res.status(422).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    if (post.postedBy.id.toString() !== req.user.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    await Post.deleteOne({ _id: post._id });
    
    res.json({
      success: true,
      message: post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


//api to show posts of the people you follow
exports.showFollowingPosts = async(req, res) => {
  try{
    const user=await User.findOne({_id:req.user})
    const following= await user.following;
    console.log(following)
    const posts=await Post.find({ postedBy: { $in: following } })
    .populate('comments.postedBy','_id name email pic')
    .populate('postedBy','_id name email pic')
    .sort({ createdAt: -1 })
    res.json({
      success: true,
      message: posts
    });
  }catch(err){
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

