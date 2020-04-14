const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const responseTime = require('response-time');

const apiRouter = require('./routes/route');

// using middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(responseTime((req, res, time) => {
  // console.log(`${req.method}, ${req.url}, ${time}`);

  let content = `\n${req.method}     '${req.url}'    ${res.statusCode}      ${Math.trunc((time*100).toFixed(3))}ms`;
  
  fs.appendFile('./Logs.txt', content, err =>{
    if(err) {
      console.error(err);
    }
    console.log('file saved');
  })
}));

// routing middleware
app.use('/', apiRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
