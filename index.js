import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";



const app=express();
const __dirname=dirname(fileURLToPath(import.meta.url));
mongoose.connect('mongodb://127.0.0.1:27017/userdata').then(()=>{
    console.log("connection established");
});


let PORT=3000;

const userSchema=new mongoose.Schema({
    name:String,
    rollno:Number,
    email:String
});
const User=mongoose.model("User",userSchema);


const user1=new User({
    name:"Divyansh Gupta",
    rollno:2206248,
    email:"divyanshgupta1811@gmail.com"
});

const user2=new User({
    name:"Saksham Singhal",
    rollno:2246029,
    email:"sakshamsinghal11@gmail.com"
});

const user3=new User({
    name:"Prakash Singh",
    rollno:2206246,
    email:"prakash00611@gmail.com"
});

const defaultuser=[user1,user2,user3];




app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",async(req,res)=>{

    const searchRes=await User.find({}).then((found,err)=>{
        // console.log(found);
        if(found.length===0)
        {
            User.insertMany(defaultuser).then(()=>{
                console.log(" default user added ")}
            );
            res.redirect("/");
        }
        else{
            
            res.render("index.ejs",{users:found});
        }
    })

   
})

app.post("/submit",(req,res)=>{
    console.log(req.body);
    const postuser=new User({
        name:req.body.name,
        rollno:req.body.rollno,
        email:req.body.email
    })
    
    postuser.save();
    
    res.redirect("/")
 
})
app.post("/delete",(req,res)=>{
    let id=req.body.delete;
    
    User.findByIdAndRemove(id).then(()=>{
        console.log("user removed sucessfully");}
    );
    res.redirect("/");
})







app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})