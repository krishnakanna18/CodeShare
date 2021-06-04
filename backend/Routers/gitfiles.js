const express=require("express");
      router=express.Router();
      fetch=require("node-fetch");
      mongoose=require("mongoose");
      User=require("../Schemas/user");

//Router to get additional permission for repository operations
router.get('/oauth/repos',async(req,res)=>{
    let roomId=req.query.roomId;
    req.session.roomId=roomId;
    return  res.redirect('https://github.com/login/oauth/authorize?client_id='+gitConfig.clientId+'&scope=public_repo&redirect_uri='+serverEndPoint+'/oauth/gitCallBack/getRepos');
})

//Router to get repo info
router.get('/repos',async(req,res)=>{
    

})
const { gitConfig , serverEndPoint, clientEndPoint} = require("../config");
module.exports=router
