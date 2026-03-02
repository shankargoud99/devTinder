const mongoose=require("mongoose")
const validator=require("validator")

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
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email adress"+value);
            }
        }
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
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("give strong password please"+value);
            }
        }
    },
    skills:{
        type:[String],
        default:"js"
    },
    photoUrl:{
        type:String,
        default:"photo is not there"
    },
    about:{
        type:String
    }
});

module.exports=mongoose.model("User",userSchema)