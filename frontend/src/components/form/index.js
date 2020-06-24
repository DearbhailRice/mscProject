import React, { Component } from "react";
import "../../styles/forms/index.scss";



export default class formUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                    <fieldset className="fieldset">

                        <form onSubmit={this.handleSubmit}>
                            <h2 className="title">{this.props.componentTitle}</h2>
                            {this.props.formElementLable.map((label, index) => {
                                return <div className="formElement">
                                    <label className="formLabel" key={index}>
                                        {label}:

                                    {this.props.inputType.map((typeOfInput, indexType) => {
                                            var inputValue;

                                            if (indexType === index) {

                                                switch (typeOfInput) {
                                                    case "checkbox": inputValue = 1;
                                                        break;
                                                    case "option": inputValue = "option";
                                                        break;
                                                    case "text":

                                                    case "email":

                                                    case "date":

                                                    case "tel":
                                                        // if (this.props.rowData.length > 0) {
                                                        //     inputValue = this.props.rowData.map(dataInRow => {
                                                        //         return dataInRow[index];
                                                        //     })
                                                        // } else {
                                                        inputValue = typeOfInput;
                                                        // }
                                                        break;
                                                    default: inputValue = typeOfInput;
                                                }

                                                // if (typeOfInput == "option") {
                                                //     console.log("options" + JSON.stringify(this.props.options))

                                                //     {
                                                //         this.props.options.map((optionData, indexOption) => {
                                                //             console.log("optional Data " + optionData);

                                                //             return <select > <option key={indexOption} value={indexOption.role_id}>{JSON.stringify(indexOption)}</option> </select>
                                                //         })

                                                //         return
                                                //     }

                                                // }
                                                return <input className="formInput" type={typeOfInput} defaultValue={inputValue} /> //onChange={this.handleChange}  value={inputValue}
                                            }

                                        })
                                        }
                                    </label>
                                </div>
                            })}

                            <div className="formElement">
                                <input className="formButton" type="submit" value="Save" />
                                <input className="formButton" type="reset" value="Reset" />
                            </div>
                        </form>
                    </fieldset>
                </div>

            </div>
        );
    }
}