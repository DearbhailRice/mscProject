import React, { Component } from 'react';
import "../../styles/personalInfo/personalInfo.scss";

export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.State = {
            profileData: this.props.profileData
        }
    }

    render() {
        if (!this.props.profileData) {
            console.log("profiledata " + this.props.profileData)
            return window.location.href = "/personal-profile/add"
        } else {
            console.log(Object.keys(this.props.profileData))
            return (
                <table className="tableWrapper">
                    <tbody>
                        {Object.keys(this.props.profileData).map((headerName, index) => {
                            return <tr>
                                <th scope="row"> <p className="titleElement" key={index}>{headerName}:</p></th>
                                <td> <p className="dataElement" > {this.props.profileData[headerName]}</p></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            );
        }
    }

    redirect() {
        this.props.history.push({
            pathname: this.state.redirectURL,
            rowData: this.state.rowData,
            columnHearder: this.state.columnHearder
        })
        if (!this.props.redirectURL) return console.log("redirect !")
    }
}