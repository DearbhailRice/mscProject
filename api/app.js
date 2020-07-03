var Crypto = require('crypto');
require("dotenv").config();
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
const nodemailer = require("nodemailer");

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

app.route("/learning-profile-select:userId").get(function (req, res) {
  console.log("in  router api");
  connection.query(
    "SELECT * FROM learning_profile INNER JOIN training on learning_profile.learning_profile_training_id= training.training_id INNER JOIN user on learning_profile_user_id = user.user_id	 WHERE learning_profile.learning_profile_user_id= ? ; ",
    req.params.userId,
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
    "SELECT user_id, user_name, user_email_address,user_start_date, user_bank_staff_number,user_current_trust_employee_in_current_role,contact_details_tel_number, contact_details_personal_email,  contact_details_preffer_personal_email_contact, address_line_1, address_line_2, address_line_3,  address_postcode,address_town, address_county, emergency_contact_details_name, emergency_contact_details_tel_number, emergency_contact_details__relationship,clinical_area_title,role_title,role_band_id FROM user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id WHERE user.user_id = ? ; ",
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
  var user_admin = false;
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
        if (results[0].user_admin === 1) {
          user_admin = true;
        } else {
          user_admin = false;
        }
      }
      const responseObj = {
        user_id: user_id,
        isAdmin: user_admin,
        message: message,
        isCorrectLogin: isCorrectLogin
      }
      console.log(JSON.stringify(responseObj));
      return res.json(responseObj)
    });

});



app.route("/forgottenPassword_push").post(function (req, res) {

  const payload = req.body;

  console.log(" in api post payload: " + payload)
  console.log("email " + payload.user_email)
  console.log("password" + payload.user_password)

  console.log("In /forgottenPassword_push api push  ")

  var user_password = payload.user_password;
  var user_id = 0;
  var message = "";
  var user_email = payload.user_email;
  var resetEmailSent = false;
  console.log("user_email " + user_email)


  connection.query(
    "SELECT user_id, user_email_address FROM `user` where user_email_address =  ?;",
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
        console.log(results)
        console.log("db results " + JSON.stringify(results))
        console.log(" results.user_email_address " + results[0].user_email_address)


        if ((user_email == results[0].user_email_address)) {
          const token = Crypto.randomBytes(20).toString("hex");
          const userId = results[0].user_idVAR;

          console.log("useid " + userId)

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'nhsct.elearm@gmail.com',
              pass: 'mscPassword'
            }
          })

          const mailOptions = {
            from: "nhsct.e-learm@gmail.com",
            to: user_email,
            subject: "password reset request for Northern HSCT e-learning platform  ",
            text:
              "a password reset request has been made for this email if this was you please click the following link: \n\n" +
              "http://localhost:3000/reset/" + token + "/" + userId + "\n\n" +
              "if this reset was not you pklease ignore this email "
          };

          transporter.sendMail(mailOptions, function (err, response) {
            if (err) {
              console.log("mail error: ", err);
            } else {
              console.log("mail response ", response);
              res.status(200).json("recovery email sent ")
            }
          })

          user_id = results[0].user_id;
          message = "email address found, reset email sent";
          resetEmailSent = true;

        }
        const responseObj = {
          user_id: user_id,
          message: message,
          resetEmailSent: resetEmailSent
        }
        console.log(JSON.stringify(responseObj));
        return res.json(responseObj)
      };

    });
});



app.route("/personal-profile-edit").post(function (req, res) {

  const payload = req.body;
  console.log("payload data ", payload.data)
  console.log("payload.userId " + payload.userId)
  var userId = payload.userId;
  var bandRole = payload.data["Role"];
  if (bandRole.includes(",")) {
    var bandRoleArr = bandRole.split(",");
    var role = bandRoleArr[0];
    var band = bandRoleArr[1];
  } else {
    var role = payload.data["Role"];
    var band = payload.data["Band"];
  }
  var name = payload.data["Name"];
  var address1 = payload.data["Address Line 1"];
  var address2 = payload.data["Address Line 2"];
  var address3 = payload.data["Address Line 3"];
  var clinicalArea = payload.data["Clinical Area"];
  var contactPersonalEmail = (payload.data["Contact on Personal Email"] == "Yes") ? 1 : 0;;
  var county = payload.data["County"];
  var curentTrustEmployee = (payload.data["Current Trust Employee"] == "Yes") ? 1 : 0;
  var emergencyConName = payload.data["Emergency Contact Name"];
  var emergencyConRelationship = payload.data["Emergency Contact Relationship"];
  var emergencyConTel = payload.data["Emergency Contact Tel. Number"];
  var personalEmail = payload.data["Personal Email"];
  var postcode = payload.data["Postcode"];
  var staffNumber = payload.data["Staff Number"];
  var startDate = payload.data["Tel. Number"];
  var telNum = payload.data["Tel. Number"];
  var town = payload.data["Town"];
  var workEmail = payload.data["Work Email"];
  console.log("api push ", userId)
  console.log("band ", band)
  console.log("role ", role)

  var message = "";
  var sucessfulEdit = false;

  connection.query(" select role_id from role where role_band_id = " + band + " AND  role_title= " + JSON.stringify(role) + ";"
    , function (error, roleresults, feilds) {
      if (error) {
        console.log("Error " + error)
        message = "Error update unsucessful " + error;

      }
      let roleId = roleresults[0].role_id;


      connection.query("select clinical_area_id from clinical_area where clinical_area_title = " + JSON.stringify(clinicalArea) + ";"
        , function (error, caresults, feilds) {
          if (error) {
            console.log("Error " + error)
            message = "Error update unsucessful " + error;

          }
          let clinicalAreaId = caresults[0].clinical_area_id;


          console.log("roleId ", roleId)
          console.log("clinicalAreaId", clinicalAreaId)
          // console.log("UPDATE msc_project.user user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id "
          //   + "SET user_name = " + name + ",user_email_address =" + workEmail + ",user_start_date= " + startDate + ", user_bank_staff_number=" + staffNumber
          //   + " ,user_current_trust_employee_in_current_role=" + curentTrustEmployee + ",contact_details_tel_number= " + telNum
          //   + ",contact_details_personal_email=" + personalEmail + ",contact_details_preffer_personal_email_contact=" + contactPersonalEmail + ",address_line_1= " + address1
          //   + ",address_line_2=" + address2 + ",address_line_3=" + address3 + ", address_postcode=" + postcode + ",address_town=" + town
          //   + ",address_county=" + county + ", emergency_contact_details_name=" + emergencyConName + ",emergency_contact_details_tel_number=" + emergencyConTel
          //   + ",emergency_contact_details__relationship=" + emergencyConRelationship + ",user_role_id_fk =" + roleId + ",clinical_area_to_user_lookup_clinical_area_id=" +
          //   clinicalAreaId + "  WHERE `user`.`user_id` = " + userId + ";",
          // )
          // 
          connection.query("UPDATE msc_project.user user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id "
            + "SET user_name = " + JSON.stringify(name) + ",user_email_address =" + JSON.stringify(workEmail) + ",user_start_date= " + startDate + ", user_bank_staff_number=" + staffNumber
            + " ,user_current_trust_employee_in_current_role=" + curentTrustEmployee + ",contact_details_tel_number= " + JSON.stringify(telNum)
            + ",contact_details_personal_email=" + JSON.stringify(personalEmail) + ",contact_details_preffer_personal_email_contact=" + contactPersonalEmail + ",address_line_1= " + JSON.stringify(address1)
            + ",address_line_2=" + JSON.stringify(address2) + ",address_line_3=" + JSON.stringify(address3) + ", address_postcode=" + JSON.stringify(postcode) + ",address_town=" + JSON.stringify(town)
            + ",address_county=" + JSON.stringify(county) + ", emergency_contact_details_name=" + JSON.stringify(emergencyConName) + ",emergency_contact_details_tel_number=" + JSON.stringify(emergencyConTel)
            + ",emergency_contact_details__relationship=" + JSON.stringify(emergencyConRelationship) + ",user_role_id_fk =" + roleId + ",clinical_area_to_user_lookup_clinical_area_id=" +
            clinicalAreaId + "  WHERE `user`.`user_id` = " + userId + ";",
            function (error, results, feilds) {
              if (error) {
                console.log("Error " + error)
                message = "Error update unsucessful " + error;
              } else {
                message = "update sucessful"
                sucessfulEdit = true;
              }
              const responseObj = {
                message: message,
                sucessfulEdit: sucessfulEdit
              }
              console.log(JSON.stringify(responseObj));
              return res.json(responseObj)
            });
        });
    });


  // connection.query("UPDATE msc_project.user user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id SET user_name = 'testUser1',user_email_address ='updateuesremail@email.com',user_start_date= 01/01/01, user_bank_staff_number=123 ,user_current_trust_employee_in_current_role= 1,contact_details_tel_number= '098765432',contact_details_personal_email='personalemailupdated@email',contact_details_preffer_personal_email_contact= 1,address_line_1= 'updated address',address_line_2='updatedline2',address_line_3='updated line 2', address_postcode='posctcodeupdate',address_town='updateTown',address_county='updatedconty', emergency_contact_details_name='updated emergency contactname',emergency_contact_details_tel_number='1234567999',emergency_contact_details__relationship='updated relationship',user_role_id_fk = 1,clinical_area_to_user_lookup_clinical_area_id=1  WHERE `user`.`user_id` = 1;",
  //   payload.userId,
  //   function (error, results, feilds) {
  //     if (error) {
  //       console.log("Error " + error)
  //       throw error;
  //     }
  //     const responseObj = {
  //       message: "got a response "
  //     }
  //     console.log(JSON.stringify(responseObj));
  //     return res.json(responseObj)
  //   });
});


// app.route("/add_user").post(function (req, res) {
//   const payload = req.body;

//   console.log("payload data ", payload.data)
//   console.log("payload.userId " + payload.userId)

//   var band = payload.data["Band"];
//   var role = payload.data["Role"];
//   var name = payload.data["Name"];
//   var curentTrustEmployee = (payload.data["Current Trust Employee"] == "Yes") ? 1 : 0;
//   var staffNumber = payload.data["Staff Number"];
//   var startDate = payload.data["Tel. Number"];
//   var workEmail = payload.data["Work Email"];
//   var password = payload.data["Password"];
//   var date = Date.now;
//   console.log("date ", date)

//   //"+JSON.stringify()+"
//   connection.query(" select role_id from role where role_band_id = " + band + " AND  role_title= " + JSON.stringify(role) + ";"
//     , function (error, roleresults, feilds) {
//       if (error) {
//         console.log("Error " + error)
//         throw error;
//       }
//       let roleId = roleresults[0].role_id;


//       connection.query("INSERT INTO `msc_project`.`user` (`user_id`, `user_name`, `user_email_address`, `user_start_date`, `user_bank_staff_number`, `user_current_trust_employee_in_current_role`, `user_role_id_fk`) VALUES (NULL, " + JSON.stringify(name) + ", " + JSON.stringify(workEmail) + ", " + JSON.stringify(startDate) + ", " + JSON.stringify(staffNumber) + ", " + curentTrustEmployee + ", " + roleId + ");"
//         , function (error, roleresults, feilds) {
//           if (error) {
//             console.log("Error " + error)
//             throw error;
//           }

//           connection.query("SELECT user_id FROM `user`  where user_email_address = " + workEmail + ";",
//             function (error, roleresults, feilds) {
//               if (error) {
//                 console.log("Error " + error)
//                 throw error;
//               }
//               let userId = roleresults[0].user_id;

//               connection.query("INSERT INTO `msc_project`.`password` (`password_id`, `password_user_id`, `password_text`, `password_previous_text`, `password_date`) VALUES (NULL, " + userId + ", " + JSON.stringify(password) + ", null , " + date + ");"
//                 , function (error, roleresults, feilds) {
//                   if (error) {
//                     console.log("Error " + error)
//                     throw error;
//                   }
//                   const responseObj = {
//                     message: "got a response "
//                   }

//                   return res.json(responseObj)
//                 });
//             });
//         });
//     });

// }

app.route("/reset_password_push").post(function (req, res) {

  const payload = req.body;
  let passwordReset = false;
  let message = "";
  console.log("payload data ", payload.data)
  console.log("payload.userId " + payload.userId)
  var userId = payload.userId;
  var password = payload.data["password1"];

  connection.query("UPDATE `msc_project`.`password` SET `password_text` = " + JSON.stringify(password) + " WHERE `password`.`password_user_id` = " + userId + ";"
    , function (error, caresults, feilds) {
      if (error) {
        console.log("Error " + error)
        message = error;
      } else {
        message = "Update Sucessful! Please login with new password"
        passwordReset = true;
      }

      const responseObj = {
        message: message,
        passwordReset: passwordReset
      }
      res.json(responseObj)

    })
})


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
