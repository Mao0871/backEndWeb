const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mysql = require('mysql2');
const _ = require('lodash');
const path = require('path'); // 引入path模块
const app = express();

app.set('view engine', 'ejs');

// 设置自定义视图目录
app.set('views', path.join(__dirname));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'd2002423m',
  database: 'flywingsbackend'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.get('/goods-management', (req, res) => {
  connection.query('SELECT * FROM product', (err, results) => {
    if (err) throw err;
    res.render('goodsManagementMan', { products: results });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
