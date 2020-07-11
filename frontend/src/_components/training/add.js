import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";
export default class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 1,
            options: [[]],
            profileData: {
                "Training Title": "",
                "Valid for (years)": 0,
                "Face to face Course": 0,
                "Mandatory": 0,
                "Version Number": 0,
                "Duration": "00:00:00",
                "Training Version Release Date": "00-00-00"
            },
            componentTitle: "Add Training ",
            inputType: ["text", "number", "radio", "radio", "number", "time", "date"],
            data: {},
            validateError: "",
            isError: false,
            originUrl: "/training"
        }
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (!localStorage.tokens) {
            window.location.href = "/login"
        } else if (!JSON.parse(localStorage.getItem('tokens'))['isAdmin']) {
            window.location.href = "/notfound"
        }
    }

    validate(key, value, ObjToUpdate) {
        // e.target.value
        let error = {}
        this.setState({ validateError: null });
        console.log("value ", value);
        console.log("key ", key);
        if ((key == "Address Line 2") || (key == "Address Line 3")) {
            console.log("not address1")
        } else if (!value) {
            error = key + ' Required';
            if ((key == "Name") || (key == "Address Line 1") || (key == " ")) {
                if (!/^/.test(ObjToUpdate[key])) {
                }
            }
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
        console.log(ObjToUpdate, " OBJECT UPDATED")
        ObjToUpdate[key] = value;
        this.validate(key, value, ObjToUpdate)
        this.setState({
            profileData: ObjToUpdate
        })
    }

    handleSubmit() {
        console.log("Handle submit ", this.state.profileData);
        let addRes = {};
        var userId = this.state.userId;
        var data = this.state.profileData;
        var data = this.state.profileData;

        if (
            (data["Training Title"] == "") ||
            (data["Valid for (years)"] == 0) ||
            (data["Version Number"] == 0) ||
            (data["Duration"] == "00:00:00") ||
            (data["Training Version Release Date"] == "00-00-00")
        ) {
            console.log("in data not blank if ")
            addRes = {
                message: "please complete all feilds  "
            }
            this.setState({ IsError: true })
            alert(addRes.message);
        } else {
            const requestOptions =
            {
                method: 'POST',
                url: 'http://localhost:3001/training-add',
                body:
                    JSON.stringify({
                        userId,
                        data
                    }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            fetch('http://localhost:3001/training-add',
                requestOptions)
                .then(res => {
                    console.log(res.status);
                    if (res.status === 200) { return res.json(); }
                    throw `Invalid Query`
                })
                .then(data => {
                    console.log("/add-user " + JSON.stringify(data))
                    addRes = {
                        message: data.message,
                    }
                    console.log("addRes ", addRes)
                    return addRes;
                }).catch(e => {
                    this.setState({ IsError: true })
                });
        }
        setTimeout(() => {
            alert(JSON.stringify(addRes, null, 2));
        }, 400)
        if (addRes.sucessfulEdit) {
            window.location.href = "/add-profile-info"
        }
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