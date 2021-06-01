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
// router.put('/participant',async(req,res)=>{

//     let roomId=req.body.id
//     let {socketId}=req.body
//     let {user}=req.session
//     try{
//         let room=await Room.findOne({roomId: roomId}) //Get the room details
//         if(room===undefined || room===null){    //Room doesn't exist
//             res.status(404).json({"msg":"Room doesn't exist or has ended"});
//         }
//         //Get the details of user who emitted the event
//         let user=await User.findById(user._id)
//         if(user['room']!==undefined && user['room']!==null && user['room']!==room._id){       //Check if user is already in a room and not in the given room
//             redirect(room.roomId,401)
//             return
//         }
//         if(room['type']==="private" && room['password']!==arg.password){        //If private and password is not correct
//             redirect(undefined, 403);    
//             return;           
//         }
//         if(user['room']!=room._id){                         //If the user doesn't already exist
//             room['participants'].push(user._id);
//             user['room']=room._id
//             user['socketId']=socket.id
//             console.log("adding a new user")
//         }
//         //Update user and room details and call client redirect function
//         await room.save();          
//         await user.save();  

//     if(room===null || room===undefined)
//         res.status(404).json({"msg":"Room doesn't exist or has ended"});

//     else if(room["type"]==="private")
//         res.status(403).json({"msg":"Private room. Access restricted"});

//     else{
//         if(room['participants'].indexOf(user._id)===-1){
//             room['participants'].push(user._id)
//             await room.save()
//         }
//         let userdb=await User.findById(user._id)
//         userdb['socketId']=socketId
//         await userdb.save()
//         res.status(200).json({"msg":"Success"})
//     }

// })

module.exports=router