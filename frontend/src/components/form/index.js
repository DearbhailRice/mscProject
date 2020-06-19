import React, { Component } from "react";
import "../../styles/forms/index.scss";



export default class formUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGoing: true,
            numberOfGuests: 2
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div className="formComponenet">

                <div className="formDiv">

                    <form onSubmit={this.handleSubmit}>
                        <div className="formElement">
                            <label>
                                Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                            </label>
                        </div>
                        <div className="formElement">
                            <label>
                                Is going:
                             <input
                                    name="isGoing"
                                    type="checkbox"
                                    checked={this.state.isGoing}
                                    onChange={this.handleInputChange} />
                            </label>
                        </div>

                        <div className="formElement">
                            <label>
                                Number of guests:
                              <input
                                    name="numberOfGuests"
                                    type="number"
                                    value={this.state.numberOfGuests}
                                    onChange={this.handleInputChange} />
                            </label>
                        </div>
                        <div className="formElement">
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>

            </div>
        );
    }
}