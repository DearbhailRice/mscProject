import React, { Component } from 'react';
import "../../styles/personalInfo/personalInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.State = {

            rowData: this.props.rowData

        }
    }

    redirect() {
        if (!this.props.redirectURL) return console.log("redirect !")
    }


    render() {
        return (

            <div className="tableWrapper">
                <table >
                    <div className="captionDiv">
                        <caption className="tableTitle" ><h2>{this.props.componentTitle} </h2></caption>
                        <a onClick={() => { window.location.href = "/personalProfile/edit" }} {...this.state}>
                            <FontAwesomeIcon className="editIcon" icon={faEdit} size="1x" style={{ margin: "19px" }} />
                        </a>
                    </div>
                    <tbody>
                        <tr>
                            <div className="data">
                                {console.log("coulmn array length " + this.props.columnHearder.length)}
                                {this.props.columnHearder.map((headerName, index) => {
                                    return <tr>
                                        <th scope="row"> <p className="titleElement" key={index}>{headerName}:</p></th>
                                        {this.props.rowData.map(dataRow => {
                                            return <td> <p className="dataElement" > {dataRow[index]}</p></td>
                                        })
                                        }
                                    </tr>

                                })}

                            </div>
                        </tr>
                    </tbody>
                </table>
            </div>


        );
    }
    redirect() {
        this.props.history.push({
            pathname: this.state.redirectURL,
            rowData: this.state.rowData,
            columnHearder: this.state.columnHearder
        })
    }
}