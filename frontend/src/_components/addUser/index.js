import React, { Component, useImperativeHandle } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import Form from "../form";
import Navbar from "../navbar";

export default class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {

            options: [[]],
            profileData: {
                "Name": "",
                "Work Email": "",
                "Start Date": null,
                "Staff Number": 0,
                "Current Trust Employee": 0,
                "Role": "",
                "Admin User Privilages": 0
            },
            componentTitle: "Add User ",
            inputType: ["text", "email", "date", "number", "radio", "option", "radio"],
            data: {},
            validateError: "",
            isError: false,
            error: "",
            originUrl: "/personal-profile",
            responseData: {}
        }

        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    /**
     * 
     */
    componentWillMount() {

        let optionsObj = [];
        let roleObj = {};
        let caObj = {};
        let combineArr = [];
        console.log(localStorage.getItem('tokens')["isAdmin"])
        // checks if user is logged in, if not redirect to login  else if user does not have admin privilages redirect to 404 page 
        if (!localStorage.tokens) {
            window.location.href = "/login"
        } else if (!JSON.parse(localStorage.getItem('tokens'))['isAdmin']) {
            window.location.href = "/notfound"
        } else {
            //  fetches role and clinical area data to populate options in form 
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
                this.setState({
                    isError: true
                })

                alert(err);
            })
        }
    }

    /**
     * validates form inputs 
     * @param {*} key 
     * @param {*} value 
     * @param {*} ObjToUpdate 
     */
    validate(key, value, ObjToUpdate) {
        let error = "";
        let isError = false;
        this.setState({ validateError: null });
        console.log("value ", value);
        console.log("key ", key);
        if (!value) {
            error = key + ' Required';
            isError = true;
            if ((key == "Name")) {
                if (!/^/.test(ObjToUpdate[key])) {
                }
            } else {
                isError = false;

            }
            console.log(isError, " ", error)

        }
        this.setState({
            validateError: error,
            isError: isError
        })
        console.log("error ", error)
    }

    /**
     * on change in form validation is trigged 
     * @param {*} key 
     * @param {*} value 
     * @param {*} e 
     */
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

    /**
     * submits validated data entered in the form component to the api 
     */
    async handleSubmit() {
        console.log("Handle submit ", this.state.profileData);
        debugger
        let addRes = {};
        var userId = this.state.userId;
        var data = this.state.profileData;
        // prevents empty/  inital data from this.state beinging submitted to the db displays error message 
        if (
            (data.Name == "") ||
            (data["Role"] == "") ||
            (data["Band"] == "") ||
            (data["Staff Number"] == 0) ||
            (data["Start Date"] == null) ||
            (data["Work Email"] == "")) {
            console.log("in data not blank if ")
            addRes = {
                message: "please complete all feilds  "
            }
            this.setState({ IsError: true })
            alert(addRes.message);
        } else {

            console.log("data ", data)
            const requestOptions =
            {
                method: 'POST',
                url: 'http://localhost:3001/add-user',
                body:
                    JSON.stringify({
                        userId,
                        data
                    }),

                headers: {

                    'Content-Type': 'application/json',
                },
            }
            //submitts form data to the api 
            addRes = fetch('http://localhost:3001/add-user',
                requestOptions).then(res => {
                    console.log(res.status);
                    if (res.status === 200) { return res.json(); }

                    throw `Invalid Query`
                })
                .then(data => {
                    console.log("/add-user " + JSON.stringify(data))

                    addRes = {
                        message: data.message,
                        user_id: data.user_id,
                        resetEmailSent: data.resetEmailSent

                    }
                    console.log("addRes ", addRes)
                    return addRes;

                }).catch(err => {
                    this.setState({
                        isError: true
                    })
                    alert(err + " " + addRes.message);
                });

        }

        alert(JSON.stringify(addRes, null, 2));

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
                        {/* statemanagement used to pass data between componenets and allows data manipulation at higher level than form componenet  */}
                        <Form {...this.state} onSubmit={this.handleSubmit} onChange={this.handleDataUpdate} />
                    </div>
                </div>

            </div>
        );
    }
}