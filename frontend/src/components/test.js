import React, { Component } from "react";

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testArrayState: []
        }
    }

    componentDidMount() {
        // let testArray = [];
        // fetch("http://localhost:3001/test_select_all")
        //     .then(res => res.json())
        //     .then(dbres => {
        //         testArray = dbres.map(item => {
        //             return {
        //                 testId: item.test_id,
        //                 firstName: item.first_name,
        //                 secondName: item.second_name
        //             };
        //         });
        //         console.log("test array " + JSON.stringify(testArray, null, 4));

        //     });
        // this.setState({
        //     testArrayState: testArray
        // });

        // fetch("http://localhost:3001/test_insert");
        //fetch("http://localhost:3001/test_update");
        fetch("http://localhost:3001/test_delete");

    }
    render() {
        return (
            <div className="test">
                {console.log("on test page ")}
                <p>Test page </p>
                <p>{this.state.testArrayState}</p>
            </div>
        )
    }
}

