var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");
const bcrypt = require('bcryptjs');
const { query } = require('express');
var router=express.Router();

module.exports=router;

router.get("/",async(req,res)=>{
    let productCnt=0;
    let active=0;
    let pending=0;
    let allvehicles=[];
    
    let productcnt=await returnProductCnt().then(function(value) {
        productCnt=value;
    }).catch(function(v) {
        productCnt=v;
      });
      let pendingcnt=await returnProductStatusCnt(2).then(function(value) {
        pending=value;
    }).catch(function(v) {
        pending=v;
      });
      let activecnt=await returnProductStatusCnt(1).then(function(value) {
        active=value;
    }).catch(function(v) {
        active=v;
      });
      
    var query="SELECT * FROM products a,vehiclestatus b WHERE a.status=b.statusID";
    conn.query(query,(err,rows)=>{
        if(!err){
            if(rows.length > 0){
                let resp={
                    allproductcnt:productCnt,
                    statuspending:pending,
                    statusactive:active,
                    allproduct:rows

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
                ResponseMessage:"Error fetching product"
            }
            res.status(400).send(resp);
        }
    })
})

//insert product
router.post("/insertproduct",(req,res)=>{
    let appDate=util.GetCurrentDateTime();
    let productID=util.GenProfileID();
    var query="INSERT INTO products(productID,productName,added,status) VALUES(?,?,?,?)";
    conn.query(query,[productID,req.body.productName,appDate,1],(err,rows)=>{
        if(!err){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Product added successfully"
            }
            res.send(resp);
        }else{
            let resp={
                ResponseCode:'69',
                ResponseMesssage:"Error adding products"
            }
            res.send(resp);
        }
    })
})

//update products
router.put('/updateproduct',(req,res)=>{
    var query="UPDATE products SET status=?,productName=? WHERE productID=?";
    conn.query(query,[req.body.status,req.body.productName,req.body.productID],(err,rows)=>{
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

function returnProductStatusCnt(st){
    var cnt=0;
    
    return new Promise(function(resolve,reject){
        var query="SELECT Count(productID) as cnt FROM products WHERE status='"+st+"'";
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
function returnProductCnt(){
    var cnt=0;
    return new Promise(function(resolve,reject){
        var query="SELECT Count(productID) as cnt FROM products";
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