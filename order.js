const express = require('express');
const cors = require('cors');
const app = express();
app.set('view engine', 'ejs');
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const querystring = require('querystring');

const port = 8080;

// Add the route handler for serving submit_order.html file
app.get('/submit_order', function (req, res) {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.render('submit_order');
});

// Add the other middleware and route handlers
app.use(express.static('public'));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit_order', (req, res) => {
  console.log("url:",req.url,",method:",req.method);
  if (!req.body.orders) {
    console.log("Invalid order data received");
    res.status(400).send("Invalid order data received");
    return;
  }
  const orders = req.body.orders;
console.log(`Received order data: ${JSON.stringify(orders)}`);
// 将餐点及数量进行相应的操作
let totalPrice = 0;
let category = "";
orders.forEach((order) => {
  totalPrice += order.qty * order.price;
  if (order.category === "麵食區") {
    category = "麵食";
  } else if (order.category === "速食區") {
    category = "速食";
  } else if (order.category === "自助區") {
    category = "自助";
  }
   else {
    category = "其他";
  }
});
res.render('submit_order', {totalPrice: totalPrice});
console.log("totalPrice:",totalPrice);
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});