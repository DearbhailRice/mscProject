import React, { Component } from 'react';
import "../../styles/table/table.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default class Table extends Component {
    constructor(props) {
        super(props);
    }
    redirect() {
        if (!this.props.redirectURL) return console.log("redirect !")
    }
    render() {
        return (
            <div>
                <div className="tableWrapper">
                    <table className="table">

                        <caption>
                            <div className="captionDiv">
                                <h2>{this.props.componentTitle} </h2>
                                <a onClick={() => { window.location.href = "/learningProfileEdit" }}>
                                    <FontAwesomeIcon className="editIcon" icon={faEdit} size="1x" style={{ margin: "19px" }} />
                                </a>
                            </div>
                        </caption>
                        <thead>

                            {this.props.columnHearder.map((headerName, title) => {
                                return <th key={title}>{headerName}</th>
                            })}

                        </thead>
                        <tbody>
                            {this.props.rowData.map(dataRow => {
                                return (
                                    <tr>
                                        {/* {console.log("Data in row " + dataRow)} */}
                                        {dataRow.map(cellData => {
                                            // console.log("celldata " + cellData)
                                            return <td>{cellData}</td>;
                                        })
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}