const express = require("express");
const connectDB=require("./config/database")
const app = express();
const User=require("./models/user");

app.use(express.json());

app.post("/signup",async (req,res)=>{
    
    //creating a new instance of the user model
    const user=new User(req.body);
    try{
    await user.save();
    res.send("User Added successfully");
    }catch(err){
        res.status(400).send("Error saving the user"+err.message)
    }
 });

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


