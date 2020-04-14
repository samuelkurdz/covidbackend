const express = require('express');
const fs = require('fs');
const Router = express.Router();

const js2xmlparser = require('js2xmlparser');
const estimator = require('./estimator');

let xmlDOc = '';
let estimations = '';

Router.get('/', (req, res)=> {
res.json({"Message": "Welcome"});
});

Router.post('/api/v1/on-covid-19', (req, res, time) => {
  const data = req.body;
  estimations = estimator(data);
  xmlDOc = js2xmlparser.parse("Estimations", estimations);
  res.status(200).json({"estimations": estimations});
});

Router.get('/api/v1/on-covid-19/json', (req,res) => {
  res.status(200).json({"estimations": estimations});
})

Router.get('/api/v1/on-covid-19/xml', (req, res) => {  
  res.type("application/xml");
  res.send(xmlDOc);
});


Router.get('/api/v1/on-covid-19/logs', async (req, res) => {
  
  const logs = fs.readFileSync('./Logs.txt', 'utf8');
  console.log(logs);
  res.set({
    'Content-Type': 'text/plain',
  }).send(logs);
});

module.exports = Router;
