require('dotenv').config();
const express = require("express")
const app = express();
const hbs = require("hbs")
const bcrypt = require("bcryptjs");
const Register = require("./models/registers")
const jwt = require("jsonwebtoken");

require("./db/con1");


const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.set("view engine","hbs");
app.set("views", "templates/views");
hbs.registerPartials("templates/partials")


// console.log(process.env.SECRET_KEY);
app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/registration",(req,res)=>{
    res.render("registration")
});
app.post("/registration",async(req,res)=>{
    try {
        // console.log(req.body.fname)
        // res.send(req.body.fname)
        const password=req.body.password;
        const confirmpassword= req.body.confirmpassword;
        if (password===confirmpassword) {
            // res.send("Passwod match")
            const userdata = new Register({
                fname:req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
                password:password,
                // confirmpassword:confirmpassword, 
            });

            const token = await userdata.generateToken(); 
            console.log(token);
            res.cookie("jwt",token,{
                expires: new Date(Date.now()+300000),
                httpOnly:true
            }); 
            console.log(cookie);

            const registered =  await userdata.save();
            res.status(201).send(registered); 
            console.log(registered); 
        } else {
            res.send("Passwod not match")
        }

    } catch (error) {
        res.status(400).send(error);
    }
});
app.post("/login",async(req,res)=>{ 
    try {
        const email =req.body.email
        const password =req.body.password;

        const useremail = await Register.findOne({email:email});
        const ismatch = await bcrypt.compare(password,useremail.password);
        const token = await useremail.generateToken(); 
        console.log(token);
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+60000),
            httpOnly:true,
            // secure:true 
        });
        if(ismatch){
            res.send(`welcome ${useremail.fname} ${useremail.lname}`) 
        }else{
            res.send("Invalid login details!!!")
        }
    } catch (error) {
        res.status(400).send("Invalid login details!!!")
    }
        // res.send(req.body.email)
        // res.send(req.body.password)
});





// const securePass = async (password)=>{
//     const passwordHash = await bcrypt.hash(password,10)
//     console.log(passwordHash);
//     const passwordMatch = await bcrypt.compare(password,passwordHash)
//     console.log(passwordMatch);
// }
// securePass("rehan");


app.listen(port,()=>{
    console.log(`Listening to server ${port}`)
});