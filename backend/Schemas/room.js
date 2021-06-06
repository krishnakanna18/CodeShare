const  mongoose=require("../dbconnection");

let roomSchema=new mongoose.Schema({
    roomId:{type:String,unique:true,required:true},
    name:{type:String,required:true},
    password:{type:String},
    startTime:{ type: Date, default: Date.now},
    description:{type:String},
    type:{type:String, default:"public"},
    participants:[{type:mongoose.Schema.Types.ObjectId, ref:'users'}],
    host:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
    repo:{type:String, default:""},
    repoContent:{type:Object, default:""}   //Store repository contents
})

let Room=mongoose.model("rooms",roomSchema)
module.exports=Room
