var express = require('express');
var app = express();
var sql = require('mysql');
var multer = require('multer');
let path = require('path')

var con = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "mydb",

});
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


let Storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    var updatedpath = file.originalname + path.extname(file.originalname);
    cb(null, updatedpath);
    // paths.push("uploads/" + updatedpath);

  }
});
var upload = multer({
  storage: Storage
}).fields([{ name: "file", maxCount: 1 }]); //Field name and max count

/*var Storage = multer.diskStorage({
 destination: function(req, file, callback) {
     callback(null, "./Images");
 },
 filename: function(req, file, callback) {
     callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
 }
});*/
con.connect((err) => {
  if (err) {
    console.log(err)
    console.log('Error connecting to Db');
    return;
  }


});
// con.query('ALTER TABLE customer CHANGE COLUMN  idCUSTOMER idCUSTOMER INT NOT NULL AUTO_INCREMENT',function(err,resp){
//   if(err){
//     console.log(err);
// return;
//   }

// });
app.get('/get', function (req, res) {
  con.query('select * from  customer', function (err, recordset) {

    if (err) console.log(err)

    console.log(recordset);

    // send records as a response
    res.send(recordset);

  });
  //   con.end((err) => {
  //     // The connection is terminated gracefully
  //     // Ensures all previously enqueued queries are still
  //     // before sending a COM_QUIT packet to the MySQL server.
  //   })

});
app.post('/customer', function (req, res) {
  var params = req.body;
  console.log(params);
  con.query('INSERT INTO customer SET ?', params, (error, results, fields) => {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

app.post("/api/Upload", function (req, res) {
  // console.log(req.file);
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end("Something went wrong!");
    }
    return res.end("File uploaded sucessfully!.");
  });
});
app.get('/get/:id', function (req, res) {
  console.log(req);
  con.query('select * from  customer WHERE idCUSTOMER=' +req.params.id, function (err, recordset) {

    if (err) console.log(err)

    res.send(JSON.stringify({"status": 200, "error": null, "response": recordset}))

    // send records as a response
    res.send(recordset);

  });
});
app.put('/update/:id', function (req, res) {
  console.log(req);
  con.query( "UPDATE customer SET name='"+req.body.name+"', age='"+req.body.age+"' WHERE idCUSTOMER="+req.params.id, function (err, recordset) {

    if (err) console.log(err)

    res.send(JSON.stringify({"status": 200, "error": null, "response": recordset}))

    // send records as a response
    res.send(recordset);

  });
});
app.delete('/delete/:id',(req,resp)=>{
con.query('delete from customer where idCUSTOMER='+req.params.id,(err,result)=>{
  if(err)
    console.log(err);
  resp.send(JSON.stringify({"status": 200, "error": null, "response": result}));

})

})
var server = app.listen(5000, function () {
  console.log('Server is running');
});