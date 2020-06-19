import React, { Component } from "react";
import Navbar from "../../components/navbar";
import Form from "../../components/form";
import HorzTable from "../../components/horizontalTable";
import PersonalInfo from "../../components/personalInfo";
export default class personalProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Name", "Work Email", "Start Date", "Staff Number", "Current Employee", "Tel. Number", "Personal Email", "Contact on Personal Email", "Address Line 1", "Address Line 2", "Address Line 3", "Postcode", "Town", "County", "Emergency Contact Name ", "Emergency Contact Tel. Number", "Emergency Contact Relationship", "Clinical Area ", "Role", "Band"],
            rowData: [[]],
            redirectURL: "/test",
            currentPoID: "",
            exceptionStatus: 0
        }
    }

    componentWillMount() {
        let profileArray = [];
        fetch("http://localhost:3001/personal_profile_select")
            .then(res => {

                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                // throw `Invalid Query`
            })
            .then(dbres => {
                profileArray = dbres.map(item => {
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
                console.log("test array " + JSON.stringify(profileArray, null, 4));


                this.setState({
                    rowData: profileArray
                })
            }).catch(err => {
                alert(err);
            })

    }

    render() {
        return (
            <div className="personal-profile">

                {console.log("on personal-profile page ")}
                <Navbar />
                <Form />
                <PersonalInfo {...this.state} navigateRow={this.redirect.bind(this)} />

            </div>
        )
    }

    redirect(testId) {
        this.props.history.push({
            pathname: this.state.redirectURL
        })
    }
}