var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");
const bcrypt = require('bcryptjs');
const { query } = require('express');
var router=express.Router();

module.exports=router;

//all customers
router.get("/",async(req,res)=>{
    let customerCnt=0;
    let active=0;
    let pending=0;
    let allvehicles=[];
    
    let customercnt=await returnCustomerCnt().then(function(value) {
        customerCnt=value;
    }).catch(function(v) {
        customerCnt=v;
      });
      let pendingcnt=await returnCustomerStatusCnt(2).then(function(value) {
        pending=value;
    }).catch(function(v) {
        pending=v;
      });
      let activecnt=await returnCustomerStatusCnt(1).then(function(value) {
        active=value;
    }).catch(function(v) {
        active=v;
      });
      
    var query="SELECT * FROM customers a,vehiclestatus b WHERE a.status=b.statusID";
    conn.query(query,(err,rows)=>{
        if(!err){
            if(rows.length > 0){
                let resp={
                    allcustomercnt:customerCnt,
                    statuspending:pending,
                    statusactive:active,
                    allcustomers:rows

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
                ResponseMessage:"Error fetching customer"
            }
            res.status(400).send(resp);
        }
    })
})

//insert product
router.post("/insertcustomer",(req,res)=>{
    let appDate=util.GetCurrentDateTime();
    let customerID=util.GenProfileID();
    var query="INSERT INTO customers(customerID,name,email,phone,address,added,status) VALUES(?,?,?,?,?,?,?)";
    conn.query(query,[customerID,req.body.name,req.body.email,req.body.phone,req.body.address,appDate,1],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"customer added successfully"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:'69',
                ResponseMesssage:"Failed"
            }
            res.send(resp);
        }
    })
})

//update products
router.put('/updatecustomer',(req,res)=>{
    var query="UPDATE customers SET status=?,name=?,email=?,phone=?,address=? WHERE customerID=?";
    conn.query(query,[req.body.status,req.body.name,req.body.email,req.body.phone,req.body.address,req.body.customerID],(err,rows)=>{
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

function returnCustomerStatusCnt(st){
    var cnt=0;
    
    return new Promise(function(resolve,reject){
        var query="SELECT Count(customerID) as cnt FROM customers WHERE status='"+st+"'";
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
function returnCustomerCnt(){
    var cnt=0;
    return new Promise(function(resolve,reject){
        var query="SELECT Count(customerID) as cnt FROM customers";
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