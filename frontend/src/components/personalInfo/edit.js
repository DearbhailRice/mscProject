import React, { Component } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHeader: this.props.columnHeader,

            formElementLable: ["Name", "Work Email", "Start Date", "Staff Number", "Current Trust Employee", "Tel. Number", "Personal Email", "Contact on Personal Email", "Address Line 1", "Address Line 2", "Address Line 3", "Postcode", "Town", "County", "Emergency Contact Name ", "Emergency Contact Tel. Number", "Emergency Contact Relationship", "Clinical Area ", "Role"],
            componentTitle: "Personal Profile Edit ",
            inputType: ["text", "email", "date", "text", "checkbox", "tel", "email", "checkbox", "text", "text", "text", "text", "text", "tel", "text", "tel", "text", "option", "option"], inputType: ["text", "email", "date", "text", "checkbox", "tel", "email", "checkbox", "text", "text", "text", "text", "text", "tel", "text", "tel", "text", "option", "option"],
            options: [],
            exceptionStatus: 0
        }
    }

    redirect() {
        if (!this.props.redirectURL) return console.log("redirect !")
    }
    componentWillMount() {
        let profileArray = [];
        let optionsArray = [];
        fetch("http://localhost:3001/personal_profile_select_role")
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            }).then(dbres => {
                optionsArray = dbres.map(item => {
                    return [
                        item.role_id,
                        item.role_title,
                        item.role_band_id
                    ]
                })
                console.log("options array " + JSON.stringify(optionsArray));

                this.setState({
                    options: optionsArray,

                })

            }).catch(err => {
                alert(err);
            })
    }


    render() {
        return (
            <div className="personalProfile" >
                {console.log("on personal-profile page ")}
                < Navbar />

                <Form {...this.state} />
            </div>
        )


    }
}