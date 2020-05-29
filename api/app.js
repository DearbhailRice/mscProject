// require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connection = require('./bin/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var cors = require("cors");
var app = express();
var testdbRouter = require("./routes/test")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/test", testdbRouter);

app.route("/test_select_all").get(function (req, res) {
  console.log("in test_select_all router api");
  connection.query(
    "SELECT * FROM test_table",
    req.params.test_id,
    // ).request.get({
    //   body: JSON.stringify({ results })

    // },
    //   (error, response) => {
    //     console.log("Response ", JSON.stringify(response));
    //     console.log(response.statusCode);
    //     if (error || response.statusCode != 200
    //     ) {
    //       return res.status(500).send(error);
    //     }

    //   return res.json(response.body);
    // }
    function (error, results, feilds) {
      if (error) throw error;
      res.json(results);
    }
  )

});

// app.route("/test_insert").get(function (req, res) {
//   console.log("in test_insert router api");
//   connection.query(
//     "INSERT INTO `msc_project`.`test_table` ( `first_name`, `second_name`) VALUES ('first name 4', 'second name 4');",
//     req.params.test_id,
//     function (error, results, feilds) {
//       if (error) throw error;
//       res.json(results);
//     }
//   );
// });

// app.route("/test_update").get(function (req, res) {
//   var paramUpdateFname = "'updated first name' ";
//   var paramUpdateLname = "'updated second name' ";
//   var paramTestId = 4;
//   console.log("in test_update router api");
//   connection.query(
//     "UPDATE `msc_project`.`test_table` SET `first_name` = " + paramUpdateFname + ", `second_name` = " + paramUpdateLname + " WHERE`test_table`.`test_id` =" + paramTestId + "; ",
//     req.params.test_id,
//     function (error, results, feilds) {
//       if (error) throw error;
//       res.json(results);
//     }
//   );
// });


app.route("/test_delete").get(function (req, res) {
  var paramTestId = 7;
  console.log("in test_update router api");
  connection.query(
    "DELETE FROM `msc_project`.`test_table` WHERE `test_table`.`test_id` = " + paramTestId + "; ",
    req.params.test_id,
    function (error, results, feilds) {
      if (error) throw error;
      res.json(results);
    }
  );
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001);
module.exports = app;
