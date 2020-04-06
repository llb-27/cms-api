var express = require('express');
var router = express.Router(); 
var mysql = require('mysql');
var config = require('../module/createSql');
var pool =  mysql .createPool(config);


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', function (req, res, fields) {
  console.log('req========',req.body);
  var name = req.body.name;
  var pwd = req.body.password;
  //从连接池获取连接
  pool.getConnection(function (err, conn) {
    if (err) {
      res.send(JSON.stringify({
        code: '500',
        status: 0,
        remark: '服务器异常',
        message: null,
        data: null
      }));
    } else {
      var sql = `select * from user where name="${name}" and password="${pwd}"`;
      conn.query(sql, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '获取数据失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '0x000000000',
          status: 1,
          remark: '获取用户列表',
          message: '请求成功',
          data: vals
        }));
        
      });
    }
  });
});




module.exports = router;
