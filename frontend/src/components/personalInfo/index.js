import React, { Component } from 'react'
import "../../styles/personalInfo/personalInfo.scss"


export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
    }

    redirect() {
        if (!this.props.redirectURL) return console.log("redirect !")
    }
    render() {
        return (

            <div className="tableWrapper">
                <table>
                    <tbody>
                        <tr>
                            <div className="title">
                                {console.log("coulmn array length " + this.props.columnHearder.length)}
                                {this.props.columnHearder.map((headerName, title) => {
                                    var index = title;
                                    // console.log("HEADER INDEX " + title)
                                    return <tr>
                                        <th scope="row"> <p className="element" key={title}>{headerName}</p></th>
                                        {this.props.rowData.map(dataRow => {

                                            // console.log("Data in row " + JSON.stringify(dataRow));

                                            // console.log("array length " + dataRow.length);
                                            // console.log("row data index " + dataRow[index]);
                                            return <td> <p className="element" > {dataRow[index]}</p></td>
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
}