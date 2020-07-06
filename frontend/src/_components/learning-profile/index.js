import React, { Component } from "react";
import Navbar from "../../_components/navbar";
import Table from "../../_components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "../../styles/learningProfile/learningProfile.scss";
import ReactModal from "react-modal";
import moment from "moment"
export default class learningProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Training Id", "Training Title", "Valid for (years)", "Mandatory", "Duration (Hours)", "Completion Date", "Certificate", "Edit", "Remove"],
            rowData: [[]],
            redirectURL: "/learning-profile",
            componentTitle: "Learning Profile ",
            isModalOpen: false

        }
    }

    openModal() {
        console.log("Modal OPEN")
        this.setState({ isModalOpen: true })
    }
    closeModal() {
        console.log("Modal CLOSE")
        this.setState({ isModalOpen: false })
    }



    componentWillMount() {
        let tableArray = [];
        const userId = JSON.parse(localStorage.getItem('tokens'))['user_id'];
        let editButton = "editButton";
        let removeButton = "removeButton";

        fetch("http://localhost:3001/learning-profile-select" + userId)
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            })
            .then(dbres => {


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
                    }
                    else {
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
                        editButton,
                        removeButton

                    ];
                });
                console.log("table array" + JSON.stringify(tableArray, null, 4));

                //training_maditiory 
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
                        <div className="learningTable">
                            <Table {...this.state} editTraining={this.editTrainingRecord.bind(this)} removeTraining={this.removeTrainingRecord.bind(this)} className="learningTable" />

                        </div>
                    </div>
                </div>

            </div >
        )
    }
    editTrainingRecord(trainingId) {
        console.log("Edit training Record" + trainingId)
        window.location.href = "/learning-profile-edit/" + trainingId
    }

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