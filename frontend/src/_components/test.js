import React, { Component } from "react";
import Navbar from "./navbar/index"
import Table from "./table/index";


export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // testArrayState: [],
            columnHearder: ["Id", "First Name", "Last Name"],
            rowData: [[]],
            redirectURL: "/test",
            currentPoID: "",
            exceptionStatus: 0
        }
    }

    componentWillMount() {
        let testArray = [];
        fetch("http://localhost:3001/test_select_all")
            .then(res => {

                console.log(res.status);
                if (res.status === 200) { return res.json(); }
                // throw `Invalid Query`
            })
            .then(dbres => {
                testArray = dbres.map(item => {
                    return [
                        item.test_id,
                        item.first_name,
                        item.second_name
                    ];
                });
                console.log("test array " + JSON.stringify(testArray, null, 4));


                this.setState({

                    //testArrayState: testArray,
                    rowData: testArray
                })
            }).catch(err => {
                alert(err);
            })
    }
    render() {
        return (
            <div className="test">

                {console.log("on test page ")}
                <Navbar />
                <p>{this.state.testArrayState}</p>
                {console.log("rowData test page" + JSON.stringify(this.state.rowData))}
                <Table {...this.state} navigateRow={this.redirect.bind(this)} />
                {/* <p>{new Table(this.state.testArrayState)}</p> */}
            </div>
        )
    }
    redirect(testId) {
        this.props.history.push({
            pathname: this.state.redirectURL
        })
    }

}

