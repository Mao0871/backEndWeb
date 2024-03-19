const express = require("express");
const bodyParser = require("body-parser");

const ejs = require('ejs');
const mysql = require('mysql2');
const path = require('path');
const app = express();
app.use(express.json());

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
    connection.query('SELECT name, id, price, (`41` + `42` + `43` + `44` + `45` + `46`) AS inventory FROM product WHERE category_id = "001"', (err, results) => {
        if (err) {
            console.error('Error fetching products: ' + err);
            return res.status(500).send('Error fetching products');
        }
        res.render('backGoodsManaMan', { products: results });
    });
});


app.delete('/delete-product/:id', (req, res) => {
    const productId = req.params.id;
    const deleteQuery = 'DELETE FROM product WHERE id = ?';

    connection.query(deleteQuery, [productId], (err, results) => {
        if(err) {
            console.error('Error deleting product: ' + err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});
//按下detail按钮可以转到对应商品的detail页面
app.get('/product-detail/:id', (req, res) => {
    const productId = req.params.id;
    const query = `SELECT p.name, p.id, p.category_id, p.sub_category_id, p.description, p.price, p.discount, p.41, p.42, p.43, p.44, p.45, p.46
                   FROM product p WHERE p.id = ?`;

    connection.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product details: ' + err);
            return res.status(500).send('Error fetching product details');
        }
        if (results.length > 0) {
            const product = results[0];
            res.render('BackGoodsDetail', { product });
        } else {
            res.status(404).send('Product not found');
        }
    });
});
//detail页面修改后回传到sql
app.post('/update-product', (req, res) => {
    // Destructure the request body to extract all fields, including sizes
    const { id, name, category_id, sub_category_id, description, price, discount, size_41, size_42, size_43, size_44, size_45, size_46 } = req.body;

    // Construct an SQL query that updates product details and sizes
    const updateProductQuery = `
        UPDATE product 
        SET name = ?, category_id = ?, sub_category_id = ?, description = ?, price = ?, discount = ?, 
        \`41\` = ?, \`42\` = ?, \`43\` = ?, \`44\` = ?, \`45\` = ?, \`46\` = ? 
        WHERE id = ?`;

    // Execute the query with parameters from the request body
    connection.query(updateProductQuery, 
        [name, category_id, sub_category_id, description, price, discount, size_41, size_42, size_43, size_44, size_45, size_46, id], 
        (err, results) => {
            if (err) {
                console.error('Error updating product: ' + err);
                return res.status(500).send('Error updating product');
            }
            res.send({ success: true });
        }
    );
});

//添加货物按钮
app.post('/add-product', (req, res) => {
    const insertQuery = `INSERT INTO product (name, category_id, sub_category_id, description, price, discount, \`41\`, \`42\`, \`43\`, \`44\`, \`45\`, \`46\`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`;

    connection.query(insertQuery, (err, results) => {
        if (err) {
            console.error('Error adding new product: ' + err);
            return res.status(500).send('Error adding new product');
        }
        res.redirect('/goods-management');
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
