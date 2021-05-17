const express=require("express");
      router=express.Router()

router.get('/',(req,res)=>{
    res.send("App working")
})

module.exports=router