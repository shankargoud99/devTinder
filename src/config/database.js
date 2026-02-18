const mongoose=require("mongoose")

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://namastedev:ONGVti19SfrZTIB1@namstenode.m08xbr8.mongodb.net/"
    );
};

module.exports=connectDB;




