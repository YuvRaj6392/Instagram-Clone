const User=require('../controller/user.controller');
const validateToken=require('../middleware/Auth')
module.exports=app=>{
    const router=require('express').Router();
    router.post('/signup',User.signup);
    router.post('/signin',User.signin);
    router.put('/follow',validateToken,User.follow);
    router.put('/unfollow',validateToken,User.unFollow);
    router.put('/updatePic',validateToken,User.updatePic)
    router.post('/getAllUsers',validateToken,User.getAllUsers)
    app.use('/api',router);
}