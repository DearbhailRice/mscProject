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
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const key = "mscProject";
const AES = require('mysql-aes');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

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

app.route("/personal_profile_select:userId").get(function (req, res) {
  console.log("in personal_profile_select router api");
  connection.query(
    "SELECT user_id, user_name, user_email_address,user_start_date, user_bank_staff_number,user_current_trust_employee_in_current_role,contact_details_tel_number, contact_details_personal_email,  contact_details_preffer_personal_email_contact, address_line_1, address_line_2, address_line_3,  address_postcode,address_town, address_county, emergency_contact_details_name, emergency_contact_details_tel_number, emergency_contact_details__relationship,clinical_area_title,role_title,role_band_id FROM user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id WHERE user.user_id = ? ; ",
    req.params.userId,
    function (error, results, feilds) {
      console.log(results)
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
    ` SELECT user_id, user_admin, user_email_address, AES_DECRYPT(password_text,"mscProject" ) FROM user INNER Join password on user_id= password_user_id where user_email_address = ?;`,
    // `SELECT user_id, user_email_address, AES_DECRYPT(password_text,${JSON.stringify(key)}) FROM user INNER Join password on user_id= password_user_id where user_email_address = ?;`,
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

  console.log(`SELECT user_id, user_admin, user_email_address,  AES_Decrypt(password_text,"${key}") FROM user INNER Join password on user_id= password_user_id where user_email_address = "${user_email}" AND  AES_Decrypt(password_text,"${key}")= "${user_password}";`)
  connection.query(
    `SELECT user_id, user_admin, user_email_address,  AES_Decrypt(password_text,"${key}") FROM user INNER Join password on user_id= password_user_id where user_email_address = "${user_email}" AND  AES_Decrypt(password_text,"${key}")= "${user_password}";`,
    user_email,
    function (error, results, feilds) {
      console.log("Error " + error)
      console.log("results ", results)
      if (results < 1) {
        console.log("results<1")
        user_id = results[0].user_id;
        console.log("results < 1 " + results)
        message = "email " + user_email + " or password are incorrect";
      }
      else if (error) {
        console.log("Error " + error)
        throw error;
      }
      else {
        console.log("db results " + JSON.stringify(results))
        console.log(" results.user_email_address " + results[0].user_email_address)
        console.log("userID ", results[0].user_id)
        message = "email and password match";
        isCorrectLogin = true;
        // if ((user_email == results[0].user_email_address) && (user_password == results[0].password_text)) {
        //   message = "email and password match";
        //   isCorrectLogin = true;
        // }
        // else {
        //   message = "username and password do not match";

        // }
        console.log("results[0].user_admin" + results[0].user_admin)
        if (results[0].user_admin === 1) {
          user_admin = true;
          console.log("user_admin" + user_admin)
        } else {
          user_admin = false;
          console.log("user_admin" + user_admin)
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



app.route("/add-user").post(function (req, res) {

  const payload = req.body;

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
  var userAdmin = (payload.data["Admin User Privilages"] == "Yes") ? 1 : 0;
  var curentTrustEmployee = (payload.data["Current Trust Employee"] == "Yes") ? 1 : 0;
  var staffNumber = payload.data["Staff Number"];
  var startDate = payload.data["Start Date"];
  var workEmail = payload.data["Work Email"];

  console.log("api push ", userId)
  console.log("band ", band)
  console.log("role ", role)

  var message = "";

  var responseObj = {};
  connection.query(" select role_id from role where role_band_id = " + band + " AND  role_title= " + JSON.stringify(role) + ";"
    , function (error, roleresults, feilds) {
      if (error) {
        console.log("Error " + error)
        message = "Error update unsucessful " + error;

      }
      let roleId = roleresults[0].role_id;


      console.log(" in api post payload: " + payload)

      console.log("In /inital_password_push api  ")
      console.log("statrt date " + JSON.stringify(startDate));

      connection.query(
        "SELECT user_id, user_email_address FROM `user` where user_email_address =  ?;",
        workEmail,
        function (error, results, feilds) {
          console.log("Error " + error)
          if (results.length > 0) {
            console.log("results >0  " + results);
            user_id = results[0].user_id;
            message = "email " + workEmail + "email address alread exists in database";
            resetEmailSent = false;
            responseObj = {
              user_id: user_id,
              message: message,
              resetEmailSent: resetEmailSent
            }
            console.log("returning before creating duplicate user ", responseObj)
            return responseObj;
          }
          else if (error) {
            console.log("Error " + error)
            throw error;
          }

          connection.query(
            `INSERT INTO msc_project.user (user_id, user_name, user_email_address, user_start_date, user_bank_staff_number, user_current_trust_employee_in_current_role, user_role_id_fk,user_admin) VALUES (NULL, ${name}, ${workEmail} ,${startDate} , ${staffNumber}, ${curentTrustEmployee},${roleId}, ${userAdmin});`,

            function (error, results, feilds) {
              if (error) {
                console.log("Error " + error)
                throw error;
              }
              connection.query(
                "SELECT user_id FROM `user` where user_email_address =  ?;",
                workEmail,
                function (error, results, feilds) {
                  console.log("Error " + error)

                  if (results < 1) {
                    console.log("results < 1 " + results)
                    message = "email " + workEmail + "does not match an existing user";

                  }
                  else if (error) {
                    console.log("Error " + error)
                    throw error;
                  }
                  else {
                    console.log(results)
                    console.log("db results " + JSON.stringify(results))
                    console.log(" results.user_email_address " + results[0].user_email_address)



                    const token = Crypto.randomBytes(20).toString("hex");
                    const userId = results[0].user_id;

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
                      to: workEmail,
                      subject: "password reset request for Northern HSCT e-learning platform  ",
                      text:
                        "an account has been created for you, please follow the link bellow to create a password for you account \n\n" +
                        "http://localhost:3000/reset/" + token + "/" + userId + "\n\n" +
                        "Please complete your porfile at your earliest convience  "
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


                    responseObj = {
                      user_id: user_id,
                      message: message,
                      resetEmailSent: resetEmailSent
                    }
                    console.log(JSON.stringify(responseObj));
                    return responseObj
                  };

                });
            });

        });

    });
  if (responseObj != -{}) {
    res.json(responseObj)
  }
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
          const userId = results[0].user_id;

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
})


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

});


app.route("/personal-profile-add").post(async function (req, res) {

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
  var contactPersonalEmail = (payload.data["Contact on Personal Email"] == "Yes") ? 1 : 0;
  var county = payload.data["County"];
  var curentTrustEmployee = (payload.data["Current Trust Employee"] == "Yes") ? 1 : 0;
  var emergencyConName = payload.data["Emergency Contact Name"];
  var emergencyConRelationship = payload.data["Emergency Contact Relationship"];
  var emergencyConTel = payload.data["Emergency Contact Tel. Number"];
  var personalEmail = payload.data["Personal Email"];
  var postcode = payload.data["Postcode"];
  var telNum = payload.data["Tel. Number"];
  var town = payload.data["Town"];
  console.log("api push ", userId)
  console.log("band ", band)
  console.log("role ", role)

  var message = "";
  var sucessfulAdd = false;

  connection.query(" select role_id from role where role_band_id = " + band + " AND  role_title= " + JSON.stringify(role) + ";"
    , function (error, roleresults, feilds) {
      if (error) {
        console.log("Error " + error)
        message = "Error update unsucessful " + error;

      }
      let roleId = roleresults[0].role_id;

      console.log("ROLE ID ", roleId)
      connection.query("select clinical_area_id from clinical_area where clinical_area_title = " + JSON.stringify(clinicalArea) + ";"
        , function (error, caresults, feilds) {
          if (error) {
            console.log("Error " + error)
            message = "Error update unsucessful " + error;

          }
          let clinicalAreaId = caresults[0].clinical_area_id;



          console.log("roleId ", roleId)
          console.log("clinicalAreaId", clinicalAreaId)
          console.log("UPDATE `msc_project`.`user` SET  user_name= " + JSON.stringify(name) + ", user_current_trust_employee_in_current_role=" + curentTrustEmployee + ", user_role_id_fk= " + roleId + "  WHERE user_id = " + userId + ";"
            + " INSERT INTO address (address_user_id , address_line_1 , address_line_2 , address_line_3, address_postcode, address_town , address_county )"
            + " VALUES(" + userId + ", " + JSON.stringify(address1) + ", " + JSON.stringify(address2) + ", " + JSON.stringify(address3) + ", " + JSON.stringify(postcode) + ", " + JSON.stringify(town) + "," + JSON.stringify(county) + " );"

            + "SELECT @addressId:=address_id From address WHERE address_user_id=" + userId + ";"

            + "INSERT INTO contact_details (contact_details_user_id ,contact_details_tel_number ,contact_details_personal_email ,contact_details_preffer_personal_email_contact ,contact_details_address_id )"
            + " VALUES (" + userId + "," + JSON.stringify(telNum) + ", " + JSON.stringify(personalEmail) + "," + contactPersonalEmail + ",@addressId);"

            + "INSERT INTO emergency_contact_details (emergency_contact_details_user_id ,emergency_contact_details_name, emergency_contact_details_tel_number, emergency_contact_details__relationship)"
            + "VALUES(" + userId + ", " + JSON.stringify(emergencyConName) + "," + JSON.stringify(emergencyConTel) + ", " + JSON.stringify(emergencyConRelationship) + " );"

            + " INSERT INTO clinical_area_to_user_lookup (clinical_area_to_user_lookup_clinical_area_id, clinical_area_to_user_lookup_user_id )"
            + " VALUES(" + roleId + "," + userId + ");")



          connection.query(" UPDATE `msc_project`.`user` SET  user_name= " + JSON.stringify(name) + ", user_current_trust_employee_in_current_role=" + curentTrustEmployee + ", user_role_id_fk= " + roleId + "  WHERE user_id = " + userId + ";"
            + " INSERT INTO address (address_user_id , address_line_1 , address_line_2 , address_line_3, address_postcode, address_town , address_county )"
            + " VALUES(" + userId + ", " + JSON.stringify(address1) + ", " + JSON.stringify(address2) + ", " + JSON.stringify(address3) + ", " + JSON.stringify(postcode) + ", " + JSON.stringify(town) + "," + JSON.stringify(county) + " );"

            + "SELECT @addressId:=address_id From address WHERE address_user_id=" + userId + ";"

            + "INSERT INTO contact_details (contact_details_user_id ,contact_details_tel_number ,contact_details_personal_email ,contact_details_preffer_personal_email_contact ,contact_details_address_id )"
            + " VALUES (" + userId + "," + JSON.stringify(telNum) + ", " + JSON.stringify(personalEmail) + "," + contactPersonalEmail + ",@addressId);"

            + "INSERT INTO emergency_contact_details (emergency_contact_details_user_id ,emergency_contact_details_name, emergency_contact_details_tel_number, emergency_contact_details__relationship)"
            + "VALUES(" + userId + ", " + JSON.stringify(emergencyConName) + "," + JSON.stringify(emergencyConTel) + ", " + JSON.stringify(emergencyConRelationship) + " );"

            + " INSERT INTO clinical_area_to_user_lookup (clinical_area_to_user_lookup_clinical_area_id, clinical_area_to_user_lookup_user_id )"
            + " VALUES(" + roleId + "," + userId + ");"

            , function (error, results, feilds) {
              if (error) {
                // connection.query("ROLLBACK")
                console.log("Error " + error)
                message = "Error update unsucessful " + error;
              } else {
                message = "update sucessful"
                sucessfulAdd = true;
              }
              const responseObj = {
                userId: userId,
                message: message,
                sucessfulAdd: sucessfulAdd
              }
              console.log(JSON.stringify(responseObj));
              return res.json(responseObj)
            });
        });
    });
});


app.route("/reset_password_push").post(function (req, res) {

  const payload = req.body;
  let passwordReset = false;
  let message = "";
  console.log("payload data ", payload.data)
  console.log("payload.userId " + payload.userId)
  var userId = payload.userId;
  var password = payload.data["password1"];

  connection.query(`SELECT *, AES_Decrypt(password_text,"${key}" ) FROM password WHERE password.password_user_id =  ${userId};`
    , function (error, results, feilds) {
      // console.log(results.length + " results ")
      if (error) {
        console.log("Error " + error)
        message = error;
      } else if (results.length === 0) {
        console.log("No user in password table ")
        //Insert INTO password (password_text,password_user_id) VALUES (AES_ENCRYPT("password", "mscProject"), 1)
        //Insert INTO password (password_text,password_user_id) VALUES ("${password}", "${key}"), ${userId})
        connection.query(`Insert INTO password (password_text,password_user_id) VALUES (AES_ENCRYPT("${password}", "${key}"), ${userId});`
          // `INSERT INTO msc_project.password (password_id, password_user_id, password_text, password_previous_text, password_date) VALUES (NULL, ${userId} , AES_ENCRYPT("${password}", "${key}") , NULL, NULL);`
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
            return res.json(responseObj)

          })
      } else {
        console.log("in else update password")
        connection.query(`UPDATE msc_project.password SET password_text =   AES_ENCRYPT("${password}", "${key}")  WHERE password.password_user_id =  ${userId};`
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
            return res.json(responseObj)

          })
      }

    })
})


app.route("/training-select").get(function (req, res) {
  console.log("in  router api")
  connection.query(
    "SELECT * FROM `training` ",
    function (error, results) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.route("/training_disable:userId").get(function (req, res) {
  connection.query(
    "SELECT learning_profile_training_id FROM learning_profile INNER JOIN training on learning_profile_training_id = training.training_id INNER JOIN user on learning_profile_user_id = user.user_id WHERE user_id= ?; ",
    req.params.userId,
    function (error, results) {
      if (error) { throw error }
      else if (results.length > 0) {
        console.log("results >0  " + results);
      }
      res.json(results);
    });
});




app.route("/learning_profile_add").post(function (req, res) {
  const payload = req.body;
  var userId = payload.user;
  var trainingId = payload.trainingId;
  let message = "";

  console.log("in  else ")
  connection.query(
    `INSERT INTO msc_project.learning_profile (learning_profile_id, learning_profile_training_id, learning_profile_user_id, learning_profile_date_completed, learning_profile_certificate_path) VALUES (NULL,${trainingId}, ${userId} ,NULL, NULL); `,
    function (error, results) {
      if (error) throw error;
      message = "Added "

      const responseObj = {
        message: message,

      }
      console.log(responseObj)
      return res.json(responseObj)

    });
});

app.post('/uploadfile', upload.single('uploadFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)

})



app.post('/learning_profile_edit', upload.single('Certificate Upload'), (req, res) => {

  const payload = req.body;
  var userId = payload.userId;
  var trainingId = payload.trainingId;
  var trainingDateComplete = payload.data["Completion Date"];
  var fileName = payload.data["Certificate Upload"];
  console.log("FileName", fileName)
  let message = "";
  let sucessfulEdit = false;



  console.log(`UPDATE msc_project.learning_profile SET learning_profile_certificate_path='${fileName}',learning_profile_date_completed=' ${trainingDateComplete}' WHERE learning_profile.learning_profile_training_id= ${trainingId} AND learning_profile.learning_profile_user_id= ${userId}`)
  connection.query(`UPDATE msc_project.learning_profile SET learning_profile_certificate_path='${fileName}',learning_profile_date_completed= STR_TO_DATE('${trainingDateComplete}', '%Y-%m-%d') WHERE learning_profile.learning_profile_training_id= ${trainingId} AND learning_profile.learning_profile_user_id= ${userId};`
    , function (error, results) {
      if (error) {
        message = "error occured  "
        sucessfulEdit = false;
        throw error
      };
      message = "Added "
      sucessfulEdit = true;

      const responseObj = {
        message: message,
        sucessfulEdit: sucessfulEdit
      }
      console.log("response obj ", responseObj)
      return res.json(responseObj)
    })
})

app.route("/training-add").post(async function (req, res) {

  const payload = req.body;
  console.log("payload data ", payload.data)
  console.log("payload.userId " + payload.userId)
  var userId = payload.userId;
  var message = "";
  var sucessfulAdd = false;
  var trainingTitle = payload.data["Training Title"];
  var trainingVersionNum = payload.data["Version Number"];
  var trainingRevalNum = payload.data["Valid for (years)"];
  var trainingf2f = (payload.data["Face to face Course"] == "Yes") ? 1 : 0;
  var trainingManditory = (payload.data["Mandatory"] == "Yes") ? 1 : 0;
  var trainingDuration = payload.data["Duration"];
  var trainingDate = payload.data["Training Version Release Date"];
  //strip slashes 
  //sql injection 
  //string interpulation 
  console.log("api push ", userId)

  connection.query(
    `SELECT * FROM training	 WHERE training_title= '${trainingTitle}' AND training_version_number=${trainingVersionNum} ;`,
    req.params.userId,
    function (error, results) {

      if (error) throw error;

      if (results.length > 0) {
        const responseObj = {
          userId: userId,
          message: "Traing with the same Name and version number exists in database ",
          sucessfulAdd: false
        }
        return res.json(responseObj)
      }

      connection.query(`INSERT INTO msc_project.training (training_id, training_title, training_revalidation_period_years,training_course_face_to_face, training_mandatory, training_version_number, training_version_release_date, training_duration) VALUES (NULL,  '${trainingTitle}' ,${trainingRevalNum}, ${trainingf2f}, ${trainingManditory}, ${trainingVersionNum}, ${trainingDate},'${trainingDuration}');`

        , function (error, results) {
          if (error) throw error;

          message = "Training sucessfully added ",
            sucessfulAdd = true
        })



      const responseObj = {

        message: message,
        sucessfulAdd: sucessfulAdd
      }
      console.log(JSON.stringify(responseObj));
      return res.json(responseObj)
    });
});

app.route("/learning-profile-delete").delete(function (req, res) {

  console.log("In learning-profile-delete")

  const payload = req.body;
  console.log("payload data ", payload.data)
  console.log("payload.userId " + payload.userId)
  var userId = payload.userId;
  var message = "";
  var trainingId = payload.trainingId;

  connection.query(`DELETE FROM msc_project.learning_profile WHERE learning_profile_training_id=${trainingId} AND learning_profile_user_id=${userId}`
    , function (error, results) {
      if (error) throw error;

      message = "Learning Profile training record Deleted "

      const responseObj = {
        message: message,
      }
      console.log(JSON.stringify(responseObj));
      return res.json(responseObj)

    });
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
