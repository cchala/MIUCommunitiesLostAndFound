const express=require('express')
const cors=require('cors')
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
let db;


const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use((req, res, next) => {
    if (!db) {
      client.connect(function (err) {
        db = client.db('MIUCommunitiesLostAndFound');
        req.db = db;
        console.log("12345")
        next();
      });
    } else {
      req.db = db;
      next();
    }
  })
  
 


  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.listen(3000,()=>console.log("app is running on port 3000.."))