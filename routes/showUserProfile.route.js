const validateToken=require('../middleware/Auth');
const showUserProfile=require('../controller/showUserProfile.controller')
module.exports=app=>{
    const router=require('express').Router();
    router.get('/showUserProfile/:id',validateToken,showUserProfile.showUserProfile)
    app.use('/api',router);
}