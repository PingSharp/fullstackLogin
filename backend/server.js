const mongoose = require('mongoose');
const express = require("express");
const Data = require("./data");
const bodyParser = require("body-parser")

const API_PORT = 3001;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())


var connect;
//Connect to mongodb
mongoose.connect("mongodb://localhost:27017/myapp",{useNewUrlParser:true});
connect =  mongoose.connection;

    
connect.on('error',console.error.bind(console,'connection error:'));
connect.once('open', function(){
   console.log("succesfully connected!")
 
});
app.post("/signin",(req,res) =>{
    const {email,password} = req.body;
    if(!email){
        return res.json({success:false,message: "Error: Email can not be blank!"})
    }
    if(!password){
        return res.json({success:false,message: "Error: Password can not be blank!"})
    }
    Data.find({email:email},(err,previousUsers)=>{
        if(err){
            return res.json({success:false,message: "Error: Server error"});
        }
        else if(previousUsers.length > 0){
          const user = previousUsers[0];
          if(!user.validPassword(password)){
            return res.json({success:false,message: "Error: Invalid"});
          }
          return res.json({success:true,message: "Valid sign in"});
        }
    });
});

app.post("/putData",(req,res)=>{
    var a = req;
    const{uname,email,password} = req.body;
    if(!email){
        return res.json({success:false,message: "Error: Email can not be blank!"})
    }
    if(!password){
        return res.json({success:false,message: "Error: Password can not be blank!"})
    }
    if(!uname){
        return res.json({success:false,message: "Error: name can not be blank!"})
    }
    Data.find({email:email},(err,previousUsers) =>{
        if(err){
            return res.json({success:false,message: "Error: Server error"});
        }
        else if(previousUsers.length > 0){
            return res.json({success:false,message: "Error: Account already exist!"});
        }
    })
    let newUser = new Data();
    newUser.email = email;
    newUser.name = uname;
    newUser.password = newUser.generateHash(password);
    newUser.save((err,user)=>{
        if(err){
            return res.json({success:false,message: "Error: Server error"});
        }
        console.log("user added.")
        return res.json({success:true,message:"Signed up"});
    })
})
// app.post("/updateData",(req,res) =>{
//     const {name,email,password} = req.body;
//     Data.findOneAndUpdate(name,email,password,err=>{
//         if(err) return res.json({success: false,error: err});
//         return res.json({success:true});
//     } );
// });
// app.delete("/deleteData",(req,res)=>{
//     const {id} = req.body;
//     Data.findOneAndDelete(id,err =>{
//         if(err) return res.json({success: false,error: err});
//         return res.json({success:true});
//     });
// });
app.listen(API_PORT,()=>console.log(`listening to port:${API_PORT}`));




