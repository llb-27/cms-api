var express = require('express');
var router = express.Router(); 
var mysql = require('mysql');
var config = require('../module/createSql');
var pool =  mysql .createPool(config);
var qs = require('qs');

// 发布公告
router.post('/announcement', function (req, res, fields) {
  //1.首先拿到前端传来的参数
  //2.从req.body中拿前端传来的数据
  // req 请求 前端传给后端的值放在req中
  // res 响应 数据口给后端的响应
   var content2 = req.body.content;
   var time2 = req.body.time;
   var title2 = req.body.title;   
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
      // 单行插入
    var sql = `insert into notice(content,title,time) values('${content2}','${title2}','${time2}')`;
    console.log('sqlsqlsqlsqslq',sql);
      conn.query(sql, function (qerr, vals, fields) {
        if (qerr) {
          console.log('===========================',qerr);
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '发布公告失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '发布课程成功',
          message: '请求成功',
          data: vals
        }));
      });
    }
  });

});

// 获取公告
router.get('/getNotice', function (req, res, fields) {  
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
      var sql = "select * from notice";
      conn.query(sql, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '获取公告失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '获取公告成功',
          message: '请求成功',
          data: vals
        }));
      });
    }
  });
});
module.exports = router;
