const express=require("express");

const app=express();

// app.use("/hello/2",(req,res)=>{
//     res.send("Hello from hello2")
// });

// app.use("/test",(req,res)=>{
//     res.send("Hello from test")
// });
// app.use("/hello",(req,res)=>{
//     res.send("Hello from hello")
// });
// app.use("/",(req,res)=>{
//     res.send("Hello from shankar")
// });
app.use("/user",(req,res)=>{
    res.send("data shankar")
})

app.get("/user",(req,res)=>{
    res.send({firstname:"shankar",lastname:"patil"})
})
app.post("/user",(req,res)=>{
    res.send("Data saved successfully")
});
app.delete("/user",(req,res)=>{
    res.send("Deleted successfully")
})

app.listen(3000,()=>{
    console.log("server is connected to 3000")
});