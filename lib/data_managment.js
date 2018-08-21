var log=console.log;

var sqlite = require("sqlite3");

var db_path = "./db/watermapp.db"

// Create db connection
var db  = new sqlite.Database(db_path,(err)=>{
    
    if(err) {
        console.error(err.message);
    }else{
        log("Connected to sqlite3 database");
    }

});

exports.close = function close(){
    db.close((err)=>{ log(err.message);});
}

exports.write_fountain = function write_fountain(f){
    var sql ="INSERT INTO fountains VALUES(?,?,?,?)";


    db.run(sql,[f.id, f.lat, f.lng, f.street], function(err){
    
        if(err) log(err.message);

    });
}

exports.write_measurement = function write_measurement(m){
    var sql ="INSERT INTO fountains_measurements VALUES(?,?,?,?,?)";
    db.run(sql,[m.f_id, m.ph, m.turb, m.temp, m.timestamp],(err)=>{
        if(err) log(err.message);
    });

}

exports.write_comment = function write_comment(c){
    var sql = "INSERT INTO fountains_comments VALUES(?,?,?,?)";
    db.run(sql,[c.f_id,c.text,c.timestamp,c.name],(err) =>{
        if(err) log(err.message);
    });
}

// Gets all fountains from the database, 
// instead of fire-and-forget as for write ops
// we have to define a callback hook to process the response
exports.get_fountains = function get_fountains(callback){
    
    var sql = "SELECT * FROM fountains";

    db.all(sql, [], (err,rows)=>{
        if(err) throw err; 

        callback(rows);
    });

}

exports.get_comments = function get_comments(id,callback){
 
    var sql= "SELECT * FROM fountains_comments WHERE id=?";
 
    db.all(sql, [id], (err,rows)=>{

        if(err) throw err;

        callback(rows);
    });
}

exports.get_measurements = function (id,callback){


    var sql= "SELECT * FROM fountains_measurements WHERE id=?";
 
    db.all(sql, [id], (err,rows)=>{

        if(err) throw err;

        callback(rows);
    });

}

exports.get_last_measurement = function(id,callback){

    var sql=
        "select * from fountains_measurements "+
        "where id=? and timestamp="+
        "(select MAX(timestamp) from fountains_measurements where id=?)";

    db.get(sql, [id,id], (err,row)=>{
        if(err) throw err; 

        callback(row);
    });

}

