var express = require('express');
var router = express.Router(); 
var mysql = require('mysql');
var config = require('../module/createSql');
var pool =  mysql .createPool(config);
const fs = require('fs');
const multer = require('multer');
var upload = multer({ dest: 'uploads/'}).single('file');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getCourse', function (req, res, fields) {  
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
      var sql = "select * from course";
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

// 学生提交课程
router.put('/submitCourse', function (req, res, fields) {
  var studentName = req.body.studentName;
  var id = req.body.id;
  var studentId = req.body.studentId;
  console.log('studentIdstudentIdstudentId',studentId);
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
      var sql ="update course set toStudent=?, studentId=?, isCheck=? where id=?";
      var update_value = [studentName,studentId,1,id];
      conn.query(sql,update_value, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '选择课程失败',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '200',
          status: 1,
          remark: '选择课程成功',
          message: '请求成功',
          data: vals
        }));
        
      });
    }
  });
});
// 上传文件
router.post('/upload', upload, function (req, res, next) {
  let data = {};
  data['code'] = 200;
  let file = req.file;
  if(file){
    let fileNameArr = file.originalname.split('.');
    var suffix = fileNameArr[fileNameArr.length - 1];
    //文件重命名
    fs.renameSync('./uploads/' + file.filename, `${fileNameArr[0]}.${suffix}`);
    file['newfilename'] = `${fileNameArr[0]}.${suffix}`;
  }
  data['file'] = file;
  res.send(data);
})


router.get('/download',(req,res)=>{
  req.query.url ? res.download(`upload/${res.query.url}`):res.send({
    success:false
  })
});

module.exports = router;
