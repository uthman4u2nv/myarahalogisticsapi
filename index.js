var conn=require('./connection');
var util=require('./utilities');
const http=require('http');
const express=require("express");
const bcrypt = require('bcrypt');
require('dotenv').config();
var Users=require('./users');
var Auths=require('./auth');
var Dash=require('./dashboard');
var Vehicle=require('./vehicle');
var Product=require('./products');
var Customer=require('./customer');
var Orders=require('./orders');
var app=express();
const bodyparser=require("body-parser");
app.use(express.json());
const cors = require('cors');
app.use(cors());

var allowlist = ['http://localhost:4200','localhost','http://localhost','localhost:4200'];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
const port = process.env.PORT || 8585;
var httpServer = http.createServer(app);
httpServer.listen(port,(req,res)=>{
    console.log("Application up and running");
});


app.get('/',(req,res)=>{
    let resp={
        "status":"Server up and running"
    }
    res.send(resp);
})

app.get('/getcelebrants',(req,res)=>{
    var query="SELECT memberPhone FROM members WHERE DATE_FORMAT((memberDOB),'%m-%d') = DATE_FORMAT(NOW(),'%m-%d')";
   
    conn.query(query,(err,rows)=>{
        if(!err){
            res.send(rows);

           
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error, getting celebrants"+err.sqlMessage
            }
            console.log("Error:"+err.message);
            res.send(resp);
        }
    })
})

app.post('/registration',(req,res)=>{
    let appDate=util.GetCurrentDateTime();
    let appNo=util.randomStr(9);
    var query="INSERT INTO application(Surname,OtherNames,Email,Phone,residentialAddress,DoB,marital,spouseName,spouseAddress,spouseEmail,spousePhone,Nok,NokAddress,NokPhone,NokEmail,prySchoolName,pryFrom,pryTo,secSchoolName,secFrom,secTo,uniName,uniFrom,uniTo,highQual,profQual,Occupation,workPlace,workAddress,level,offence,expelled,villageUnionName,villageUnion,villagehead,hailfrom,applyUCN,applyDate,grantedmembership,notgrantedreason,oncemember,looseMembership,WhyBecomeMember,ref1,refPhone1,ref2,refPhone2,applicationDate,applicationNo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    conn.query(query,[req.body.Surname,req.body.OtherNames,req.body.Email,req.body.Phone,req.body.residentialAddress,req.body.DoB,req.body.marital,req.body.spouseName,req.body.spouseAddress,req.body.spouseEmail,req.body.spousePhone,req.body.Nok,req.body.NokAddress,req.body.NokPhone,req.body.NokEmail,req.body.prySchoolName,req.body.pryFrom,req.body.pryTo,req.body.secSchoolName,req.body.secFrom,req.body.secTo,req.body.uniName,req.body.uniFrom,req.body.uniTo,req.body.highQual,req.body.profQual,req.body.Occupation,req.body.workPlace,req.body.workAddress,req.body.level,req.body.offence,req.body.expelled,req.body.villageUnionName,req.body.villageUnion,req.body.villagehead,req.body.hailfrom,req.body.applyUCN,req.body.applyDate,req.body.grantedmembership,req.body.notgrantedreason,req.body.oncemember,req.body.looseMembership,req.body.WhyBecomeMember,req.body.ref1,req.body.refPhone1,req.body.ref2,req.body.refPhone2,appDate,appNo],(error,result)=>{
        if(!error){
            let resp={
                ResponseCode:"00",
                ResponseMessage:"Application Successfull"
            }
            let name=req.body.Surname+ " "+req.body.OtherNames;
            //send email
            const msg=`<h2>Usagbe Club of Nigeria Online Membership Application Platform!</h2>		<p>Dear ${name},</p><p>Thank you for your interest in becoming a member of Usagbe Club of Nigeria.</p><p>Your Application Number is: ${appNo}.</p>
		<p>Your application is currently been reviewed and you will be contacted for the next steps.</p>		
		<p>For more enquiries please kindly send a mail to <a href='mailto:membershipsupport@usagbeclub.org'>membershipsupport@usagbeclub.org</a></p>
		<p>Regards</p>`;
        util.SendEmail(req.body.Email,msg,"Usagbe Club of Nigeria Online Membership Application Platform");

            res.send(resp);
        }else{
            let resp={
                ResponseCode:"69",
                ResponseMessage:"Error, creating application"
            }
            console.log("Error:"+error.message);
            res.send(resp);

        }
    })
})

//Users Request
app.use('/users',Users);
app.use('/auth',Auths);
app.use('/dashboard',Dash);
app.use('/vehicle',Vehicle);
app.use('/products',Product);
app.use('/customers',Customer);
app.use('/orders',Orders);





