const  mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/Meet2Code", {useNewUrlParser: true , useUnifiedTopology: true } )

let roomSchema=new mongoose.Schema({
    roomId:{type:String,unique:true,required:true},
    name:{type:String,required:true},
    password:{type:String},
    startTime:{ type: Date, default: Date.now},
    description:{type:String},
    type:{type:String, default:"public"},
    participants:[{type:mongoose.Schema.Types.ObjectId, ref:'users'}],
    host:{type:mongoose.Schema.Types.ObjectId, ref:'users'}
})


let Room=mongoose.model("rooms",roomSchema)
module.exports=Room
