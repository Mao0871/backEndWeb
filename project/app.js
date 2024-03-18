const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
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
    console.log(`Connected to MySQL as id ${connection.threadId}`);
});


// 修正的根路由，用于渲染登录页面
app.get('/', (req, res) => {
    res.render('backendLogin'); // 直接渲染 login.ejs 页面
});

// 商品管理页面路由
app.get('/goods-management', (req, res) => {
    connection.query('SELECT name, price, (`41` + `42` + `43` + `44` + `45` + `46`) AS inventory FROM product', (err, results) => {
        if (err) {
            console.error('Error fetching products: ' + err);
            return res.status(500).send('Error fetching products');
        }
        res.render('backGoodsManaMan', { products: results });
    });
});

// 其他页面的路由
app.get('/sell-history', (req, res) => res.render('BackOrderALL'));
app.get('/best-seller', (req, res) => res.render('BackBestSeller'));
app.get('/category-management', (req, res) => res.render('backCategoryMana'));
app.get('/goods-woman', (req, res) => res.render('backGoodsManaWoman'));
app.get('/goods-kids', (req, res) => res.render('backGoodsManakids'));
app.get('/bill-summary', (req, res) => res.render('BackBillsummary'));
app.get('/Detail', (req, res) => res.render('BackGoodsDetail'));
app.get('/sub-category', (req, res) => res.render('BackSub_CategoryMana'));

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
