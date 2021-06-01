const express=require("express");
      router=express.Router();
      fetch=require("node-fetch");
      const { v4: uuidv4 } = require('uuid');
      socket=require("socket.io");
      Room=require("../Schemas/room");
      User=require("../Schemas/user")


const { gitConfig , serverEndPoint, clientEndPoint} = require("../config");


//Get room info
router.get('/:id',async(req,res)=>{

    let roomId=req.params.id
    let {user}=req.session
    let room=await Room.findOne({roomId:roomId})

    if(room===null || room===undefined)
        res.status(404).json({"msg":"Room doesn't exist or has ended"});
    else
        res.status(200).json({user:user, room:room})

})

//When participants join through link
router.put('/participant',async(req,res)=>{

    let roomId=req.body.id
    let {socketId}=req.body
    let {user}=req.session
    let room=await Room.findOne({roomId:roomId})

    if(room===null || room===undefined)
        res.status(404).json({"msg":"Room doesn't exist or has ended"});

    else if(room["type"]==="private")
        res.status(403).json({"msg":"Private room. Access restricted"});

    else{
        if(room['participants'].indexOf(user._id)===-1){
            room['participants'].push(user._id)
            await room.save()
        }
        let userdb=await User.findById(user._id)
        userdb['socketId']=socketId
        await userdb.save()
        res.status(200).json({"msg":"Success"})
    }

})

module.exports=router