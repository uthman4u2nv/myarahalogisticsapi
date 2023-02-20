var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");
const bcrypt = require('bcryptjs');
var router=express.Router();


router.post('/login',async(req,res)=>{
    var query="SELECT FullNames,Email,Phone,profileID,Pswd FROM Users WHERE Status='1' AND Email=?";
    let Password=
    conn.query(query,[req.body.email],async (err,result,fields)=>{
        if(!err){
            
            /*Object.keys(result).forEach(function(key) {
                var row = result[key];
                console.log(row.name)
              });*/
            //console.log("FullNames",fields[0].FullNames);
            if(result.length < 1){
                let resp={
                    ResponseCode:"69",
                    ResponseMessage:"Invalid Username and Password"
                }
                res.send(resp);
            }else{
            const auth = await bcrypt.compare(req.body.pswd, result[0].Pswd);
            if (auth) {
                let resp={
                    ResponseCode:"00",
                    ResponseMessage:"Successfull",
                    FullNames:result[0].FullNames,
                    Email:result[0].Email,
                    Phone:result[0].Phone,
                    ProfileID:result[0].profileID
                    
                }
                res.send(resp);
            }else{
                let resp={
                    ResponseCode:"69",
                    ResponseMessage:"Invalid Username and Password"
                }
                res.send(resp);
            }
        }
        }else{
            let resp={
                ErrorCode:69,
                ErrorMessage:err.message
            }
            res.send(resp);
            //return res.status(400).json(resp);
        }
    })
})
module.exports=router;