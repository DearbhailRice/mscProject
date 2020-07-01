import React, { Component } from "react";
import Navbar from "../navbar";
import "../../styles/personalProfile/personalProfile.scss"
import PersonalInfo from "../personalInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default class personalProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Name", "Work Email", "Start Date", "Staff Number", "Current Trust Employee", "Tel. Number", "Personal Email", "Contact on Personal Email", "Address Line 1", "Address Line 2", "Address Line 3", "Postcode", "Town", "County", "Emergency Contact Name ", "Emergency Contact Tel. Number", "Emergency Contact Relationship", "Clinical Area ", "Role", "Band"],
            rowData: [[]],
            redirectURL: "personalInfo/edit.js",
            currentPoID: "",
            exceptionStatus: 0,
            componentTitle: "Personal Profile ",

        }
    }

    componentWillMount() {
        let profileArray = [];
        var userId = 1;

        fetch("http://localhost:3001/personal_profile_select" + userId)
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            }).then(dbres => {
                profileArray = dbres.map(item => {


                    if (item.contact_details_preffer_personal_email_contact === 1) {
                        console.log("in profileArray item.contact_details_preffer_personal_email_contact if yes")
                        item.contact_details_preffer_personal_email_contact = "Yes";
                        console.log(" item.contact_details_preffer_personal_email_contact" + item.contact_details_preffer_personal_email_contact)

                    } else {
                        item.contact_details_preffer_personal_email_contact = "No";
                        console.log("in profileArray item.contact_details_preffer_personal_email_contact if No")
                        console.log(" item.contact_details_preffer_personal_email_contact" + item.contact_details_preffer_personal_email_contact)
                    }

                    if (item.user_current_trust_employee_in_current_role === 1) {
                        console.log("in profileArray item.user_current_trust_employee_in_current_role if yes")
                        item.user_current_trust_employee_in_current_role = "Yes";
                        console.log(" item.user_current_trust_employee_in_current_role" + item.user_current_trust_employee_in_current_role)

                    } else {
                        item.user_current_trust_employee_in_current_role = "No";
                        console.log("in profileArray item.user_current_trust_employee_in_current_role if No")
                        console.log(" item.user_current_trust_employee_in_current_role" + item.user_current_trust_employee_in_current_role)
                    }
                    if (item.address_line_2 == null) {
                        item.address_line_2 = " -- "
                    }
                    if (item.address_line_3 == null) {
                        item.address_line_3 = " -- "
                    }



                    return [
                        item.user_name,
                        item.user_email_address,
                        item.user_start_date,
                        item.user_bank_staff_number,
                        item.user_current_trust_employee_in_current_role,
                        item.contact_details_tel_number,
                        item.contact_details_personal_email,
                        item.contact_details_preffer_personal_email_contact,
                        item.address_line_1,
                        item.address_line_2,
                        item.address_line_3,
                        item.address_postcode,
                        item.address_town,
                        item.address_county,
                        item.emergency_contact_details_name,
                        item.emergency_contact_details_tel_number,
                        item.emergency_contact_details__relationship,
                        item.clinical_area_title,
                        item.role_title,
                        item.band_title

                    ];

                });
                console.log("Profile array " + JSON.stringify(profileArray, null, 4));

                this.setState({

                    rowData: profileArray

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

                <div className="personalProfileContent">
                    <div className="wrapperDiv">
                        <div>
                            <h2 className="tableTitle">{this.state.componentTitle} </h2>
                            <a className="editButton" onClick={() => { this.redirect("/personalProfile/edit", { ...this.state }) }} >
                                <FontAwesomeIcon className="editIcon" icon={faEdit} size="1x" style={{ margin: "19px" }} />
                            </a>
                        </div>


                        <div className="personalInfoDiv">
                            <PersonalInfo {...this.state} className="personalInfo" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    redirect(redirectURL, state) {
        this.props.history.push({
            pathname: redirectURL || this.state.redirectURL,
            state
        })
    }
}