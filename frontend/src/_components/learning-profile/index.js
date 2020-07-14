import React, { Component } from "react";
import Navbar from "../navbar";
import Table from "../table";
import "../../styles/learningProfile/learningProfile.scss";
import moment from "moment"

/**
 * class to display individual logged in users learning profile
 */
export default class learningProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Training Id", "Training Title", "Valid for (years)", "Mandatory", "Duration (Hours)", "Completion Date", "Certificate", "valid", "Edit", "Remove"],
            rowData: [[]],
            redirectURL: "/learning-profile",
            componentTitle: "Learning Profile ",
            isModalOpen: false
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
        let userId = 0;
        let editButton = "editButton";
        let removeButton = "removeButton";
        if (JSON.parse(localStorage.getItem('tokens'))['isAdmin']) {
            if (!this.props.history.location.isAdminView) {
                userId = JSON.parse(localStorage.getItem('tokens'))['user_id'];

            } else {
                userId = this.props.history.location.userId
                editButton = "disable";
                removeButton = "disabled";
                this.setState({ componentTitle: "learning Profile: " + this.props.history.location.userName })
                console.log("View isuserId", userId)
            }
        } else {
            userId = JSON.parse(localStorage.getItem('tokens'))['user_id'];
        }
        let tableArray = [];



        const VALID = "Valid"
        const INVALID = "Invalid"
        let isValid = VALID;

        fetch("http://localhost:3001/learning-profile-select" + userId)
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            })
            .then(dbres => {
                console.log("DATE ", new Date(new Date().toDateString()))

                tableArray = dbres.map(item => {

                    if (item.training_mandatory == 1) {
                        console.log(item.training_mandatory, " YES")
                        item.training_mandatory = "Yes"
                    } else {
                        console.log(item.training_mandatory, " NO")
                        item.training_mandatory = "No"
                    }

                    if (item.learning_profile_date_completed == null) {
                        item.learning_profile_date_completed = "TBC";
                        isValid = INVALID;
                    } else {
                        console.log(new Date(new Date().toDateString()), "      ", new Date(new Date().toDateString()))

                        if (this.isBeforeInvalidDate(item.learning_profile_date_completed, item.training_revalidation_period_years)) {
                            isValid = INVALID;
                        }
                        item.learning_profile_date_completed = moment(item.learning_profile_date_completed).format("DD-MM-YY")

                    }
                    if (item.learning_profile_certificate_path == null || item.learning_profile_certificate_path == "") {
                        item.learning_profile_certificate_path = "TBC";
                    }
                    return [
                        item.training_id,
                        item.training_title,
                        item.training_revalidation_period_years,
                        item.training_mandatory,
                        item.training_duration,
                        item.learning_profile_date_completed,
                        item.learning_profile_certificate_path,
                        isValid,
                        editButton,
                        removeButton
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
                        </div>
                        {/*  */}
                        <Table {...this.state} editTraining={this.editTrainingRecord.bind(this)} removeTraining={this.removeTrainingRecord.bind(this)} className="learningTable" />
                    </div>
                </div>
            </div >
        )
    }
    /**
     * redirects to edit training record page 
     *  */
    editTrainingRecord(trainingId) {
        console.log("Edit training Record" + trainingId)
        window.location.href = "/learning-profile-edit/" + trainingId
    }
    /**
     * sends delete request to the api to remove training record fron the users learning profile 
     * @param {*} trainingId 
     */
    removeTrainingRecord(trainingId) {
        console.log("Remove training Record" + trainingId);
        const userId = JSON.parse(localStorage.getItem('tokens'))['user_id'];
        let deleteRes = {};
        var data = this.state.profileData;
        const requestOptions =
        {
            method: 'DELETE',
            url: 'http://localhost:3001/learning-profile-delete',
            body:
                JSON.stringify({
                    userId,
                    trainingId,
                    data
                }),
            headers: {

                'Content-Type': 'application/json',
            },
        }

        fetch('http://localhost:3001/learning-profile-delete',
            requestOptions)
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }

                throw `Invalid Query`
            })
            .then(data => {
                console.log("/learning-profile-delete " + JSON.stringify(data))

                deleteRes = {
                    message: data.message,
                }
                console.log("addRes ", deleteRes)
                return deleteRes;

            }).catch(e => {
                this.setState({ IsError: true })
            });

        setTimeout(() => {
            alert(JSON.stringify(deleteRes, null, 2));

        }, 400)
        window.location.reload(true);
    }
}