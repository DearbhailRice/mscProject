import React, { Component } from "react";
import Navbar from "../../components/navbar";



export default class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {

    }

    render() {
        return (
            <div className="login">

                {console.log("on login page ")}
                <Navbar />

            </div>
        )
    }
}