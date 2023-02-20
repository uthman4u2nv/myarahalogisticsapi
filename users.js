var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");
const bcrypt = require('bcryptjs');
var router=express.Router();

router.post('/insertuser',async (req,res)=>{
    
    let appDate=util.GetCurrentDateTime();
    let profileID=util.GenProfileID();
    //let password=await util.HashMyPassword(req.body.pswd);
    let password=await util.HashMyPassword("Password123");
    //const salt = await bcrypt.genSalt();
    //var Password = await bcrypt.hash(req.body.pswd, salt);
    //console.log("Password",password);
    var query="INSERT INTO Users(profileID,FullNames,Pswd,Email,Phone,RoleID,RegDate,Status) VALUES(?,?,?,?,?,?,?,?)";
    conn.query(query,[profileID,req.body.fNames,password,req.body.email,req.body.phone,req.body.roleID,appDate,1],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Successfull"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Failed:"+err.message
            }
            return res.status(400).json(resp);
            //res.send(resp);
        }
    })
})

//get user by ID
router.get('/users:id',(req,res)=>{
    console.log("ID:"+req.params.id);
    var query="SELECT profileID,FullNames,Email,Phone,RoleID FROM Users WHERE profileID=?";
    conn.query(query,[req.params.id],(err,rows)=>{
        if(!err){
            if(rows.length > 0){
                res.send(rows);
            }else{
                res.send({"Count":0})
            }
        }else{
            console.log(JSON.stringify(err));
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error, getting users "+err.sqlMessage
            }
            console.log("Error:"+err.message);
            res.send(resp);
        }
    })
})

//returns all users
router.get('',(req,res)=>{
    var query="SELECT profileID,FullNames,Email,Phone,a.RoleID,roleName,status FROM Users a,roles b WHERE a.roleID=b.roleID";
   
    conn.query(query,(err,rows)=>{
        if(!err){
            if(rows.length){
                res.send(rows);
            }
            

           
        }else{
            console.log(JSON.stringify(err));
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error, getting users"+err.sqlMessage
            }
            console.log("Error:"+err.message);
            res.send(resp);
        }
    })
})

//check if a user exists by email
router.post('/checkuser',(req,res)=>{
    var query="SELECT * from users where Email=?";
    conn.query(query,[req.body.Email],(err,rows)=>{
        if(!err){
            if(rows.length > 0){
                let resp={
                    ResponseCode:69,
                    ResponseMessage:"User exists already"
                }
                res.send(resp);
            }else{
                let resp={
                    ResponseCode:00,
                    ResponseMessage:"Successfull"
                }
                res.send(resp);
            }
        }else{

        }
    })
})

//update user password
router.put('/updatepswd',async (req,res)=>{
    console.log("Password Req",req.body.pswd);
    var query="UPDATE Users SET Pswd=? WHERE profileID=?";
    //var Password=util.HashMyPassword(req.body.pswd);
    //bcrypt.genSaltSync()
    //var Password=bcrypt.hashSync(req.params.pswd,bcrypt.genSaltSync(10));
    //const salt = await bcrypt.genSalt();
    //var Password = await bcrypt.hash(req.body.pswd, salt);
    let Password=await util.HashMyPassword(req.body.pswd);
    //console.log("Password",Password);
    conn.query(query,[Password,req.body.profileID],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Password Updated Successfully"
            }
            res.send(resp);
        }else{
            console.log("Password Update Error"+err.message);
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error Updating Password"
            }
            res.send(resp);
            //return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
        }
    })
})

//update user profile
router.put('/updateprofile',async(req,res)=>{
    console.log(req.body);
    var query="UPDATE Users SET FullNames=?,Email=?,Phone=? where profileID=?";
    conn.query(query,[req.body.FullNames,req.body.Email,req.body.Phone,req.body.profileID],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Profile updated successfully"
            }
            console.log(resp)
            res.send(resp);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Profile update failed"
            }
            console.log(resp);
            res.send(resp);
        }
    })
})

//change status
router.put('/changestatus',async(req,res)=>{
    //console.log(JSON.stringify(req.body));
    var query="UPDATE Users SET Status=? WHERE profileID=?";
    conn.query(query,[req.body.status,req.body.profileID],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Status update successfull"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Status update failed"
            }
            res.send(resp);
        }
    })
})

//change role
router.put('/changerole',async(req,res)=>{
   // console.log(JSON.stringify(req.body));
    var query="UPDATE Users SET RoleID=? WHERE profileID=?";
    conn.query(query,[req.body.roleID,req.body.profileID],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Role update successfull"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Role update failed"
            }
            res.send(resp);
        }
    })
})

//user details
router.get('/displaydetails',async(req,res)=>{
    let userCnt=0;
    let active=0;
    let pending=0;
    let allusers=[];
    
    let usercnt=await returnUsersCnt().then(function(value) {
        userCnt=value;
    }).catch(function(v) {
        userCnt=v;
      });
      let pendingcnt=await returnUsersStatusCnt(2).then(function(value) {
        pending=value;
    }).catch(function(v) {
        pending=v;
      });
      let activecnt=await returnUsersStatusCnt(1).then(function(value) {
        active=value;
    }).catch(function(v) {
        active=v;
      });
      let users=await returnAllUsers().then(function(value) {
        allusers=value;
    }).catch(function(v) {
        allusers=v;
      });
     
    let resp={
        UserCount:userCnt,
        Pending:pending,
        Active:active,
        AllUsers:allusers
        
    }
    
    res.send(resp);
})

function returnUsersStatusCnt(st){
    var cnt=0;
    
    return new Promise(function(resolve,reject){
        var query="SELECT Count(profileID) as cnt FROM Users WHERE status='"+st+"'";
    conn.query(query,(err,rows)=>{
            if(!err){
                
            cnt=rows[0].cnt;
                
                resolve(cnt)
                
            }else{
                cnt=0;
                reject(cnt);
            }
        })
        
    })
}
function returnAllUsers(){
    return new Promise(function(resolve,reject){
        let user="";
        var query="SELECT profileID,FullNames,Email,Phone,a.RoleID,roleName,status FROM Users a,roles b WHERE a.roleID=b.roleID";
    conn.query(query,(err,rows)=>{
            if(!err){
                
            //cnt=rows[0].cnt;
                
                resolve(rows)
                
            }else{
                
                reject(user);
            }
        })
        
    })
}

function returnUsersCnt(){
    var cnt=0;
    return new Promise(function(resolve,reject){
        var query="SELECT Count(profileID) as cnt FROM Users";
    conn.query(query,(err,rows)=>{
            if(!err){
                
            cnt=rows[0].cnt;
                
                resolve(cnt)
                
            }else{
                cnt=0;
                reject(cnt);
            }
        })
        
    })

}
module.exports=router;