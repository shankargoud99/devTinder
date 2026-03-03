const express = require("express");
const connectDB=require("./config/database")
const app = express();
const User=require("./models/user");
const { validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");

app.use(express.json());

app.post("/signup",async (req,res)=>{
    try{
        //validate data
         validateSignUpData(req)
    
    const {firstName,lastName,emailId,password}=req.body;
    //Encrypt the password
    const passwordHash= await bcrypt.hash(password,10);
    console.log(passwordHash)
    //creating a new instance of the user model
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    });

       
    await user.save();
    res.send("User Added successfully");
    }catch(err){
        res.status(400).send("Error "+err.message)
    }
 });

 app.post("/login",async (req,res)=>{
    try{
       const {emailId,password}=req.body;

       const user=await User.findOne({emailId:emailId});
       if(!user){
        throw new Error("Invalid credentials")
       }
       const isPasswordValid= await bcrypt.compare(password,user.password);
       if(isPasswordValid){
        res.send("Login successfully");
       }else{
        throw new Error("Invalid credentials");
       }
    }catch(err){
        res.status(400).send("Error:"+err.message);
    }
 })

app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const users=await User.find({emailId:userEmail});
       
        if (users.length===0){
            res.status(404).send("user not found");
        }else{
            res.send(users);
        }
        }catch{
            res.status(400).send("something went wrong")
        }
    }
    );
app.get("/feed",async (req,res)=>{
     try{
        const users=await User.find();
       
        if (users.length===0){
            res.status(404).send("user not found");
        }else{
            res.send(users);
        }
        }catch{
            res.status(400).send("something went wrong")
        }
    }
    );
app.delete("/user/:userId",async (req,res)=>{
    const userId=req.params.userId;
    try{
        const user= await User.findByIdAndDelete(userId);
        res.send("User deleted succesfully");
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
// app.patch("/user/:userId",async (req,res)=>{
//     const userId=req.params?.userId;
//     const data =req.body;
   
//     try{
//         const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"];
//         const isUpdateAllowed=Object.keys(data).every((k)=>
//            ALLOWED_UPDATES.includes(k)
//     );

//     if (!isUpdateAllowed){
//         throw new Error("update not allowed");
//     }
//     if(data?.skills.length>10){
//         throw new Error("skills cannot be more than 10");
//     }
//     const user=await User.findByIdAndUpdate(userId,data,
//             {returnDocument:"after",
//             runValidators:true}
//         );
//         res.send("User upadated successfully")
//     }catch(err){
//         res.status(400).send("Updated faild"+err.message);
//     }
// })
app.patch("/user/:userId", async (req, res) => {
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
            "firstName"
        ];

        const isUpdateAllowed = Object.keys(req.body).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }

        if (req.body.skills && req.body.skills.length > 10) {
            throw new Error("skills cannot be more than 10");
        }
        if(data?.skills.length>10){
            throw new error("skills cant more than 10")
        }

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: req.body },
            { returnDocument: "after", runValidators: true }
        );

        res.json(user);
    } catch (err) {
        res.status(400).send("Update failed: " + err.message);
    }
});

connectDB()
.then(()=>{
    console.log("Database connection established");
    app.listen(3000, () => {
    console.log("server is connected to 3000");
});

})
.catch((err)=>{
    console.error("Database cannot be connected")
});


