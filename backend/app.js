const express=require("express");
      app=express();
      bodyParser=require("body-parser");
      fetch=require("node-fetch");
      cors=require("cors");
      chat=require('./Routers/chat');
      socket=require("socket.io");
      http=require("http");
      mysql=require("mysql");

      const log = console.log
      
const db=mysql.createConnection({
host:"localhost",
user : 'krishna',
password : '0mysqldb@Krishna',
database: 'codeshare'
})

let query=(exp,values)=>{
return new Promise((resolve,reject)=>{
    db.query(exp,values,(err,results,fields)=>{
        if(err)
            reject(err);
        else
            {    
                resolve({results:results,fields:fields});
    }
    })
})
}


app.use(cors({credentials:true, origin:["http://localhost:3000","http://192.168.0.13:3000"]}));
app.options('*', cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '50mb'}));                  //limit enables to parse requests of size less than or equal to 50mb...Anything bigger the request will not be processed

//Routes for testing chat
app.use(chat);
const server=http.createServer(app);
const io=socket(server,{
    cors: {
    cors: true,
      origins: ["http://localhost:3000","192.168.0.13:3000"],
      methods: ["GET", "POST"]
    }
});


io.on('connection',(socket)=>{

    socket.on('joinRoom',async(arg)=>{

        log('Request to join',arg.room)
        let text=""
        let res=await query("select text from room where no='"+arg.room+"';");
        if(res.results.length>0)
        {
            text=res.results[0].text
        }
        else{
            await query("insert into room values('"+arg.room+"','"+text+"');")
        }
        socket.join(`${arg.room}`)
        socket.emit('initialiseEditor',{value:text})
        log("Joined",socket.rooms)
    })

    socket.on('setEditor',async(arg)=>{
        // log("Editing",socket.rooms,arg.room)
        await query("update room set text='"+arg.value+"' where no='"+arg.room+"';")
        socket.to(`${arg.room}`).emit('resetEditor',arg)
    })

    socket.on('disconnect', () => {
      });

    socket.on('closeConnection',arg=>{
        socket.leave(`${arg.room}`)
    })
})

server.listen(9000,'0.0.0.0',(err)=>{
    if(err) console.log(err);
    console.log("Server Started")
})
