import React, { Component } from 'react';
import "../../styles/table/table.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ReactModal from "react-modal";
import ReactDOM from 'react-dom';




export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        }
    }
    redirect() {
        if (!this.props.redirectURL) return console.log("redirect !")
    }

    openModal() {

        this.setState({ modalIsOpen: true });
    }
    closeModal() {
        this.setState({ modalIsOpen: false });
    }
    componentWillMount() {
        if (typeof (window) !== 'undefined') {
            ReactModal.setAppElement('body')
        }

    }

    render() {

        var certImg = "";
        return (
            <div>

                <div className="tableWrapper">

                    <table className="table">
                        <thead>
                            {this.props.columnHearder.map((headerName, title) => {
                                return <th key={title}>{headerName}</th>
                            })}
                        </thead>
                        <tbody>
                            {this.props.rowData.map(dataRow => {
                                return (
                                    <tr>

                                        {dataRow.map(cellData => {

                                            if (cellData == "Invalid") {
                                                console.log("in date if ")
                                                return <td style={{ color: "red" }}> {cellData}</td>
                                            } else if (cellData == "Valid") {
                                                console.log("in date if ")
                                                return <td style={{ color: "green" }}> {cellData}</td>
                                            }

                                            // console.log("skipped date if ")
                                            if (typeof (cellData) == "string" && cellData.includes("data:")) {
                                                certImg = cellData;
                                                return <img className="certificateImage " src={cellData} onClick={e => { e.stopPropagation(); this.openModal() }} />

                                            }

                                            if (cellData == "displayAddButton") {
                                                return <td><button onClick={() => {
                                                    this.props.addTraining(dataRow[0]);
                                                }
                                                }>Add</button></td>
                                            } else if (cellData == "disableAddButton") {
                                                return <td> In Learning Profile </td>
                                            } else if (cellData == "editButton") {
                                                return <td><button onClick={() => {
                                                    this.props.editTraining(dataRow[0]);
                                                }
                                                }>Edit</button></td>
                                            }
                                            else if (cellData == "removeButton") {
                                                return <td><button onClick={() => {
                                                    this.props.removeTraining(dataRow[0]);
                                                }
                                                }>Remove</button></td>
                                            }
                                            else {
                                                return <td>{cellData}</td>
                                            }

                                        })
                                        }
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>

                </div>
                <ReactModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={() => this.closeModal}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.75)"
                        },
                        content: {
                            margin: "0 auto",
                            top: "25%",
                            width: "50%",
                            height: "50%"
                        }
                    }}
                >
                    <div className="modal-content">
                        <div className="closeIconDiv"><FontAwesomeIcon onClick={() => this.closeModal()} icon={faTimesCircle} /></div>
                        <div className="certificateImgDiv"><img className="certificateImageModal" src={certImg} /></div>

                    </div>
                </ReactModal>
            </div >
        );
    }
}
