import React, { Component } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);

        if (!this.props.location.state.rowData) {
            window.location.href = "/personal-profile"
        }
        this.state = {
            options: [[]],
            columnHeader: this.props.columnHeader,
            rowData: this.props.location.state.rowData,
            formElementLable: ["Name", "Work Email", "Start Date", "Staff Number", "Current Trust Employee", "Tel. Number", "Personal Email", "Contact on Personal Email", "Address Line 1", "Address Line 2", "Address Line 3", "Postcode", "Town", "County", "Emergency Contact Name ", "Emergency Contact Tel. Number", "Emergency Contact Relationship", "Clinical Area", "Role"],
            componentTitle: "Personal Profile Edit ",
            inputType: ["text", "disabled", "disabled", "disabled", "radio", "tel", "email", "radio", "text", "text", "text", "text", "text", "tel", "text", "tel", "text", "option", "option"]

        }
    }

    componentWillMount() {
        let optionsObj = [];
        let roleObj = {};
        let caObj = {};
        let combineArr = [];

        fetch("http://localhost:3001/role_band_select").then(res => {
            console.log("editRes.status " + res.status);
            if (res.status === 200) { return res.json(); }
            throw `Invalid Query`
        }).then(dbres => {
            console.log("editdbres" + dbres)
            roleObj = dbres.map(editItem => {
                console.log("editItem.role_title " + editItem.role_title)
                return {
                    type: "Role",
                    option1: editItem.role_title,
                    option2: editItem.role_band_id
                };
            });
            console.log("optionsObj " + JSON.stringify(optionsObj, null, 4));

            fetch("http://localhost:3001/clinical_area_select").then(cares => {
                console.log("editRes.status " + cares.status);
                if (cares.status === 200) { return cares.json(); }
                throw `Invalid Query`
            }).then(caDbres => {
                console.log("editdbres" + caDbres)
                caObj = caDbres.map(caEditItem => {

                    return {
                        type: "Clinical Area",
                        option1: caEditItem.clinical_area_title,
                    };
                });

                combineArr.push(roleObj);
                combineArr.push(caObj);

                this.setState({
                    options: combineArr
                })

            })
        }).catch(err => {
            alert(err);
        })
    }

    render() {

        return (
            <div className="personalProfile" >
                {console.log("on personal-profile edit page ")}
                < Navbar />

                <div className="editPersonalInfo">
                    <Form {...this.state} />
                </div>
            </div>
        );
    }
}