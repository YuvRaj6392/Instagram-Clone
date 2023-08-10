const validateToken=require('../middleware/Auth');
const Post=require('../controller/post.controller')
module.exports=app=>{
    const router=require('express').Router();
    router.post('/uploadpost',validateToken,Post.uploadpost)
    router.get('/showallposts',validateToken,Post.showallposts)
    router.get('/showFollowingPosts',validateToken,Post.showFollowingPosts)
    router.get('/myposts',validateToken,Post.myposts)
    router.put('/like',validateToken,Post.like)
    router.put('/unlike',validateToken,Post.unlike)
    router.put('/comments',validateToken,Post.comments)
    router.delete('/deletePost/:postId',validateToken,Post.deletePost)
    app.use('/api',router);
}