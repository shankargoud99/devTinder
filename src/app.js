const express=require("express");

const app=express();

const {adminAuth,userAuth}=require("./middleware/auth")

//handle auth middleware for all get post request
app.use("/admin",adminAuth);

app.get("/user",userAuth,(req,res)=>{
    res.send("from user auth")
});
app.post("/user/login",(req,res)=>{
    res.send("user logged successfully")
});

app.get("/admin/user",(req,res,next)=>{
    console.log("helo from 2");
     res.send("response 2")
});
app.get("/admin/deleteuser",(req,res)=>{
    console.log("helo from 4");
    res.send("response 4");
    // next();
});

app.listen(3000,()=>{
    console.log("server is connected to 3000")
});