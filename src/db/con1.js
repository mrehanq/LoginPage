const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost27107/userdata",{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err);
});