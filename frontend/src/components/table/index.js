import React, { Component } from 'react';
import "../../styles/table/table.scss"

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
                        <thead>
                            <tr>
                                {this.props.columnHearder.map((headerName, title) => {
                                    return <th key={title}>{headerName}</th>
                                })}
                            </tr>
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