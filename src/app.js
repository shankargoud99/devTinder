const express = require("express");
const connectDB=require("./config/database")
const app = express();
const User=require("./models/user");

app.use(express.json());

// app.post("/signup",async (req,res)=>{
    
//     //creating a new instance of the user model
//     const user=new User(req.body);
//     try{
//     await user.save();
//     res.send("User Added successfully");
//     }catch(err){
//         res.status(400).send("Error saving the user"+err.message)
//     }
//  });

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


