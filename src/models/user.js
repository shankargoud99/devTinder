const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new error("gender data is not valid");
                
            }
        }
    },
    password:{
        type:String
    },
    skills:{
        type:[String],
        default:"js"
    },
    photoUrl:{
        default:"photo is not there"
    },
    about:{
        type:String
    }
});

module.exports=mongoose.model("User",userSchema)