var express = require('express');
var router = express.Router(); 
var mysql = require('mysql');
var config = require('../module/createSql');
var pool =  mysql .createPool(config);
var qs = require('qs');

// 获取某个老师的课程
router.post('/', function(req, res, next) {
  // req 前端传给后端的值 request
  // res 是数据库返回给后端的值 response
  var teacher = req.body.teacher;
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
      var sql = `select * from course where fromTeacher="${teacher}" `;
      conn.query(sql, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '获取课程失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '获取课程成功',
          message: '请求成功',
          data: vals
        }));
        
      });
    }
  });
  
});

// 老师提交课题
router.post('/issue', function (req, res, fields) {
  //1.首先拿到前端传来的参数
  //2.从req.body中拿前端传来的数据
  var dataList = qs.parse(req.body.list);
  var teacher = req.body.teacher;
  var i = 0;  
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
      // 批量插入
      var values = [];
      // for in 遍历对象
      // {
      //   '0': { value: 'uuuuuuu', detail: 'uuuuuu------uuuu' },
      //   '1': { value: 'iiiiiiiii', detail: 'iiii' }
      // }
      for(var item in dataList){
        values[i] = [dataList[i].value,0,dataList[i].detail,teacher]
        i++;
      }
      var sql = "insert into  course(`courseName`,`isCheck`,`courseDeatil`, `fromTeacher`) VALUES ?";
      // 单行插入
      // var sql = `insert into course(courseName,isCheck,courseDeatil,fromTeacher) values(${dataList[0].value},0,${dataList[0].detail},3)`;
      conn.query(sql,[values], function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '添加课程失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '添加课程成功',
          message: '请求成功',
          data: vals
        }));
        
      });
    }
  });
});

//删除
router.delete('/deleteCourse', function (req, res, fields) {
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
     // 删除sql
      var sql ="delete from course where courseName=?";
      var where_value = [req.query.courseName];
      conn.query(sql,where_value, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '删除课程失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '删除课程成功',
          message: '请求成功',
          data: vals
        }));
        
      });
    }
  });
});

// 修改
router.put('/addDeatil', function (req, res, fields) {
  var courseDeatil = req.body.courseDeatil;
  var id = req.body.id;
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
     // 修改sql
      var sql ="update course set courseDeatil=? where id=?";
      var update_value = [courseDeatil,id];
      conn.query(sql,update_value, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '添加详细信息失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '添加详细信息成功',
          message: '请求成功',
          data: vals
        }));
        
      });
    }
  });
});

// 评价
router.post('/evaluate', function (req, res, fields) {
  var mark = req.body.mark;
  var comment = req.body.comment;
  var courseName = req.body.courseName;
  var studentname = req.body.studentname;
  var studentID =  req.body.studentID
  var teacherName = req.body.teacherName;
  var teacherID = req.body.teacherID;
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
      var sql = `insert into evaluate(mark,comment,courseName,studentname,studentID,teacherName,teacherID) 
      values('${mark}','${comment}','${courseName}','${studentname}','${studentID}','${teacherName}','${teacherID}')`;
      conn.query(sql, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '评价失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '评价成功',
          message: '请求成功',
          data: vals
        }));
      });
    }
  });
});




module.exports = router;
