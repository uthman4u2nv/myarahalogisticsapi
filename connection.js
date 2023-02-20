const mysql=require("mysql");

require('dotenv').config();
const hostname=process.env.HOSTNAME;
const username=process.env.USERNAME;
const pwsd=process.env.PASSWORD;
const db=process.env.DATABASE;
//const dbport=process.env.PORT;
console.log(process.env.HOSTNAME);
/*const mysqlConnection = mysql.createPool({
    connectionLimit : 1000, //important
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host:"web2.weblagos.com",
    user:"qllpepqt_membership",
    password:"2021@Usagbe",
    database:"qllpepqt_membership",
    port:3306
    host:hostname,
    user:username,
    password:pwsd,
    database:db,
    port:3306
});*/

var pool = mysql.createPool({
    connectionLimit:1000,
    host: hostname,
    user: username,
    password: pwsd,
    database:db,
    port:8889
    
  });
  
  pool.getConnection((err,connection)=> {
    if(err)
    throw err;
    console.log('Database connected successfully');
    connection.release();
  });


module.exports=pool;