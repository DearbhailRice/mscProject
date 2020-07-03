import React, { Component } from 'react'
import { Route } from "react-router-dom";
import "../../styles/navbar/navbar.scss";
import Logo from "../../images/NHSCT.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignInAlt, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const isAdmin = JSON.parse(JSON.stringify(localStorage.getItem("tokens")["isAdmin"]));
        // console.log("is admin " + isAdmin)
        return (
            <div className="navbar">
                <header className="header">
                    <div className="logo">
                        <Route to={'/login'}>
                            <img width="100%" src={Logo} alt="logo" />
                        </Route>
                    </div>
                    <div className="navComponents">
                        <ul>
                            <li>
                                <a onClick={() => { (!localStorage.tokens) ? window.location.href = "/login" : window.location.href = "/logout" }}>
                                    <FontAwesomeIcon icon={faSignInAlt} size="2x" style={{ color: "darkgray" }} />
                                </a>
                            </li>
                            <li>
                                <a onClick={() => { window.location.href = "/personal-profile" }}>
                                    <FontAwesomeIcon icon={faUser} size="2x" style={{ color: "darkgray" }} />
                                </a>
                            </li>
                            <li>
                                <a onClick={() => { window.location.href = "/learning-profile" }}>
                                    <FontAwesomeIcon icon={faGraduationCap} size="2x" style={{ color: "darkgray" }} />
                                </a>
                            </li>

                            <li>
                                {/* <a onClick={() => { (!localStorage.getItem('tokens')['isAdmin']) ? null : hidden }}>
                                    <FontAwesomeIcon icon={faSignInAlt} size="2x" style={{ color: "darkgray" }} />
                                </a> */}
                            </li>

                        </ul>

                    </div>
                </header>
            </div>
        );
    }
}