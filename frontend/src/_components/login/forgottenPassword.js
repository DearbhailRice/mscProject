import React, { Component } from "react";
import Navbar from "../navbar";
import "../../styles/personalProfile/personalProfile.scss"
import PersonalInfo from "../personalInfo";
import { useAuth } from "../../context/auth";

export default class forgottenPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {

    }
    render() {
        return (
            <div className="forgottenPassword" >
                {console.log("on forgottenPassword page ")}
                < Navbar />


            </div>
        )
    }



}