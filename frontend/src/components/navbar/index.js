import React, { Component } from 'react'
import "../styles/navbar.scss";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {
        return (
            <div className="navbar">
                <header className="header">
                    <div className="logo">
                        <img width="" src={} alt="logo" />
                        <a onClick={() => {
                            window.location.pathname == "/home"
                        }} />
                    </div>
                </header>
            </div>
        );
    }



}