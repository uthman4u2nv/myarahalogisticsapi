var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");

var router=express.Router();

router.get('',async(req,res)=>{
    let userCnt=0;
    let orderCnt=0;
    let usercnt=await returnUserCount().then(function(value) {
        userCnt=value;
    }).catch(function(v) {
        userCnt=v;
      });
      let ordercnt=await returnOrdersCnt().then(function(value){
        orderCnt=value;
      }).catch(function(v){
        orderCnt=v;
      })
    let resp={
        UserCount:userCnt,
        OrderCount:orderCnt
    }
    res.send(resp);
})



  








function returnUserCount(){
    var cnt=0;
    return new Promise(function(resolve,reject){
        var query="SELECT * FROM Users";
    conn.query(query,(err,rows)=>{
            if(!err){
                
            cnt=rows.length
                console.log("User Count",cnt);
                resolve(cnt)
                
            }else{
                cnt=0;
                reject(cnt);
            }
        })
        
    })
}
    function returnOrdersCnt(){
        var cnt=0;
        return new Promise(function(resolve,reject){
            var query="SELECT Count(*) FROM order_history GROUP BY orderNo";
        conn.query(query,(err,rows)=>{
                if(!err){
                    
                cnt=rows.length
                    //console.log("User Count",cnt);
                    resolve(cnt)
                    
                }else{
                    cnt=0;
                    reject(cnt);
                }
            })
            
        })
    
      


    
    
    
}

module.exports=router;
