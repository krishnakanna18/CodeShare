const  mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/Meet2Code", {useNewUrlParser: true , useUnifiedTopology: true } )

let userSchema=new mongoose.Schema({
    login:{type:String, required:true},
    socketId:{type:String, default:""},
    room:{type:mongoose.Schema.Types.ObjectId, ref:'rooms'},
    oauth:{type:String}
})

let User=mongoose.model("users",userSchema)
module.exports=User
