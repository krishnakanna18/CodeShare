const express=require("express");
      router=express.Router();
      fetch=require("node-fetch");
      mongoose=require("mongoose");

const { gitConfig , serverEndPoint, clientEndPoint} = require("../config");


router.get('/isloggedin',(req,res)=>{
    
    if(req.session.loggedin===true){
        res.status(200).json({user:req.session.user, loggedin:true})
    }
    else 
        res.status(401).json({user:{},loggedin:false})
})

router.post('/logout',(req,res)=>{
    req.session.destroy();
    return res.json({message:"Logged out Successfully"})
})

router.get('/git',(req,res)=>{

    if(req.session.loggedin===true){        //If user is already loggedin redirect to loginPage
        return res.redirect(`${clientEndPoint}`)
    }
    return  res.redirect('https://github.com/login/oauth/authorize?client_id='+gitConfig.clientId+'&redirect_uri='+serverEndPoint+'/oauth/gitCallBack/getToken');
})


router.get('/gitCallBack/getToken',async(req,res)=>{
    let {code}=req.query
    try{
        let resp=await fetch('https://github.com/login/oauth/access_token?code='+code+'&client_id='+gitConfig.clientId+'&client_secret='+gitConfig.clientSecret,{
            method:"post",
            headers:{'Accept':'application/json'},
      })
        resp=await resp.json()
        req.session.access_token=resp.access_token
      
        //Request to get the authenticated user info
        resp=await fetch('https://api.github.com/user',{
            method:"get",
            headers:{'Authorization':'token '+resp.access_token}
        })
        resp=await resp.json()

        //Loggin the user in by creating session
        req.session.loggedin=true
        req.session.user={login:resp.login, imageUrl:resp.avatar_url, url:resp.url}
    }
    catch(e){
        req.session.loggedin=false
        req.session.user={}
        console.log(e)
    }
    return res.redirect(`${clientEndPoint}`)
})


router.get('/gitCallBack',(req,res)=>{
    let {code}=req.query
    if(code===undefined){
        return res.redirect(`${clientEndPoint}`)
    }
})

router.post('/google',(req,res)=>{
    req.session.loggedin=true
    req.session.user=req.body.user
    req.session.access_token=req.body.access_token
    res.status(200).json({"message":"Success"})
})
module.exports=router