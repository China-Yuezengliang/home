const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// 引入 mongoose 处理数据库
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://yuezengliang:wobuzhidao123@cluster0-tt99s.gcp.mongodb.net/school", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const schoolSchema = new mongoose.Schema({
  name: String,
  pwd: String,
  body: Object,
  date: Date,
  uid: String,
  role: Number,
  door: String
});
const School = mongoose.model("school", schoolSchema);
module.exports = function(app) {
  app.get("/login", (req, res) => {
    console.log(req.query)
    if (req.query.uid && req.query.pwd) {
      //   查询数据库 如果 有就登录成功
      School.find(req.query, (err, person) => {
        if (person.length != 0) {
          res.send({
            status: 0,
            err_msg: "登陆成功",
            body: person
          });
        } else {
          res.send({
            status: -1,
            err_msg: "用户名与密码不正确"
          });
        }
      });
    } else {
      res.send({
        status: -2,
        err_msg: "参数不全"
      });
    }
  });
  app.post("/login", urlencodedParser, (req, res) => {
    console.log(req.body);
    if (
      req.body.uid.length >= 10 &&
      req.body.pwd.length >= 6 &&
      req.body.body &&
      req.body.name && req.body.door
    ) {
      // 查询数据库 目前 没有重复的name 才能注册
      School.find({ uid: req.body.uid }, (err, person) => {
        if (person.length != 0) {
          res.send({
            status: -1,
            err_msg: "该学号已被注册"
          });
        } else {
          let info = req.body;
          info["role"] = 0;
          School(info).save(err => {
            res.send({
              status: 0,
              msg: "注册成功"
            });
          });
        }
      });
    } else {
      res.send({
        status: -2,
        err_msg: "参数不全"
      });
    }
  });
  app.get("/dormitory/info",(req,res) => {
      if(req.query.uid && req.query.door) {
        School.find({uid:req.query.uid}, (err, person) => {
            if (person.length != 0) {
                School.find({door:person[0].door}, (err, person) => {
                    res.send({
                        status: 0,
                        err_msg: "查询成功",
                        body: person
                    });
                })
            } else {
              res.send({
                status: -1,
                err_msg: "没有此用户，请检查uid"
              });
            }
          });
      }
  })
};
