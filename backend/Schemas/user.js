const  mongoose=require("../dbconnection");

let userSchema=new mongoose.Schema({
    login:{type:String, required:true},
    socketId:{type:String, default:""},
    room:{type:mongoose.Schema.Types.ObjectId, ref:'rooms'},
    imageUrl:{type:String,default:""},
    oauth:{type:String}
})

let User=mongoose.model("users",userSchema)
module.exports=User
