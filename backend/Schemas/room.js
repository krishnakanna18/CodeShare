const  mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/Meet2Code", {useNewUrlParser: true , useUnifiedTopology: true } )

let roomSchema=new mongoose.Schema({
    roomId:{type:String,unique:true,required:true},
    name:{type:String,required:true},
    password:{type:String, required:true},
    startTime:{ type: Date, default: Date.now},
    description:{type:String},
    type:{type:String, default:"public"}
})


let Room=mongoose.model("rooms",roomSchema)
module.exports=Room
