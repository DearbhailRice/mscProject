import React, { Component } from "react";
import Navbar from "../navbar";
import Table from "../table";
import "../../styles/learningProfile/learningProfile.scss";
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";

/**
 * class to display a selected users learning profile -- unimplemeted as attempting to prevent code duplication by passing user Id variable  to user profile 
 */
export default class learningProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Id", "User Name", "Work Email ", "Start Date ", "Staff Number", "Current Trust Employee", "Learning Profile"],
            rowData: [[]],
            redirectURL: "/learning-profile",
            componentTitle: "Users View",
            isModalOpen: false,
            viewUserId: 0
        }
    }
    /**
     * sets boolean for modal is open
     */
    openModal() {
        console.log("Modal OPEN")
        this.setState({ isModalOpen: true })
    }
    /**
     * sets boolean for modal is closed
     */
    closeModal() {
        console.log("Modal CLOSE")
        this.setState({ isModalOpen: false })
    }

    /**
     * function to calculate the completion date plus the valid for years 
     * then check if the calculated date is before the date now 
     * @param {*} date 
     * @param {*} yearsValid 
     */
    isBeforeInvalidDate(date, yearsValid) {
        console.log("in date before today method ")
        date = new Date(date);
        var inValidDate = date.setFullYear(date.getFullYear() + yearsValid);
        var today = new Date((new Date()).toString().substring(0, 15));
        console.log("today= ", inValidDate, "date= ", date)
        date = new Date(date)
        return inValidDate < today;
    }

    /**
     * retrieves the user id from local storage 
     * fetches learning profile data from the api using the user id
     */
    componentWillMount() {
        if (!localStorage.tokens) {
            window.location.href = "/login"
        } else if (!JSON.parse(localStorage.getItem('tokens'))['isAdmin']) {
            window.location.href = "/notfound"
        }
        let tableArray = [];
        let viewButton = "viewButton";

        fetch("http://localhost:3001/standard_user_select")
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            })
            .then(dbres => {
                console.log("DATE ", new Date(new Date().toDateString()))

                tableArray = dbres.map(item => {

                    item.user_start_date = moment(item.user_start_date).format("DD-MM-YY")

                    if (item.user_current_trust_employee_in_current_role == 1) {
                        item.user_current_trust_employee_in_current_role = "Yes"
                    } else {
                        item.user_current_trust_employee_in_current_role = "No"
                    }

                    return [
                        item.user_id,
                        item.user_name,
                        item.user_email_address,
                        item.user_start_date,
                        item.user_bank_staff_number,
                        item.user_current_trust_employee_in_current_role,
                        viewButton

                    ];
                });
                console.log("table array" + JSON.stringify(tableArray, null, 4));
                this.setState({
                    rowData: tableArray
                })
            }).catch(err => {
                alert(err);
            })
    }

    render() {
        return (
            <div className="learningProfile">
                {console.log("on learning-profile page ")}
                <Navbar />
                <div className="learningInfo">
                    <div className="wrapperDiv">
                        <div className="captionDiv">
                            <h2 className="tableTitle" >{this.state.componentTitle} </h2>
                            <a onClick={() => { window.location.href = "/adduser" }}>
                                <FontAwesomeIcon className="editIcon" icon={faPlusCircle} size="1x" style={{ margin: "19px" }} />
                            </a>
                        </div>
                        {/*  */}
                        <Table {...this.state} userLerningProfileview={this.viewUsersLerningProfile.bind(this)}
                            className="learningTable" />
                    </div>
                </div>
            </div >
        )
    }

    viewUsersLerningProfile(userId, userName) {
        console.log("view user learning profile by user email " + userId)
        this.setState({ viewUserId: userId })
        this.props.history.push({
            pathname: this.state.redirectURL,
            userId: userId,
            userName: userName,
            isAdminView: true
        })

    }

}