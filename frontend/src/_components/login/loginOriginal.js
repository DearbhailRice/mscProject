// import React, { Component, useState } from "react";
// // import { Link, Redirect } from "react-router-dom";
// import Navbar from "../../components/navbar";
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import "../../styles/login/login.scss"
// // import { useAuth } from "../../context/auth";

// export default class login extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         }
//     }

//     componentWillMount() {

//     }


//     render() {

//         // const [isLoggedIn, setLoggedIn] = useState(false);
//         // const [isError, setIsError] = useState(false);
//         // const [userName, setUserName] = useState("");
//         // const [password, setPassword] = useState("");
//         // const { setAuthTokens } = useAuth();

//         return (
//             <div className="loginPage">

//                 {console.log("on login page ")}
//                 <Navbar />

//                 <div className="loginComponent">
//                     <div className="loginTitle">
//                         <h1>Login</h1>
//                     </div>
//                     <div className="loginForm">
//                         <Formik
//                             initialValues={{ email: '', password: '' }}

//                             validate={values => {
//                                 const errors = {};
//                                 if (!values.email) {
//                                     errors.email = 'Email Required';
//                                 } else if (
//                                     !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values.email)
//                                 ) {
//                                     errors.email = 'Invalid email address';
//                                 } else if (!(values.email.contains("@northerntrust.hscni.net")) || !(values.email.contains("@qub.ac.uk"))) {
//                                     errors.email = 'email address must end @northerntrust.hscni.net or @qub.ac.uk ';
//                                 }

//                                 if (!values.password) {
//                                     errors.password = "Password Required";
//                                 } else if (values.password.length <= 8 || values.password.length > 16) {
//                                     var message = "";
//                                     if (values.password.length < 8) {
//                                         message = "passwords must be at least 8 characters in length"
//                                     } else {
//                                         message = "passords must be less than 16 characters in length"
//                                     }
//                                     errors.password = message
//                                 }
//                                 return errors;
//                             }}

//                             onSubmit={(values, { setSubmitting }) => {
//                                 setTimeout(() => {
//                                     alert(JSON.stringify(values, null, 2));
//                                     setSubmitting(false);
//                                 }, 400);
//                             }}


//                         >
//                             {({ isSubmitting }) => (
//                                 <Form className="loginForm">

//                                     <Field className="loginElement" type="email" name="email" placeholder="email" />
//                                     <ErrorMessage name="email" component="div" />
//                                     <Field className="loginElement" type="password" name="password" placeholder="password" />
//                                     <ErrorMessage name="password" component="div" />
//                                     <button type="submit" disabled={isSubmitting}>
//                                         Login
//                                  </button>
//                                 </Form>
//                             )}
//                         </Formik>
//                     </div>

//                 </div>
//                 {/* authenticationService.login(username, password) */}
//             </div>
//         )
//     }
// }