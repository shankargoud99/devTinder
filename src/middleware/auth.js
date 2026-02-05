const adminAuth=(req,res,next)=>{
    console.log("admin auth getting checked");
    const token='xyz';
    const isAuthroized=token==='xyz';
    if(!isAuthroized){
        res.status(401).send("unAuthrozed request")
    }else{
    next()
}
};
const userAuth=(req,res,next)=>{
    console.log("admin auth getting checked");
    const token='xyz';
    const isAuthroized=token==='xyz';
    if(!isAuthroized){
        res.status(401).send("unAuthrozed request")
    }else{
    next()
}
};

module.exports={
    adminAuth,
    userAuth
};