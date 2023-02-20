const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const bcrypt2 = require('bcryptjs');
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
require('dotenv').config();


const GenProfileID=function(){
  return uuidv4();
}

const randomStr=function (len) {
    let ans = "";
    var arr="1234567890";
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    
    return ans;
}
const GetCurrentDateTime= function (){
    
    let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // current year
        let year = date_ob.getFullYear();

        // current hours
        let hours = date_ob.getHours();

        // current minutes
        let minutes = date_ob.getMinutes();

        // current seconds
        let seconds = date_ob.getSeconds();
        let regDate=year + "-" + month + "-" + date+" "+hours+":"+minutes+":"+seconds ;
        
        return regDate;
}
const HashMyPassword= async function (password) {
           let hash="";
           const salt = await bcrypt.genSalt();
           var Password = await bcrypt.hash(password, salt);
    /*var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(password, salt, (err, res) => {
      console.log('hash', res)
      hash = res
      return res;
  });*/
    //let passwordHash = bcrypt.hashSync(password, 10);

    //return passwordHash;
    //return hash;
    return Password;
}

//sends email
const SendEmail=async function(toAddress,body,subject){
  let hostname=process.env.MAILHOST;
  let portno=process.env.MAILPORT;
  let username=process.env.MAILUSER;
  let password=process.env.MAILPASSWORD;
  console.log("Host:"+username);
    try{

      var transporter = nodemailer.createTransport({ 
        host: hostname,
        port: portno,
        auth: {
          user: username,
          pass: password
        },
        secure:true,
        logger: true,
        debug: true,
        ignoreTLS: true 
      });
  
        let info = await transporter.sendMail({
          from: '"Usagbe Club of Nigeria " <application@usagbeclub.org>', // sender address
          to: toAddress, // list of receivers
          subject: subject, // Subject line
          //text: "Hello world?", // plain text body
          html: body, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        return info.messageId;
    }catch(error){      
      console.log(error);
    }
}

module.exports={randomStr,GetCurrentDateTime,HashMyPassword,SendEmail,GenProfileID}