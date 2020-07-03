import React, { Component } from 'react';
import "../../styles/personalInfo/personalInfo.scss";


export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.State = {

        }
    }


    render() {
        console.log(Object.keys(this.props.profileData))
        return (
            <table className="tableWrapper">
                <tbody>

                    {/* {console.log("coulmn array length " + this.props.columnHearder.length)} */}
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
    redirect() {
        this.props.history.push({
            pathname: this.state.redirectURL,
            rowData: this.state.rowData,
            columnHearder: this.state.columnHearder
        })
        if (!this.props.redirectURL) return console.log("redirect !")
    }
}