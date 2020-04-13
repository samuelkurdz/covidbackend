const express = require('express');
const Router = express.Router();
const js2xmlparser = require('js2xmlparser');

const estimator = require('./estimator');

let xmlDOc = '';
let estimations = '';

Router.post('/', (req,res) => {
  const data = req.body;
  estimations = estimator(data);
  xmlDOc = js2xmlparser.parse("Estimations", estimations);
  res.status(200).json({"estimations": estimations});
});

Router.get('/json', (req,res) => {
  res.status(200).json({"estimations": estimations});
})

Router.get('/xml', (req, res) => {  
  res.type("application/xml");
  res.send(xmlDOc);
    console.log(res.getHeaders());
});

module.exports = Router;




  // console.log(req.headers);
  // console.log(res.getHeaders());





















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