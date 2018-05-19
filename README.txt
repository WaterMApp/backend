# INTRO
The backend/database architecture is mainly mantained by Be-P
@TODO implement markdown style

# API IFACE 

### 1. GET FOUNTAIN LIST

req:
    GET /fountain_list 
res(json):
    [fountain,..]
    fountain : { id: string, lat: double, lng: double, street: string}

    e.g.:
    [
        {"id": "a9456jg9ak", "lat": 33.3, "lng": 33.3, "street": "via pippo"},
        {"id": "bf456jg9ak", "lat": 33.3, "lng": 33.4, "street": "via pluto"}
    ]

### 2. CREATE FOUNTAIN 

! REQUIRES JSON REQUEST BODY (IF FAILS CHECK FOR APPLICATION/JSON HEADER)

req:
    POST /fountain_create

req.body:
    { lat: double, lng: double [, street: string] }
    e.g.:
    { "lat": 33.3, "lng": 33.3, "street": "via pippo" } 

res:
    id of newly created fountain

### 3. GET FOUNTAIN DATA

req: 
    GET /fountain_data/:id
    e.g.
    GET /fountain_data/a95kafghoa

res:
    the last measurement(@TODO is it better to use a list of measurement?)

    { id: string, ph double, turb double, temp double, timestamp integer }
    e.g.
    { 'id': 'a029345dkg', 'ph': 3.3, 'turb': 4.4, 'temp':22.0, 'timestamp' : 1526729844 }

### 4. ADD FOUNTAIN DATA

req:
    POST /fountain_data/:id

req.body:
    {ph : double, turb:double, temp: double, ts: int }
    e.g.
    {'ph': 3.3, 'turb': 4.4, 'temp':22.0, 'timestamp' : 1526729844 }

res:
    blank 

### 5. GET COMMENTS ABOUT FOUNTAIN

req:
    GET /fountain_comments/:id
    
res:
    {id string, text string, timestamp int, name string}

### 6. ADD COMMENTS ABOUT FOUNTAIN

req:
    POST /fountain_comments/:id

req.body:
    {text: string, name: string [,timestamp: int]}

### 7. ADD MEASUREMENTS 

req:
    POST /@TODO
req.body:
    { ph:double, turb:double, temp:double [, timestamp: int] }



# DB SCHEMA

fountains( 
    id varchar(10),  // MEANT FOR UID STRING @TODO PRIMARYKEY
    lat double,
    lng double,
    street varchar(20)
)

fountains_measurements(
    id varchar(10),
    ph double,
    turb double,
    temp double,
    timestamp int   // MEANT FOR UNIX TIME TIMESTAMP
)

fountains_comments(
    id varchar(10),
    text varchar(140),
    name varchar(20),
    timestamp int
)


# DB_MANAGMENT.JS DB IFACE

nodejs module that exports following methods:
@TODO DOC







