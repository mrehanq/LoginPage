require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        // required:true
    },
    tokens:[
        {
         token:{
            type:String,
            required:true
         }   
        }
    ]
});
userSchema.methods.generateToken = async function(){
    try {
        // console.log(this._id);
        const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = (this.tokens.concat({token:token}));
        await this.save();
        return token;
    } catch (error) {
        console.log(`The error part ${error}`);
        res.send(`The error part ${error}`);
    }
}
userSchema.pre("save", async function(next){

    if(this.isModified("password")){
        console.log(`Current Password id ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`Hash Password is ${this.password}`);
        // this.confirmpassword = await bcrypt.hash(this.confirmpassword,10);

    }

    next();
});

const Register = new mongoose.model("Register",userSchema);
module.exports= Register;