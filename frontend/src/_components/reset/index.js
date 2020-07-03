import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Navbar from "../navbar";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "../../styles/login/forgottenPassword.scss"
import { useAuth } from "../../context/auth";


function Reset(props) {

    let redirectVar = "/login";
    // const [isLoggedIn, setLoggedIn] = useState(false);
    let [isError, setIsError] = useState(false);
    let [password, setPassword] = useState({});
    let [error, setError] = useState({});
    // let [userID, setUser] = useState(0);
    // const { setAuthTokens } = useAuth();
    const { state } = props.location;
    const referer = (state) ? props.location.state.referer || redirectVar : redirectVar;

    const { token } = props.match.params;
    const userId = props.match.params.userId;

    console.log(token);
    console.log(userId);

    let resetRes = {};

    const handleChange = e => {


        let passwordObj = password;
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})(?!=.*['  *'])");
        var message = "";

        // password validatiopn here
        if (e.target.name == "password1") {


            if (strongRegex.test(e.target.value)) {
                message = "Strong password"
                setError({})
                setIsError(false)
            } else if (mediumRegex.test(e.target.value)) {
                message = "Reasonable password"
                setError({})
                setIsError(false)
            } else {
                message = "Weak password"
                setIsError(true);
                setError({ "password1": "password is too weak add at least one lowercase and capital letter, one number and one sepecial character !@#$%^&*" })
            }

            console.log("isError ", isError)
            console.log("message" + message)

        }

        passwordObj[e.target.name] = e.target.value;
        setPassword(passwordObj)
        console.log("password ", password)

        if (e.target.name == "password2") {
            if (e.target.value != password.password1) {
                // message= "passwords do not match"
                // debugger
                setIsError(true);
                setError({ "password2": "passwords do not match" })
            } else if (e.target.name == "password2") {
                setError({});
                setIsError(false);
            }
        }
    }


    const handleSubmit = event => {

        console.log("Handle submit ", event);
        var userId = props.match.params.userId;
        var data = password;
        const requestOptions =
        {
            method: 'POST',
            url: 'http://localhost:3001/reset_password_push',
            body:
                JSON.stringify({
                    userId,
                    data
                }),

            headers: {

                'Content-Type': 'application/json',
            },
        }
        fetch('http://localhost:3001/reset_password_push',
            requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log("/login push response " + JSON.stringify(data))

                resetRes = {
                    passwordReset: data.passwordReset,
                    message: data.message,
                }

                return resetRes;
            }).catch(e => {
                setIsError(true);
            });

        setTimeout(() => {
            alert(JSON.stringify(resetRes, null, 2));
            console.log("resetRes.passwordReset", resetRes.passwordReset)
            if (resetRes.passwordReset) {
                window.location.href = "/login"
            }
            // setSubmitting(false);
        }, 400)

    }

    return (
        <div className="forgottenPasswordPage" >

            {console.log("on forgottenPassword page ")}
            < Navbar />

            <div className="forgottenPasswordComponent">
                <div className="forgottenPasswordTitle">
                    <h1>Reset  Password</h1>
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


                    >


                        <div className="forgottenPassword-div">
                            <Form className="forgottenPasswordForm">
                                {/* stack div  */}
                                <Field className="resetPasswordElement" type="password" name="password1" placeholder="password" onChange={handleChange} />
                                {error.password1 && <div>{error.password1}</div>}
                                {/* boolean short hand  */}
                                <Field className="resetPasswordElement" type="password" name="password2" placeholder="password" onChange={handleChange} />
                                {error.password2 && <div>{error.password2}</div>}


                                <button type="submit"
                                    disabled={isError}
                                    onClick={handleSubmit}>
                                    Reset
                                 </button>

                            </Form>

                        </div>



                    </Formik>
                </div>

            </div>
        </div >
    )


}
export default Reset;