import React, { Component } from "react";
import Navbar from "../navbar";
// import { userService, authenticationService } from '@/_services';
import Form from "../form";

export default class addUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 1,
            options: [[]],
            columnHeader: this.props.columnHeader,
            profileData: {},
            formElementLable: ["Name", "Work Email", "Start Date", "Staff Number", "Current Trust Employee", "Tel. Number", "Personal Email", "Contact on Personal Email", , "Address Line 2", "Address Line 3", "Postcode", "Town", "County", "Emergency Contact Name ", "Emergency Contact Tel. Number", "Emergency Contact Relationship", "Clinical Area", "Role"],
            componentTitle: "Personal Profile Edit ",
            inputType: ["text", "disabled", "disabled", "disabled", "radio", "tel", "email", "radio", "text", "text", "text", "text", "text", "tel", "text", "tel", "text", "option", "option", "option"],
            data: {},
            validateError: ""
        }
    }


    handleDataUpdate(key, value) {
        console.log("key ", key)
        let ObjToUpdate = this.state.profileData
        console.log(ObjToUpdate, " OBJECT UPDATED")
        ObjToUpdate[key] = value;
        // if (key == )
        this.validate(key, value, ObjToUpdate)
        this.setState({
            profileData: ObjToUpdate
        })
    }

    handleSubmit() {

        // console.log("Handle submit ", this.state.profileData);

        // var userId = this.state.userId;
        // var data = this.state.profileData;
        // const requestOptions =
        // {
        //     method: 'POST',
        //     url: 'http://localhost:3001/adduser',
        //     body:
        //         JSON.stringify({
        //             userId,
        //             data
        //         }),

        //     headers: {

        //         'Content-Type': 'application/json',
        //     },
    }

    componentWillMount() {



    }

    render() {

        return <div className="addUser">
            <Navbar />

            <Form {...this.state} onSubmit={this.handleSubmit} onChange={this.handleDataUpdate} />

        </div>


    }
}