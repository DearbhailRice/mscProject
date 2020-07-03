import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "../../styles/login/forgottenPassword.scss"
import { useAuth } from "../../context/auth";





function ForgottenPassword(props) {
    let redirectVar = "/login";
    // const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    // const { setAuthTokens } = useAuth();
    const { state } = props.location;
    const referer = (state) ? props.location.state.referer || redirectVar : redirectVar;


    let forgottenPasswordRes = {};


    return (
        <div className="forgottenPasswordPage" >

            {console.log("on forgottenPassword page ")}
            < Navbar />

            <div className="forgottenPasswordComponent">
                <div className="forgottenPasswordTitle">
                    <h1>Forgot  Password</h1>
                </div>

                <div className="forgottenPasswordForm">

                    <Formik

                        initialValues={{ email: '', password: '' }}

                        validate={values => {
                            const errors = {};
                            if (!values.email) {
                                errors.email = 'Email Required';
                            } else if (
                                !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values.email)
                            ) {
                                errors.email = 'Invalid email address';
                            }
                            return errors;
                        }}


                        onSubmit={(values, { setSubmitting }) => {



                            const user_email = values.email;
                            const user_password = values.password;
                            console.log("user_email frontend " + user_email);
                            console.log("user_password frontend " + user_password);

                            const requestOptions =
                            {
                                method: 'POST',
                                url: 'http://localhost:3001/forgottenPassword_push',
                                body: JSON.stringify({
                                    user_email,
                                    user_password
                                }),
                                headers: {

                                    'Content-Type': 'application/json',
                                },
                            }


                            fetch('http://localhost:3001/forgottenPassword_push',
                                requestOptions)
                                .then(res => res.json())
                                .then(data => {
                                    console.log("/forgottenPassword push response " + JSON.stringify(data))

                                    forgottenPasswordRes = {
                                        user_id: data.user_id,
                                        message: data.message,
                                        isCorrectforgottenPassword: data.isCorrectforgottenPassword
                                        //return user admin type return user object name, email admintype, get this .state.current user
                                    }
                                    console.log("forgottenPasswordRes.isCorrectforgottenPassword " + JSON.stringify(forgottenPasswordRes.isCorrectforgottenPassword))
                                    if (forgottenPasswordRes.isCorrectforgottenPassword) {

                                    } else {
                                        console.log("authentication error");

                                    }
                                    return forgottenPasswordRes;
                                }).catch(e => {
                                    setIsError(true);
                                });

                            setTimeout(() => {
                                alert(JSON.stringify(forgottenPasswordRes, null, 2));
                                setSubmitting(false);
                            }, 400)

                        }



                        }
                    >

                        {({ isSubmitting }) => (
                            <div className="forgottenPassword-div">
                                <Form className="forgottenPasswordForm">

                                    <Field className="forgottenPasswordElement" type="email" name="email" placeholder="email" />
                                    <ErrorMessage name="email" component="div" />

                                    <button type="submit" disabled={isSubmitting}>
                                        Send Email
                                 </button>

                                </Form>

                            </div>
                        )}


                    </Formik>
                </div>

            </div>
        </div >
    )

}
export default ForgottenPassword;

