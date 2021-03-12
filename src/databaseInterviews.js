const mysql = require('mysql');
const { promisify } =require('util');

const { database } = require('./keysInterviews');

const pool = mysql.createPool(database);

pool.getConnection((err,conection)=>{
    if(err){
        if(err.code=== 'PROTOCOL_CONCECTION_LOST'){
            console.error('database conection was closed');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('database has to many conections');
        }
        if(err.code === 'ER'){
            console.error('database has to many conections');
        } 
        console.log('Unknown error');
    }
    if(conection) conection.release();
    console.log('DB is conected');
    return;

})

//prmisify pool query
pool.query = promisify(pool.query);

module.exports = pool;
 