import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentTitle: "Welcome"
        }
    }

    render() {
        return (
            <div className="personalProfile" >
                <Navbar />
                {console.log("on personal-profile edit page ")}
                <div className="personalProfileContent">
                    <div className="wrapperDiv">
                        <div>
                            <div>
                                <h2 className="welcomeTitle">{this.state.componentTitle} </h2>
                            </div>
                            <div className="welcomeText">
                                <p> Welcome to the Northern Health and Social Care Trusts Statutory and Mandatory training tracker for bank nursing staff
                                This resource is intended to help Nursing staff track their Statutory and Mandatory training to aid the completion and recording of individulas CPD.
                            </p>
                                <p>Bank Office Contact </p>
                                <p>phone number: 028908762462</p>
                                <p> email: bankOffice@northerntrust.hscni.net</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}