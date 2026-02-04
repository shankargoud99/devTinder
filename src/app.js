const express=require("express");

const app=express();




app.use("/user",[(req,res,next)=>{
    console.log("hello from one");
    // res.send("respponse 1");
    next();
},(req,res,next)=>{
    console.log("helo from 2");
    // res.send("response 2");
    next();
},(req,res,next)=>{
    console.log("helo from 3");
    // res.send("response 3");
    next();
},(req,res)=>{
    console.log("helo from 4");
    res.send("response 4");
    // next();
}]
);


app.listen(3000,()=>{
    console.log("server is connected to 3000")
});