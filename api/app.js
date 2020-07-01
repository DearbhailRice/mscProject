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
// var personalProfileRouter = require("./routes/personalProfile")
// const request = require("request");
// const cbor = require("cbor");

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
//app.use("/personal_profile_select:userId", personalProfileRouter);

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

app.route("/learning-profile-select").get(function (req, res) {
  console.log("in  router api");
  connection.query(
    "SELECT * FROM learning_profile INNER JOIN training on learning_profile.learning_profile_training_id= training.training_id INNER JOIN user on learning_profile_user_id = user.user_id	 WHERE learning_profile.learning_profile_user_id=1;",
    function (error, results) {
      if (error) throw error;
      res.json(results);
    }
  );
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


app.route("/personal_profile_select:userId").get(function (req, res) {
  console.log("in personal_profile_select router api");
  connection.query(
    "SELECT user_id, user_name, user_email_address,user_start_date, user_bank_staff_number,user_current_trust_employee_in_current_role,contact_details_tel_number, contact_details_personal_email,  contact_details_preffer_personal_email_contact, address_line_1, address_line_2, address_line_3,  address_postcode,address_town, address_county, emergency_contact_details_name, emergency_contact_details_tel_number, emergency_contact_details__relationship,clinical_area_title,role_title,band_title FROM user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id WHERE user.user_id = ? ; ",
    req.params.userId,
    function (error, results, feilds) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.route("/role_band_select").get(function (req, res) {
  connection.query("SELECT role_title, role_band_id FROM role;",
    req.params.role_id,
    function (error, results) {
      if (error) throw error;
      res.json(results)
    }
  );
});

// app.route("/personal_profile_select_band").get(function (req, res) {
//   console.log("in personal_profile_selectt_band router api");
//   connection.query(
//     "SELECT band_title FROM band",
//     req.params.userId,
//     function (error, results) {
//       console.log(results);
//       if (error) throw error;

//       res.json(results);
//     }
//   );
// });


app.route("/clinical_area_select").get(function (req, res) {
  console.log("in personal_profile_select-clinical_area router api");
  connection.query(
    "SELECT clinical_area_title FROM clinical_area;",
    req.params.clinical_area_id,
    function (error, results) {
      if (error) throw error;
      console.log(results);
      res.json(results);
    }
  );
});



app.route("/login_select:user_email").get(function (req, res) {
  var userLoginData = {};
  console.log("in  api");
  console.log("user_email " + req.params.user_email)
  connection.query(
    "SELECT user_id, user_email_address, password_text FROM `user` INNER Join password on user_id= password_user_id where user_email_address = ?;",
    req.params.user_email,
    function (error, results, feilds) {
      console.log("Error " + error)
      if (error) throw error;

      userLoginData = JSON.parse(JSON.stringify(results));

      console.log(results);
      res.json(results);
    }
  );

});

app.route("/login_push").post(function (req, res) {

  const payload = req.body;

  console.log(" in api post payload: " + payload)
  console.log("email " + payload.user_email)
  console.log("password" + payload.user_password)

  console.log("In /login_push api push  ")

  var user_password = payload.user_password;
  var user_id = 0;
  var message = "";
  var user_email = payload.user_email;
  var isCorrectLogin = false;
  console.log("user_email " + user_email)


  connection.query(
    "SELECT user_id, user_email_address, password_text FROM `user` INNER Join password on user_id= password_user_id where user_email_address = ?;",
    user_email,
    function (error, results, feilds) {
      console.log("Error " + error)

      if (results < 1) {
        console.log("results < 1 " + results)
        message = "email " + user_email + "does not match an existing user";
      }
      else if (error) {
        console.log("Error " + error)
        throw error;
      }
      else {

        console.log("db results " + JSON.stringify(results))
        console.log(" results.user_email_address " + results[0].user_email_address)


        if ((user_email == results[0].user_email_address) && (user_password == results[0].password_text)) {
          user_id = results[0].user_id;
          message = "email and password match";
          isCorrectLogin = true;

        } else if ((user_email == results[0].user_email_address) && (!user_password == results[0].password_text)) {
          message = "password is incorrect";

        } else {
          message = "username and password do not match";

        }
      }
      const responseObj = {
        user_id: user_id,
        message: message,
        isCorrectLogin: isCorrectLogin
      }
      console.log(JSON.stringify(responseObj));
      return res.json(responseObj)
    });

});



// componentWillMount() {
//   let optionsObj = [];
//   let roleObj = {};
//   let caObj = {};
//   let combineArr = [];

//   fetch("http://localhost:3001/role_band_select").then(res => {
//       console.log("editRes.status " + res.status);
//       if (res.status === 200) { return res.json(); }
//       throw `Invalid Query`
//   }).then(dbres => {
//       console.log("editdbres" + dbres)
//       roleObj = dbres.map(editItem => {
//           console.log("editItem.role_title " + editItem.role_title)
//           return {
//               type: "Role",
//               option1: editItem.role_title,
//               option2: editItem.role_band_id
//           };
//       });
//       console.log("optionsObj " + JSON.stringify(optionsObj, null, 4));

//       fetch("http://localhost:3001/clinical_area_select").then(cares => {
//           console.log("editRes.status " + cares.status);
//           if (cares.status === 200) { return cares.json(); }
//           throw `Invalid Query`
//       }).then(caDbres => {
//           console.log("editdbres" + caDbres)
//           caObj = caDbres.map(caEditItem => {

//               return {
//                   type: "Clinical Area",
//                   option1: caEditItem.clinical_area_title,
//               };
//           });

//           combineArr.push(roleObj, caObj);

//           this.setState({
//               options: combineArr
//           })
//           console.log("options " + this.state.options);
//       })
//   }).catch(err => {
//       alert(err);
//   })
// }



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
