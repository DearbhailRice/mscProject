import React, { Component } from "react";
import Navbar from "../../_components/navbar";
import Table from "../../_components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import "../../styles/learningProfile/learningProfile.scss";
import moment from "moment"
export default class Training extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnHearder: ["Id", "Training Title", "Valid for (years)", "Face to face Course", "Mandatory", "Version Number", "Duration", "Add"],
            rowData: [[]],
            redirectURL: "/",
            exceptionStatus: 0,
            componentTitle: "Training Courses"
        }
    }


    componentWillMount() {
        let tableArray = [];
        let disableArray = [];
        let matchTrainId = [];
        let combineArray = [];
        var trainingId = 0;
        const userId = JSON.parse(localStorage.getItem('tokens'))['user_id'];
        var addButtonShown = "";
        // const userId = 1;


        fetch("http://localhost:3001/training_disable" + userId)
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                throw `Invalid Query`
            })
            .then(dbres => {
                disableArray = dbres.map(item => {

                    return item.learning_profile_training_id


                });
                console.log("disableArray array" + JSON.stringify(disableArray, null, 4));
                //match exising id to training id and disable add button if match found 
                let existingProfileId = disableArray

                fetch("http://localhost:3001/training-select")
                    .then(res => {
                        console.log(res.status);
                        if (res.status === 200) { return res.json(); }
                        throw `Invalid Query`
                    })
                    .then(dbres => {
                        tableArray = dbres.map(item => {
                            trainingId = item.trainingId;
                            //h:mm:

                            if (disableArray.includes(item.training_id)) {
                                console.log(disableArray);
                                console.log(item.training_id)
                                addButtonShown = "disableAddButton";
                            } else {
                                console.log("disableArray", disableArray);
                                console.log("training id", item.training_id)
                                addButtonShown = "displayAddButton";
                            }
                            if (item.training_mandatory == 1) {
                                console.log(item.training_mandatory, " YES")
                                item.training_mandatory = "Yes"
                            } else {
                                console.log(item.training_mandatory, " NO")
                                item.training_mandatory = "No"

                            }

                            if (item.training_course_face_to_face == 1) {
                                console.log(item.ttraining_course_face_to_face, " YES")
                                item.training_course_face_to_face = "Yes"
                            } else {
                                console.log(item.training_course_face_to_face, " NO")
                                item.training_course_face_to_face = "No"

                            }

                            // item.training_duration = moment(item.training_duration).format("hh:mm")
                            return [
                                item.training_id,
                                item.training_title,
                                item.training_revalidation_period_years,
                                item.training_course_face_to_face,
                                item.training_mandatory,
                                item.training_version_number,
                                item.training_duration,
                                addButtonShown

                            ];
                        });
                        console.log("table array" + JSON.stringify(tableArray, null, 4));

                        this.setState({
                            rowData: tableArray
                        })
                    }).catch(err => {
                        alert(err);
                    })

            })



    }

    render() {
        let isAdmin = false;
        if (!localStorage.tokens) {
            isAdmin = false;
        } else {
            isAdmin = JSON.parse(localStorage.getItem('tokens'))['isAdmin'];
            console.log("is admin ", isAdmin)
        }
        return (
            <div className="learningProfile">
                {console.log("on learning-profile page ")}
                <Navbar />

                <div className="learningInfo">
                    <div className="wrapperDiv">
                        <div className="captionDiv">
                            <h2 className="tableTitle" >{this.state.componentTitle} </h2>
                            {(isAdmin) ?
                                <a onClick={() => { window.location.href = "/training-add" }}>
                                    <FontAwesomeIcon className="editIcon" icon={faPlusCircle} size="1x" style={{ margin: "19px" }} />
                                </a> : null}
                        </div>
                        <div className="learningTable">
                            <Table {...this.state} addTraining={this.addTraining.bind(this)} className="learningTable" />

                        </div>
                    </div>
                </div>

            </div>
        )
    }

    addTraining(trainingId) {
        this.props.history.push({
            trainingId: trainingId
        })
        let trainRes = {};

        let user = JSON.parse(localStorage.getItem('tokens'))['user_id'];
        console.log("user Id ", user)
        const requestOptions =
        {
            method: 'POST',
            url: 'http://localhost:3001/learning_profile_add',
            body: JSON.stringify({
                user,
                trainingId
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        console.log("request options ", requestOptions)

        console.log("addTrining ", trainingId)


        fetch('http://localhost:3001/learning_profile_add',
            requestOptions)
            .then(res => res.json())
            .then(data => {

                console.log("/login push response " + JSON.stringify(data))

                trainRes = {
                    message: data.message,
                }

                return trainRes;
            }).catch(e => {
                console.log("error training")
            });

        setTimeout(() => {
            alert(JSON.stringify(trainRes, null, 2));
            console.log("resetRes.passwordReset", trainRes.message)

            // setSubmitting(false);
        }, 400)
        window.location.reload(true);
    }


}