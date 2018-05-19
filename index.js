var log=console.log;

var express = require("express");
var bodyparser = require("body-parser");
var sqlite = require("sqlite3");
var uid = require("uid");
var db = require("./lib/data_managment.js");

var UID_SIZE = 10;
var PORT = 9998;

function getTimestamp(){
    return Math.floor(new Date() / 1000)
}

function isInt(n){
        return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
        return Number(n) === n && n % 1 !== 0;
}

var app = express();

app.use(bodyparser.json());

app.get("/", function(req,res){
    res.send("WaterMApp backend");
});

app.get("/fountain_list",function(req,res){
    db.get_fountains(
        (f)=>res.send(JSON.stringify(f))
    );

});

app.get("/fountain_data/:id",function(req,res){
    
    db.get_last_measurement(
        req.params.id,
        (m)=>res.send(JSON.stringify(m))
    );

});

app.get("/fountain_comments/:id",function(req,res){
    
    db.get_comments(
        req.params.id,
        (l)=>{ res.send(JSON.stringify(l)) }
    );

});

app.post("/fountain_create",function(req,res){
        
        if(!isFloat(req.body.lat) || !isFloat(req.body.lng)) {
            res.send("malformed request body");
            return;
        }
        
        // sql injection is already prevented by the sqlite3 engine
        if(!req.body.street) req.body.street=""; 
        req.body.id=uid(UID_SIZE);

        db.write_fountain(req.body);
        res.send(req.body.id);
});

// @TODO CHECK MALFORMED MESSAGES
app.post("/fountain_comments/:id",function(req,res){
    
    req.body.f_id=req.params.id;
    if(!req.body.timestamp) req.body.timestamp = getTimestamp();

    db.write_comment(req.body);

});

// @TODO CHECK MALFORMED MESSAGES
app.post("/fountain_data/:id", function(req,res){
    // add measurement to db
    req.body.f_id=req.params.id
    if(!req.body.timestamp) req.body.timestamp = getTimestamp();

    db.write_measurement(req.body)
});


app.listen(PORT,()=>log("listening on "+PORT));
