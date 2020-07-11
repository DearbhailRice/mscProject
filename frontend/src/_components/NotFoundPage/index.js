import React, { Component } from 'react';
import "../../styles/personalProfile/personalProfile.scss";
import notFoundImage from "../../images/404Page.png";
import Navbar from '../navbar';
export default class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="personalProfileContent">
                    <img src={notFoundImage} />
                </div>

            </div>
        );
    }
}
