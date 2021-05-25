const express=require("express");
      app=express();
      bodyParser=require("body-parser");
      cors=require("cors");
      chat=require('./Routers/chat');
      socket=require("socket.io");
      http=require("http");
      oauth=require('./Routers/oauth');
      path=require('path');
      session = require("express-session");

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
    {     
          // res.status(404).json({"log_data":"Not logged in",...res.locals})
          res.status(401).send("Not logged in");
    }
}

//Check if the user is not already logged in
let notLoggedin=(req,res,next)=>{
    // console.log(req.session)
    if(req.session.loggedin==undefined || req.session.loggedin==null)
        next();
    else
        res.status(404).json({log_data:"Already logged in",...res.locals})

}

app.use('/oauth',oauth);


const server=http.createServer(app);
const io=socket(server,{
    cors: {
    cors: true,
      origins: ["http://localhost:3000","192.168.0.13:3000","https://60a2be5a6ea5e300a1a9aca2--elegant-edison-5499d4.netlify.app"],
      methods: ["GET", "POST"]
    }
});

io.on('connection',(socket)=>{

    // socket.on('joinRoom',async(arg)=>{

    //     log('Request to join',arg.room)
    //     let res=await query("select text from room where no='"+arg.room+"';");
    //     if(res.results.length>0)
    //     {
    //         text=res.results[0].text
    //     }
    //     else{
    //         await query("insert into room values('"+arg.room+"','"+text+"');")
    //     }
    //     socket.join(`${arg.room}`)
    //     socket.emit('initialiseEditor',{value:text})
    //     log("Joined",socket.rooms)
    // })

    // socket.on('setEditor',async(arg)=>{
    //     // log("Editing",socket.rooms,arg.room)
    //     socket.to(`${arg.room}`).emit('resetEditor',arg)
    //     await query("update room set text='"+arg.value+"' where no='"+arg.room+"';")
    // })

    // socket.on('shareVideo',async(arg)=>{
    //     socket.to(`${arg.room}`).emit('setVideo',arg.video)
    // })


    // socket.on('disconnect', () => {
    //   });

    // socket.on('closeConnection',arg=>{
    //     socket.leave(`${arg.room}`)
    // })

})




server.listen(process.env.PORT || 9000,'0.0.0.0',(err)=>{
    if(err) console.log(err);
    console.log("Server Started")
})
