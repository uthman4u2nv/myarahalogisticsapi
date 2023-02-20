var conn=require('./connection');

const express=require("express");
//const { query } = require('express');
var router=express.Router();

module.exports=router;


//returns an order history by order no
router.get('/orderhistory/:id',(req,res)=>{
    
     var query="SELECT * FROM order_history a,order_status b where a.status=b.statusID AND a.orderNo=?";
    
     conn.query(query,[req.params.id],(err,rows)=>{
         if(!err){
             if(rows.length > 0){
                 res.send(rows);
             }
             
 
            
         }else{
             
             let resp={
                 ResponseCode:"69",
                 ResponseMessage:"Error, getting orders"
             }
             console.log("Error:"+err.message);
             res.status(400).send(resp);
         }
     })
 })

 //returns all status
 router.get("/getstatus",async(req,res)=>{
    var query="SELECT * FROM order_status";
    conn.query(query,(err,rows)=>{
        if(!err){
            res.send(rows);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Successfull"
            }
            res.status(400).send(resp);
        }
    })
 })

 //update order status
 router.put("/updatestatus",async(req,res)=>{
    var query="UPDATE orders SET status=? WHERE order_no=?";
    conn.query(query,[req.body.status,req.body.order_no],(err,rows)=>{
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
    res.status(400).send(resp);
        }
    })
 })

 //returns all orders
 router.get('/',async(req,res)=>{
   
    let ordered=0;
    let processing=0;
    let delivered=0;
    let cancelled=0;
    
      let orderedcnt=await GetStatistics(1).then(function(value) {
        ordered=value;
    }).catch(function(v) {
        ordered=v;
      });
      let processingcnt=await GetStatistics(2).then(function(value) {
        processing=value;
    }).catch(function(v) {
        processing=v;
      });
      let deliveredcnt=await GetStatistics(4).then(function(value) {
        delivered=value;
    }).catch(function(v) {
        delivered=v;
      });
      let canceledcnt=await GetStatistics(5).then(function(value) {
        cancelled=value;
    }).catch(function(v) {
        cancelled=v;
      });
    var query="SELECT a.date,b.customerID,a.order_no,a.status,c.status as status_name,b.name,b.email,b.phone,b.address FROM orders a,customers b,order_status c WHERE a.customerID=b.customerID AND a.status=c.statusID";
    conn.query(query,(err,rows)=>{
        if(!err){
            if(rows.length > 0){
                
                let resp={
                    totalorders:rows.length,
                    totalordered:ordered,
                    totalprocessing:processing,
                    totaldelivered:delivered,
                    totalcancelled:cancelled,
                    order_data:rows
                }
                res.send(resp);
            }else{
                let resp={
                    ResponseCode:"69",
                    ResponseMessage:"No records found"
                }
                res.send(resp);
            }
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error fetching orders"
            }
            res.status(400).send(resp);
        }
    })
 })

 //returns order items
 router.get('/orderitems/:id',(req,res)=>{
    var query="SELECT a.productID,a.qty,b.productName FROM order_items a,products b WHERE a.productID=b.pID AND a.order_no=?";
    conn.query(query,req.params.id,(err,rows)=>{
            if(!err){
                if(rows.length > 0){
                    res.send(rows);
                }
                
            }else{
                let resp={
                    ResponseCode:"00",
                    ResponseMessage:"Error"
                }
                res.status(400).send(resp);
            }
        })
 })

 //return order statistics
 router.get('/orderstatistics',async(req,res)=>{
    let orderCnt=0;
    let ordered=0;
    let processing=0;
    let delivered=0;
    let cancelled=0;
    
    
    let ordercnt=await returnProductCnt().then(function(value) {
        orderCnt=value;
    }).catch(function(v) {
        orderCnt=v;
      });
      let orderedcnt=await GetStatistics(1).then(function(value) {
        ordered=value;
    }).catch(function(v) {
        ordered=v;
      });
      let processingcnt=await GetStatistics(2).then(function(value) {
        processing=value;
    }).catch(function(v) {
        processing=v;
      });
      let deliveredcnt=await GetStatistics(4).then(function(value) {
        delivered=value;
    }).catch(function(v) {
        delivered=v;
      });
      let canceledcnt=await GetStatistics(5).then(function(value) {
        cancelled=value;
    }).catch(function(v) {
        cancelled=v;
      });
 })

 function GetStatistics(status){
    let cnt=0;
    return new Promise((resolve,reject)=>{
        var query="SELECT count(order_no) as cnt  FROM orders where status='"+status+"'";
        conn.query(query,(err,rows)=>{
            if(!err){
                if(rows.length > 0){
                    resolve(rows[0].cnt);
                }else{
                    resolve(cnt);
                }
            }else{
                reject(cnt)
            }
        })

    })
 }
 function returnOrderItems(order_no){
    let rw=[];
    return new Promise(function(resolve,reject){
        var query="SELECT a.productID,a.qty,b.productName FROM order_items a,products b WHERE a.productID=b.pID AND a.order_no='"+order_no+"'";
    conn.query(query,(err,rows)=>{
            if(!err){
                
            
                
                resolve(rows)
                
            }else{
                
                reject(rw);
            }
        })
        
    })

}
