var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");
const bcrypt = require('bcryptjs');
const { query } = require('express');
var router=express.Router();


module.exports=router;

//returns all vehicles
router.get("/",async(req,res)=>{
    let vehicleCnt=0;
    let active=0;
    let pending=0;
    let allvehicles=[];
    
    let vehiclecnt=await returnVehiclesCnt().then(function(value) {
        vehicleCnt=value;
    }).catch(function(v) {
        vehicleCnt=v;
      });
      let pendingcnt=await returnVehicleStatusCnt(2).then(function(value) {
        pending=value;
    }).catch(function(v) {
        pending=v;
      });
      let activecnt=await returnVehicleStatusCnt(1).then(function(value) {
        active=value;
    }).catch(function(v) {
        active=v;
      });
      
    var query="SELECT * FROM vehicles a,vehiclestatus b WHERE a.status=b.statusID";
    conn.query(query,(err,rows)=>{
        if(!err){
            if(rows.length > 0){
                let resp={
                    allvehiclescnt:vehicleCnt,
                    statuspending:pending,
                    statusactive:active,
                    allvehicles:rows

                }
                res.send(resp);
            }else{
                let resp={
                    ResponseCode:"77",
                    ResponseMessage:"No records found"
                }
                res.send(resp);
            }

        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error fetching vehicles"
            }
            res.status(400).send(resp);
        }
    })
})

router.put('/edit',(req,res)=>{
    var query="UPDATE vehicles SET status=?,vRegNo=? WHERE vehicleID=?";
    conn.query(query,[req.body.status,req.body.vRegNo,req.body.vehicleID],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Successfull"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Failed"
            }
            res.send(resp);
        }
    })
})

//insert vehicle
router.post("/insertvehicle",(req,res)=>{
    let appDate=util.GetCurrentDateTime();
    let vehicleID=util.GenProfileID();
    var query="INSERT INTO vehicles(vehicleID,vRegNo,added,status) VALUES(?,?,?,?)";
    conn.query(query,[vehicleID,req.body.vRegNo,appDate,1],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Vehicle added successfully"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:'69',
                ResponseMesssage:"Error adding vehicle"
            }
            res.send(resp);
        }
    })
})

function returnVehicleStatusCnt(st){
    var cnt=0;
    
    return new Promise(function(resolve,reject){
        var query="SELECT Count(vehicleID) as cnt FROM vehicles WHERE status='"+st+"'";
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
function returnVehiclesCnt(){
    var cnt=0;
    return new Promise(function(resolve,reject){
        var query="SELECT Count(vehicleID) as cnt FROM vehicles";
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