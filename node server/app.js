// 常量
const redisHost = "127.0.0.1"; // redis服务地址
const redisPort = 6379; // redis服务端口
const redisPassWord = ""; // 如果没有密码，则不填

// 初始化express
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// 初始化redis
const redis = require("redis");
const redisClient = redis.createClient(redisPort, redisHost);
if (redisPassWord) {
  redisClient.auth(redisPassWord);
}
redisClient.on("connect", function() {
  console.log("redis connect success");
});

// 设置header
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 路由

// 接收mykey发送的eos签名，参数：uuid，将unix作为redis的key进行更新
app.post("/sendSign", (req, res) => {
  console.log("sendSign req.body === ", req.body);
  console.log("sendSign req.query === ", req.query);
  const body = { ...req.body, ...req.query };
  console.log("sendSign body === ", body);
  const { sign, uuid } = body;
  // {
  // 	account: 'uattaoflof3b',
  // 	chain: 'EOS',
  // 	ref: 'mykey',
  // 	protocol: 'SimpleWallet',
  // 	sign: 'SIG_K1_Jv2AQFEehFNE9HVLoW1A5Ukw7N6V3PVB8Z4R5xWK8T2E6zUYSQoNWfGhsrZ6y3PrisD7SmaAhFJkbK9JTnYDhWWDY1E7Fj',
  // 	version: '1.0'
  // }
  redisClient.set(uuid, sign, (err, date) => {
    if (err) {
      res.send(err);
      console.log("redisClient set sendSign uuid err === ", err);
      return;
    }
    res.send(date);
    console.log("redisClient set sendSign uuid success === ", date);
  });
});

// 接收插件发送的uuid，并作为redis的key，获取对应的value
app.get("/getSign", (req, res) => {
  console.log("getSign req.query === ", req.query);
  console.log("getSign req.body === ", req.body);
  const body = { ...req.body, ...req.query };
  console.log("getSign body === ", body);
  const { uuid } = body;
  redisClient.get(uuid, (err, value) => {
    if (err) {
      res.send(err);
      console.log("redisClient set sendUuid uuid err === ", err);
      return;
    }
    res.send(value);
    console.log("redisClient set sendUuid uuid success === ", value);
  });
});

module.exports = app;
