// 引入 express 框架
const express = require('express')
var Login = require('./login/login.js')
// 实例化 对象
const app = express()
// 端口3000
const port = 3000
// 路由
Login(app);
// 监听端口
app.listen(port, () => console.log(`Example app listening on port ${port}!`))