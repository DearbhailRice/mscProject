import React, { Component } from 'react';
import "../../styles/personalInfo/personalInfo.scss";


export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.State = {

            rowData: this.props.rowData

        }
    }


    render() {
        return (

            <div className="tableWrapper">
                <table >

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
        if (!this.props.redirectURL) return console.log("redirect !")
    }
}