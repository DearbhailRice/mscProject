import React, { Component } from "react";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import "../../styles/personalProfile/personalProfile.scss"
import PersonalInfo from "../personalInfo";


export default class learningProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Training Title", "Valid for (years)", "Mandatory", "Duration", "Completion Date"],
            rowData: [[]],
            redirectURL: "/learning-profile",
            currentPoID: "",
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
                // throw `Invalid Query`
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
            <div className="personalProfile">
                {console.log("on learning-profile page ")}
                <Navbar />

                <div className="personalInfo">
                    <Table {...this.state} navigateRow={this.redirect.bind(this)} />
                    {/* <PersonalInfo {...this.state} navigateRow={this.redirect.bind(this)} /> */}
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