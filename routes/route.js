const express = require('express');
const fs = require('fs');
const Router = express.Router();

const js2xmlparser = require('js2xmlparser');
// const responseTime = require('response-time');


const estimator = require('./estimator');

let xmlDOc = '';
let estimations = '';
Router.get('/', (req, res)=> {
res.json({"Message": "Welcome"});
});

Router.post('/api', (req, res, time) => {
  const data = req.body;
  estimations = estimator(data);
  xmlDOc = js2xmlparser.parse("Estimations", estimations);
  res.status(200).json({"estimations": estimations});


});

Router.get('/api/json', (req,res) => {
  res.status(200).json({"estimations": estimations});
})

Router.get('/api/xml', (req, res) => {  
  res.type("application/xml");
  res.send(xmlDOc);
    console.log(res.getHeaders());
});

Router.get('/api/logs', async (req, res) => {
  const logs = fs.readFileSync('./Logs.txt', 'utf8');
  console.log(logs);
  
  res.set({
    'Content-Type': 'text/plain',
  }).send(logs);
});


module.exports = Router;






















// {
//   region: {
//   name: "Africa",
//   avgAge: 19.7,
//   avgDailyIncomeInUSD: 5,
//   avgDailyIncomePopulation: 0.71
//   },
//   periodType: "days",
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
//  }