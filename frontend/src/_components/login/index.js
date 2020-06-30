import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "../../styles/login/login.scss"
import { useAuth } from "../../context/auth";





function Login(props) {
    let redirectVar = "/personal-profile";
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const { setAuthTokens } = useAuth();
    const { state } = props.location;
    const referer = (state) ? props.location.state.referer || redirectVar : redirectVar;


    let loginRes = {};

    if (isLoggedIn) {
        return <Redirect to={referer} />;
    }


    return (
        <div className="loginPage" >

            {console.log("on login page ")}
            < Navbar />

            <div className="loginComponent">
                <div className="loginTitle">
                    <h1>Login</h1>
                </div>

                <div className="loginForm">

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


                            if (!values.password) {
                                errors.password = "Password Required";
                            } else if (values.password.length < 8 || values.password.length > 16) {
                                var message = "";
                                if (values.password.length < 8) {
                                    message = "passwords must be at least 8 characters in length"
                                } else {
                                    message = "passords must be less than 16 characters in length"
                                }
                                errors.password = message
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
                                url: 'http://localhost:3001/login_push',
                                body: JSON.stringify({
                                    user_email,
                                    user_password
                                }),
                                headers: {

                                    'Content-Type': 'application/json',
                                },
                            }


                            fetch('http://localhost:3001/login_push',
                                requestOptions)
                                .then(res => res.json())
                                .then(data => {
                                    console.log("/login push response " + JSON.stringify(data))

                                    loginRes = {
                                        user_id: data.user_id,
                                        message: data.message,
                                        isCorrectLogin: data.isCorrectLogin
                                        //return user admin type return user object name, email admintype, get this .state.current user
                                    }
                                    console.log("loginRes.isCorrectLogin " + JSON.stringify(loginRes.isCorrectLogin))
                                    if (loginRes.isCorrectLogin) {
                                        console.log("autehntication tokens set")
                                        console.log("this.loginRes " + JSON.stringify(loginRes.message))

                                        setAuthTokens(loginRes);
                                        console.log("setAuthTokens " + setAuthTokens)
                                        setLoggedIn(true);
                                    } else {
                                        console.log("authentication error");
                                        setIsError(true);
                                    }
                                    return loginRes;
                                }).catch(e => {
                                    setIsError(true);
                                });

                            setTimeout(() => {
                                alert(JSON.stringify(loginRes, null, 2));
                                setSubmitting(false);
                            }, 400)

                        }



                        }
                    >

                        {({ isSubmitting }) => (
                            <div className="login-div">
                                <Form className="loginForm">

                                    <Field className="loginElement" type="email" name="email" placeholder="email" />
                                    <ErrorMessage name="email" component="div" />
                                    <Field className="loginElement" type="password" name="password" placeholder="password" />
                                    <ErrorMessage name="password" component="div" />
                                    <button type="submit" disabled={isSubmitting}>
                                        Login
                                 </button>

                                </Form>
                                <Link to="/forgotPassword">Forgotten your password?</Link>
                                {/* {console.log("loginRes.message " + this.loginRes.message)}
                                {isError && <p>{loginRes.message}</p>} */}
                            </div>
                        )}


                    </Formik>
                </div>

            </div>
        </div >
    )

}
export default Login;

