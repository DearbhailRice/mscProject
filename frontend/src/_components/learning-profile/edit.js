import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class LearningInfoEdit extends Component {
    constructor(props) {

        super(props);

        this.state = {

            options: [[]],
            columnHeader: this.props.columnHeader,
            profileData: {
                "Completion Date": "",
                "Certificate Upload": ""
            },
            componentTitle: "Learning Profile Edit ",
            inputType: ["date", "file"],
            data: {},
            validateError: "",
            isError: false,
            originUrl: "/personal-profile",
            trainingId: props.match.params.trainingId,
            userId: JSON.parse(localStorage.getItem('tokens'))['user_id'],
            editRes: {}
        }
        if (!localStorage.tokens) {
            window.location.href = "/login"
        }
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    validate(key, value, ObjToUpdate) {
        let error = {}
        this.setState({ validateError: null });
        console.log("value ", value);
        console.log("key ", key);
        if ((key == "Address Line 2") || (key == "Address Line 3")) {
            console.log("not address1")

        } else if (!value) {
            error = key + ' Required';

            if ((key == "Personal Email")) {

                console.log("personal email changed ");
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                    error = key + ' Invalid';
                }
            }
            this.setState({
                validateError: error
            })
        }
        console.log("error ", error)
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

        this.validate(key, value, ObjToUpdate)

        this.setState({
            profileData: ObjToUpdate
        })
    }

    handleSubmit() {
        console.log("Handle submit ", this.state.profileData);

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
            .then(data => {
                console.log("/login push response " + JSON.stringify(data))

                let editResObj = {
                    message: data.message,
                    sucessfulEdit: data.sucessfulEdit
                }

                console.log("edit res ", editResObj)

                this.setState({
                    editRes: editResObj
                })

                return editResObj;
            }).catch(e => {
                console.log("error", e)
                this.setState({ IsError: true });
            });

        setTimeout(() => {
            alert(JSON.stringify(this.editRes, null, 2));
        }, 400)

        window.location.href = "/learning-profile";
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