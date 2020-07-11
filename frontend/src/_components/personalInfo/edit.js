import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";

export default class PersonalInfoEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: JSON.parse(localStorage.getItem('tokens'))['user_id'],
            options: [[]],
            columnHeader: this.props.columnHeader,
            profileData: this.props.profileData,
            formElementLable: ["Name", "Work Email", "Start Date", "Staff Number", "Current Trust Employee", "Tel. Number", "Personal Email", "Contact on Personal Email", , "Address Line 2", "Address Line 3", "Postcode", "Town", "County", "Emergency Contact Name ", "Emergency Contact Tel. Number", "Emergency Contact Relationship", "Clinical Area", "Role"],
            componentTitle: "Personal Profile Edit ",
            inputType: ["text", "disabled", "disabled", "disabled", "radio", "tel", "email", "radio", "text", "text", "text", "text", "text", "tel", "text", "tel", "text", "option", "option", "option"],
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
        let isError = false;
        this.setState({ validateError: null });
        console.log("value ", value);
        console.log("key ", key);
        if ((key == "Address Line 2") || (key == "Address Line 3")) {
            console.log("not address1")
        } else if (!value) {
            error = key + ' Required';
            isError = true;
            if ((key == "Name") || (key == "Address Line 1") || (key == " ")) {
                if (!/^/.test(ObjToUpdate[key])) {
                }
            }
            if ((key == "Personal Email")) {
                console.log("personal email changed ");
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                    error = key + ' Invalid';
                    isError = true;
                }
            }
            this.setState({
                validateError: error,
                isError: isError
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
        let editRes = {};
        var userId = this.state.userId;
        var data = this.props.profileData;
        console.log(data);
        const requestOptions =
        {
            method: 'POST',
            url: 'http://localhost:3001/personal-profile-edit',
            body:
                JSON.stringify({
                    userId,
                    data
                }),

            headers: {

                'Content-Type': 'application/json',
            },
        }

        fetch('http://localhost:3001/personal-profile-edit',
            requestOptions)
            .then(res => res.json())
            .then(item => {
                console.log("/personal-profile-edit " + JSON.stringify(item))

                editRes = {
                    message: item.message,
                    sucessfulEdit: item.sucessfulEdit
                }
                return editRes;
            }).catch(e => {
                this.setState({ IsError: true })
            });
        setTimeout(() => {
            alert(JSON.stringify(editRes, null, 2));
            console.log(" editRes.sucessfulEdit", editRes.sucessfulEdit)
            if (editRes.sucessfulEdit) {
                window.location.href = "/personal-profile"
            }
        }, 400)
    }

    render() {
        return (
            <div className="personalProfile" >
                {console.log("on personal-profile edit page ")}
                < div className="editPersonalInfo" >
                    <Form {...this.state} onSubmit={this.handleSubmit} onChange={this.handleDataUpdate} />
                    {console.log("IsError ", this.isError)}
                </div>
            </div >
        );
    }
}