const express=require("express");
      app=express();
      bodyParser=require("body-parser");
      cors=require("cors");
      chat=require('./Routers/chat');
      socket=require("socket.io");
      http=require("http");
      oauth=require('./Routers/oauth');
      git=require('./Routers/gitfiles')
      room=require('./Routers/room');
      path=require('path');
      session = require("express-session");
      mongoose = require("./dbconnection");
      Room=require('./Schemas/room');
      User=require('./Schemas/user');


const { v4: uuid } = require('uuid');

app.use(cors({credentials:true, origin:["http://localhost:3000","http://192.168.0.13:3000","https://60a2be5a6ea5e300a1a9aca2--elegant-edison-5499d4.netlify.app"]}));
app.options('*', cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '50mb'}));                  //limit enables to parse requests of size less than or equal to 50mb...Anything bigger the request will not be processed

//Routing Static Files
app.use(express.static(path.join(__dirname,'/public')));

// mongoose.connect("mongodb://localhost:27017/meet2code", {useNewUrlParser: true , useUnifiedTopology: true } );

app.use(session({
      resave:true,
      secret:"Failures are the stepping stones of success",
      saveUninitialized:true,
      name:"meet2codeCookie",
      cookie : {
            maxAge: 1000* 60 * 60 *24 * 365,
            secure:false,
        }

}))

//Routes for testing chat

//Store the user details in each of the request for the logged in user ---FINAL
let loggedinUserDetails=(req,res,next)=>{
    let loggedin=0;
    let user={};
    if(req.session.loggedin==true){
        loggedin=1;
        user=req.session.user;
    }
    res.locals={user:user,loggedin:loggedin};
    next();
}
app.use(loggedinUserDetails);


//Check if the user is logged in
let isLoggedin=(req,res,next)=>{
    if(req.session.loggedin)
        next();
    else
        return res.status(401).json({"msg":"You're not Logged in."});       //Unauthorized must be logged in first
}

//Check if the user is not already logged in
let notLoggedin=(req,res,next)=>{
    // console.log(req.session)
    if(req.session.loggedin==undefined || req.session.loggedin==null)
        next();
    else
        res.status(404).json({log_data:"Already logged in",...res.locals})

}


const server=http.createServer(app);
const io=socket(server,{
    cors: {
    cors: true,
      origins: ["http://localhost:3000","192.168.0.13:3000","https://60a2be5a6ea5e300a1a9aca2--elegant-edison-5499d4.netlify.app"],
      methods: ["GET", "POST"]
    }
});


const getClients=()=>{
    
}

io.on('connection',(socket)=>{

    //Creating a room by the host
    socket.on('createRoom',async(arg,redirect)=>{
        let roomId=uuid();
        socket.join(`${roomId}`);
        try{
            //Get the details of user who emitted the event
            let user=await User.findById(arg.host)
            if(user===undefined || user===null){
                return
            }

            if(user['room']!==undefined && user['room']!==null){       //Check if user is already in a room
                let room=await Room.findById(user['room'])
                redirect(room.roomId,401)
                return
            }
            //Create room with the arguments sent along with the newly created roomId
            let room=new Room({
                ...arg,
                roomId:roomId,
            })
            room=await room.save()

            //Update the user info with the new socket id and the room id
            user['room']=room._id
            user['socketId']=socket.id
            await user.save()

            redirect(roomId,200);   //Created Successfully redirect with 200
        }
        catch(e){
            console.log(e)
            redirect(undefined,404)
        }
    })

    //Join an existing room
    socket.on('joinRoom',async(arg,redirect)=>{
        try{
            let room=await Room.findOne({roomId: arg.id}) //Get the room details
            if(room===undefined || room===null){    //Room doesn't exist
                redirect(undefined,404)
                return
            }
            //Get the details of user who emitted the event
            let user=await User.findById(arg.participant)
            if(user===null || user===undefined)
            {
                redirect(undefined,401)
                return
            }
            if(user['room']!==undefined && user['room']!==null ){       //Check if user is already in a room and not in the given room
                if(!user['room'].equals(room._id)){                     //Check if the user connected to a room is not equal to the input room
                    redirect(room.roomId,401)
                    return
                }
            }
            if(room['type']==="private" && room['password']!==arg.password){        //If private and password is not correct
                redirect(undefined, 403);    
                return;           
            }
            if(user['room']!=room._id){                         //If the user doesn't already exist
                if(room['participants'].indexOf(user._id)===-1)
                    room['participants'].push(user._id);
                user['room']=room._id
                user['socketId']=socket.id
            }
            //Update user and room details and call client redirect function
            await room.save();          
            await user.save();  
            //Let other sockets in the room updated their db
            socket.broadcast.to(`${arg.id}`).emit('newUserJoined',{
                updatedRoom: room
            })
            redirect(room.roomId,200); 
        }
        catch(e){
            console.log(e)
            redirect(undefined,404)
        }
    })

    //Set the room's repository
    socket.on('setRepository',async(arg)=>{
        try{
            let {roomId, repo}=arg
            socket.broadcast.to(`${roomId}`).emit('getRepository',{
                repo:repo
            })
        }
        catch(e){
            console.log(e)
        }
    })

    //Leave room
    socket.on('leaveRoom',async(arg,redirect)=>{
        try{
            //Get the details of user who emitted the event
            let user=await User.findById(arg.host);
            let room=await Room.findById(user['room'])
            if(room!==undefined && room!==null){
                //Delete the room if the host has ended the meeting
                if(room['host']===mongoose.Types.ObjectId(arg.host)){
                    //Emit an end room event to all participants of the room 
                    // socket.to(room['roomId']).emit('endRoom')    
                    await Room.findByIdAndDelete(room._id)
                }
                //Remove the participant from the room
                else{
                    room['participants'].splice(room['participants'].indexOf(user._id),1);
                    await room.save();
                }
                //Remove the room from the user
                user['room']=undefined
                await user.save()
                redirect("Success",200)
            }
        }
        catch(e){
            console.log(e)
            redirect(undefined,404)
        }
    })

    socket.on('test',arg=>{
        console.log(socket.rooms)
    })
    
    socket.on('closeConnection',arg=>{
        socket.leave(`${arg.room}`)
    })

    socket.on('disconnect',arg=>{
        // console.log("Socket Disconnected", socket.id)
    })

})

app.set('socketio',io)
app.use('/oauth',oauth);
app.use('/room', isLoggedin,room);
app.use('/git',isLoggedin, git);

server.listen(process.env.PORT || 9000,'0.0.0.0',(err)=>{
    if(err) console.log(err);
    console.log("Server Started")
})
