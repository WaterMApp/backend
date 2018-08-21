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
    console.log("get fountain_list");
    db.get_fountains(
        (f)=>{console.log(f); res.send(JSON.stringify(f));}
    );

});

app.get("/fountain_data/:id",function(req,res){
    log("get fountain_data");

    db.get_last_measurement(
        req.params.id,
        (m)=>{ console.log("fount data ret:",m);res.send(JSON.stringify(m)); }
    );

});

app.get("/fountain_comments/:id",function(req,res){
    log("get fountain_comments");
    db.get_comments(
        req.params.id,
        (l)=>{ log("comments result:",l);res.send(JSON.stringify(l)) }
    );

});

app.post("/fountain_create",function(req,res){
        log("post fountain_create");
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

app.post("/fountain_comments/:id",function(req,res){
    log("post fountain_comments");

    if(!req.body.text || 
       !(typeof req.body.text === 'string') || 
       req.body.text.length<=0)
    {
        res.send("malformed request");return;
    }

    if(!req.body.name || 
       !(typeof req.body.name === 'string') || 
       req.body.name.length<=0)
    {
        res.send("malformed request");return;
    }
    log(req.params);
    log(req.params.id); 
    req.body.f_id=req.params.id;
    
    if(!req.body.timestamp) req.body.timestamp = getTimestamp();

    log("adding new comment",req.body);

    db.write_comment(req.body);
    res.send("ok")
});

app.post("/fountain_data/:id", function(req,res){
    console.log("post fountain data")
    // add measurement to db
    req.body.f_id=req.params.id
    
    log(req.body); 
    if(!isInt(req.body.ph) && !isFloat(req.body.ph)){
        res.send("malformed ph");return;
    }
    if(!isInt(req.body.turb) && !isFloat(req.body.turb)){
        res.send("malformed turb");return;

    }
    if(!isInt(req.body.temp) && !isFloat(req.body.temp)){
        res.send("malformed temp");return;
    }

    if(!req.body.timestamp) req.body.timestamp = getTimestamp();

    log("writing measurement")
    db.write_measurement(req.body)
    res.send("ok")
});


app.listen(PORT,()=>log("listening on "+PORT));
