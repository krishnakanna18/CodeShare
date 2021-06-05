const  mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/Meet2Code", {useNewUrlParser: true , useUnifiedTopology: true } )
module.exports=mongoose