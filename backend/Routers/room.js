const express=require("express");
      router=express.Router();
      fetch=require("node-fetch");
      const { v4: uuidv4 } = require('uuid');
      socket=require("socket.io");


const { gitConfig , serverEndPoint, clientEndPoint} = require("../config");

router.post('/',async(req,res)=>{

    let io=req.app.get('socketio')
    let roomId=uuidv4()
    console.log(roomId)

    io.on('connection',(socket)=>{
        
    })
    res.json({"message":"Working"})
})

module.exports=router