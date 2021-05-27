const  mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/Meet2Code", {useNewUrlParser: true , useUnifiedTopology: true } )

let userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String, unique:true, required:true},
    
})


let User=mongoose.model("users",userSchema)
module.exports=User
