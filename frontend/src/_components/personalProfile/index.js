import React, { Component } from "react";
import Navbar from "../navbar";
import "../../styles/personalProfile/personalProfile.scss"
import PersonalInfo from "../personalInfo";
import Edit from "../personalInfo/edit"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
export default class personalProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileData: {},
            redirectURL: "personal-profile/edit",
            componentTitle: "Personal Profile ",
            isEdit: false,
        }
    }

    componentWillMount() {
        let profileArray = [];
        var userId = JSON.parse(localStorage.getItem('tokens'))['user_id'];

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



                    return {
                        "Name": item.user_name,
                        "Work Email": item.user_email_address,
                        "Start Date": moment(item.user_start_date).format("DD-MM-YY"),
                        "Staff Number": item.user_bank_staff_number,
                        "Current Trust Employee": item.user_current_trust_employee_in_current_role,
                        "Tel. Number": item.contact_details_tel_number,
                        "Personal Email": item.contact_details_personal_email,
                        "Contact on Personal Email": item.contact_details_preffer_personal_email_contact,
                        "Address Line 1": item.address_line_1,
                        "Address Line 2": item.address_line_2,
                        "Address Line 3": item.address_line_3,
                        "Postcode": item.address_postcode,
                        "Town": item.address_town,
                        "County": item.address_county,
                        "Emergency Contact Name": item.emergency_contact_details_name,
                        "Emergency Contact Tel. Number": item.emergency_contact_details_tel_number,
                        "Emergency Contact Relationship": item.emergency_contact_details__relationship,
                        "Clinical Area": item.clinical_area_title,
                        "Role": item.role_title,
                        "Band": item.role_band_id

                    };

                });
                console.log("Profile array " + JSON.stringify(profileArray, null, 4));

                this.setState({

                    profileData: profileArray[0]

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
                            <a className="editButton" onClick={() => { this.setState({ isEdit: true }) }} >
                                <FontAwesomeIcon className="editIcon" icon={faEdit} size="1x" style={{ margin: "19px" }} />
                            </a>
                        </div>


                        <div className="personalInfoDiv">

                            {(!this.state.isEdit) ?
                                <PersonalInfo {...this.state} className="personalInfo" />
                                :
                                <Edit {...this.state} />
                            }

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