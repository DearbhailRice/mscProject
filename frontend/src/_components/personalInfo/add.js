import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: JSON.parse(localStorage.getItem('tokens'))['user_id'],
            options: [[]],
            profileData: {
                "Name": "",
                "Current Trust Employee": 0,
                "Tel. Number": "",
                "Personal Email": "",
                "Contact on Personal Email": "",
                "Address Line 1": "",
                "Address Line 2": "",
                "Address Line 3": "",
                "Postcode": "",
                "Town": "",
                "County": "",
                "Emergency Contact Name": "",
                "Emergency Contact Tel. Number": "",
                "Emergency Contact Relationship": "",
                "Clinical Area": "",
                "Role": "",
                "Band": 0
            },
            componentTitle: "Add Personal Profile ",
            inputType: ["text", "radio", "tel", "email", "radio", "text", "text", "text", "text", "text", "tel", "text", "tel", "text", "option", "option", "option"],
            data: {},
            validateError: "",
            isError: false,
            originUrl: "/personal-profile"
        }

        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let optionsObj = [];
        let roleObj = {};
        let caObj = {};
        let combineArr = [];

        fetch("http://localhost:3001/role_band_select").then(res => {
            console.log("editRes.status " + res.status);
            if (res.status === 200) { return res.json(); }
            throw `Invalid Query`
        }).then(dbres => {
            console.log("editdbres" + dbres)
            roleObj = dbres.map(editItem => {
                console.log("editItem.role_title " + editItem.role_title)
                return {
                    type: "Role",
                    id: editItem.role_id,
                    option1: editItem.role_title,
                    option2: editItem.role_band_id
                };
            });
            console.log("optionsObj " + JSON.stringify(optionsObj, null, 4));

            fetch("http://localhost:3001/clinical_area_select").then(cares => {
                console.log("editRes.status " + cares.status);
                if (cares.status === 200) { return cares.json(); }
                throw `Invalid Query`
            }).then(caDbres => {
                console.log("editdbres" + caDbres)
                caObj = caDbres.map(caEditItem => {

                    return {
                        type: "Clinical Area",
                        id: caEditItem.clinical_area_id,
                        option1: caEditItem.clinical_area_title,
                    };
                });
                combineArr.push(roleObj);
                combineArr.push(caObj);
                this.setState({
                    options: combineArr
                })
            })
        }).catch(err => {
            alert(err);
        })
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

        if ((data["Name"] == "") ||
            (data["Tel. Number"] == "") ||
            (data["Personal Email"] == "") ||
            (data["Address Line 1"] == "") ||
            (data["Postcode"] == "") ||
            (data["Town"] == "") ||
            (data["County"] == "") ||
            (data["Emergency Contact Name"] == "") ||
            (data["Emergency Contact Tel. Number"] == "") ||
            (data["Emergency Contact Relationship"] == "") ||
            (data["Clinical Area"] == "") ||
            (data["Role"] == "")) {
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
                url: 'http://localhost:3001/personal-profile-add',
                body:
                    JSON.stringify({
                        userId,
                        data
                    }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            fetch('http://localhost:3001/personal-profile-add',
                requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log("/personal-profile-add " + JSON.stringify(data))
                    addRes = {
                        message: data.message,
                        user_id: data.user_id,
                        sucessfulAdd: data.sucessfulAdd
                    }
                    return addRes;
                }).catch(e => {
                    this.setState({ IsError: true })
                });
            alert(JSON.stringify(addRes, null, 2));
            if (addRes.sucessfulEdit) {
                window.location.href = "/personal-profile"
            }
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