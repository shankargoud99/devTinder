const express=require("express");

const app=express();

app.use("/",(req,res)=>{
    res.send("Hello from shankar")
});

app.use("/test",(req,res)=>{
    res.send("Hello from test")
});
app.use("/hello",(req,res)=>{
    res.send("Hello from hello")
});

app.listen(3000,()=>{
    console.log("server is connected to 3000")
});