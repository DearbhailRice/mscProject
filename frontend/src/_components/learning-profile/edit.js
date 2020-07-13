import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class LearningInfoEdit extends Component {
    constructor(props) {

        super(props);

        this.state = {
            profileData: {
                "Completion Date": "",
                "Certificate Upload": ""
            },
            componentTitle: "Learning Profile Edit ",
            inputType: ["date", "file"],
            data: {},
            validateError: "",
            isError: false,
            trainingId: props.match.params.trainingId,
            userId: JSON.parse(localStorage.getItem('tokens'))['user_id'],

        }
        if (!localStorage.tokens) {
            window.location.href = "/login"
        }
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }



    handleDataUpdate(key, value, e) {
        console.log("key ", key)
        let ObjToUpdate = this.state.profileData
        if (key == "Certificate Upload") {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                value = reader.result;
                ObjToUpdate[key] = value;
                this.setState({
                    profileData: ObjToUpdate
                })
            }
        }
        console.log(ObjToUpdate, " OBJECT UPDATED")
        ObjToUpdate[key] = value;

        this.setState({
            profileData: ObjToUpdate
        })
    }

    async editPost(requestOptions) {

        let response = await fetch('http://localhost:3001/learning_profile_edit', requestOptions);
        let item = await response.json();
        return item
    }

    handleSubmit() {
        console.log("Handle submit ", this.state.profileData);
        let editRes = {};
        var userId = this.state.userId;
        var trainingId = this.state.trainingId;
        var data = this.state.profileData;

        const requestOptions =
        {
            method: 'POST',
            url: 'http://localhost:3001/learning_profile_edit',
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

        fetch('http://localhost:3001/learning_profile_edit',
            requestOptions)
            .then(res => res.json())
            .then(item => {
                console.log("/login push response " + JSON.stringify(item))

                editRes = {
                    message: item.message,
                    sucessfulEdit: item.sucessfulEdit
                }
                console.log("edit res ", editRes)

                return editRes;
            }).catch(err => {
                console.log("error", err)
                this.setState({ IsError: true });
            })
        setTimeout(() => {
            console.log(" editRes.sucessfulEdit", editRes.sucessfulEdit)
            alert(JSON.stringify(this.editRes, null, 2));
            if (editRes.sucessfulEdit) {
                window.location.href = "/learning-profile";
            }
        }, 400)

    }

    render() {
        return (
            <div className="personalProfile" >
                <Navbar />
                {console.log("on personal-profile edit page ")}
                <div className="personalProfileContent">
                    <div className="wrapperDiv">
                        <div>
                            <h2 className="tableTitle">{this.state.componentTitle} </h2>
                        </div>
                        <Form {...this.state} onSubmit={this.handleSubmit} onChange={this.handleDataUpdate} />
                    </div>
                </div>
            </div>
        );
    }
}