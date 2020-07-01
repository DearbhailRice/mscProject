import React, { Component } from "react";
import Navbar from "../../_components/navbar";
import Table from "../../_components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "../../styles/learningProfile/learningProfile.scss"

export default class learningProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Training Title", "Valid for (years)", "Mandatory", "Duration", "Completion Date"],
            rowData: [[]],
            redirectURL: "/learning-profile",
            exceptionStatus: 0,
            componentTitle: "Learning Profile "
        }
    }

    componentWillMount() {
        let tableArray = [];
        fetch("http://localhost:3001/learning-profile-select")
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            })
            .then(dbres => {
                tableArray = dbres.map(item => {
                    return [
                        // item.user_id,
                        item.training_title,
                        item.training_revalidation_period_years,
                        item.training_mandatory,
                        item.training_duration,
                        item.learning_profile_date_completed
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
                            <a onClick={() => { window.location.href = "/learningProfileEdit" }}>
                                <FontAwesomeIcon className="editIcon" icon={faEdit} size="1x" style={{ margin: "19px" }} />
                            </a>
                        </div>
                        <div className="learningTable">
                            <Table {...this.state} className="learningTable" />
                            {/* <PersonalInfo {...this.state} navigateRow={this.redirect.bind(this)} /> */}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    redirect() {
        this.props.history.push({
            pathname: this.state.redirectURL

        })
    }
}