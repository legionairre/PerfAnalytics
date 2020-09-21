const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Analytics = require('./models');

const hostname = 'localhost';
const port = 5000;
const url = 'mongodb://localhost:27017';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server to db');
})

let requestCount = 0;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  requestCount++;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');
  console.log(req.method);
  if ( req.method === 'OPTIONS' ) {
    res.statusCode = 200;
    res.end();
  } else if ( req.method === 'GET' ) {
    res.statusCode = 200;
    const { beginTime, endTime } = req.query;

    console.log(Number(beginTime), Number(endTime))
    return Analytics.find({
      $and:
        [
          {
            createdAt:
              { $gt: Number(beginTime) }
          },
          {
            createdAt:
              { $lte: Number(endTime) }
          }
        ]
    })
      .then((response) => {
        console.log(response)
        res.end(JSON.stringify(response));
      });

  } else if ( req.method === 'POST' ) {
    res.statusCode = 200;
    req.body.forEach(document => {
      const { url, analyticType, time, startTime } = document;
      const newAnalytics = Analytics({
        url,
        analyticType,
        time,
        startTime,
        createdAt: new Date().getTime()
      });

      newAnalytics.save()
        .then((analytic) => {
          console.log("analytic", analytic);

          return Analytics.find({}).exec();
        })
        .catch((err) => {
          console.log(err);
        })
    });

    res.end();


  } else if ( req.method === 'PUT' ) {
    res.statusCode = 405;
    res.end('<html><body><h1>Error 405: ' + req.method +
      ' not allowed</h1></body></html>');
  } else if ( req.method === 'DELETE' ) {
    res.statusCode = 405;
    res.end('<html><body><h1>Error 405: ' + req.method +
      ' not allowed</h1></body></html>');
  }
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`PerfAnalytics API running at http://${hostname}:${port}`);
})

