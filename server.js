// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var cors = require('cors');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var mongoClient = require('mongodb').MongoClient();
var Bing = require('node-bing-api')({accKey: '4f32ccb378814873820de93431889c7c'});
var searchTerm = require('./search');
var db;
var endOfLine = require('os').EOL;

app.use(cors());
app.use(bodyparser.json());
mongoClient.connect('mongodb://darianhk:1190096921@ds033196.mlab.com:33196/imgsrchdhk', function(error, database){
  db = database;
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html')
})


app.get('/api/imagesearch/:searchVal*', function(req, res, next){
  var { searchVal } = req.params;
  var { offset } = req.query;
  
  var data = new searchTerm({
    searchVal,
    offset,
    searchDate: new Date()
  });
 db.collection('searches').insert(data);
  
  let https = require('https');

// **********************************************
// *** Update or verify the following values. ***
// *********************************************
let subscriptionKey = '4f32ccb378814873820de93431889c7c';
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/images/search';

let term = searchVal;

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // header keys are lower-cased by Node.js
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
      res.json(body)
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        console.log(body);
      res.json(body)
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_image_search = function (search) {
  console.log('Searching images for: ' + term);
  let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}

if (subscriptionKey.length === 32) {
    bing_image_search(term);
} else {
    console.log('Invalid Bing Search API subscription key!');
    console.log('Please paste yours into the source code.');
}
})

app.get('/api/recentsearches/', (req, res, next) => {
  //show terms and times
  var thedata = [];
  var them = db.collection('searches').find().toArray(function(err, data){
    for(var i=0;i<10;i++){
      delete data[i]._id
      thedata.push(data[i])
    };
    res.json(thedata)
  }); 
})

// listen for requests :)
app.listen(process.env.PORT, function () {
  console.log('Your app is listening');
});

  