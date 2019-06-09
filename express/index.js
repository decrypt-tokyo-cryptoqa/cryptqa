"use strict"

require('date-utils');
const cors = require('cors')({origin: true});
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// サーバー実装の前に、エラーハンドリングを記載します。
process.on('uncaughtException', function(err) {
  console.log(err);
});

app.use(cors);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'jv4w68=4WOSy',
  database : 'cryptoqa'
});

app.get('/query/*', function(req, res) {
  let ethereum_address = req.params[0];
  let query_str = 'select max(qa_id) as qa_id from cryptoqa.qa where ethereum_address = "' + ethereum_address + '" ';
console.log(query_str);
  connection.query(query_str, function (error, results, fields) {
    if (error) res.send(error);
    console.log(results[0]);
    
    res.send(results[0]);
  }); 
});

app.get('/answer/*/*', function (req, res) {
  let ethereum_address = req.params[0];
  let qa_id = req.params[1];
  
  let query_str = 'select qa_item from cryptoqa.qa where qa_id = ' + qa_id + ' and ethereum_address = "' + ethereum_address + '" ';
  query_str += 'Order by create_at desc;';
  console.log(query_str);
  connection.query(query_str, function (error, results, fields) {
    if (error) res.send(error);
    //if (error) throw error;
    //if (results[0]['qa_item'] == "") res.send("対象の質問項目がありません");
    res.send(results[0]['qa_item']);
  });
});

app.post('/create', function (req, res) {
 
  let qa_id = req.body.qa_id;
  let qa_url= req.body.qa_url;
  let ethereum_address = req.body.ethereum_address;
  var qa_item = JSON.stringify(req.body.qa);
  var dt = new Date();
  let create_time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
  let query_string = "INSERT INTO cryptoqa.qa SET ?";
  let query_params = { qa_id: qa_id, qa_url: qa_url, ethereum_address: ethereum_address, qa_item: qa_item, create_at: create_time};
  connection.query(query_string, query_params, (err, res) => {
    if (err) throw err;
    console.log('Last insert ID:', res.insertId);
  });
 
  res.send('POST request to the homepage');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
