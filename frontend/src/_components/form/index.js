import React, { Component } from "react";
import "../../styles/forms/index.scss";



export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    checkOptionType(optionData, label) {


        optionData.map((data, indexData) => {

            if (("Role" == data.type) && ("Role" == label)) {
                if (!data.option1) {
                    return
                }
                console.log("in role if")
                console.log("Band " + data.option2 + " " + data.option1)
                return <option key={indexData} value={data}>{"Band " + data.option2 + " " + data.option1}</option>
            } else if (("Clinical Area" == data.type) && ("Clinical Area" == label)) {
                if (!data.option1) {
                    return
                }
                console.log("in else ")
                return <option key={indexData} value={data}>{data.option1}</option>
            } else {
                return
            }

        })


    }

    generateRow(typeOfInput, index, label) {
        let inputValue;
        let isDisabled = false;

        switch (typeOfInput) {
            case "checkbox": inputValue = 1;
                break;
            case "option": inputValue = "option";
                break;
            case "disabled": inputValue = "disabled";
                isDisabled = true;
                break;
            case "radio":

            case "text":

            case "email":

            case "date":

            case "tel":
                if (this.props.rowData.length > 0) {
                    inputValue = this.props.rowData.map(dataInRow => {
                        return dataInRow[index];
                    })

                } else {
                    inputValue = typeOfInput;
                }
                break;
            default: inputValue = typeOfInput;

        }


        if (typeOfInput == "radio") {
            return <div className="radioButtons">
                <label >
                    <input type="radio" id="Yes" name="preferance" value="Yes" />
                Yes
                </label>
                <label>
                    <input type="radio" id="No" name="preferance" value="No" />
                No
                </label>
            </div>

        }

        if (typeOfInput == "option") {

            return <select>
                {this.props.options.map((optionData, indexOption) => {
                    console.log("optional Data " + JSON.stringify(optionData, null, 4))
                    this.checkOptionType(optionData, indexOption)
                    return optionData.map((data, indexData) => {
                        console.log("data " + data.type);
                        if (("Role" == data.type) && ("Role" == label)) {
                            if (!data.option1) {
                                return
                            }
                            console.log("in role if")
                            console.log("Band " + data.option2 + " " + data.option1)
                            return <option key={indexData} value={data}>{"Band " + data.option2 + " " + data.option1}</option>
                        } else if (("Clinical Area" == data.type) && ("Clinical Area" == label)) {
                            if (!data.option1) {
                                return
                            }
                            console.log("in else ")
                            return <option key={indexData} value={data}>{data.option1}</option>
                        } else {
                            return
                        }
                    })
                })}
            </select>

        }


        return <input className="formInput" type={typeOfInput} defaultValue={inputValue} disabled={isDisabled} /> //onChange={this.handleChange}  value={inputValue}


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
                                        {this.generateRow(this.props.inputType[index], index, label)}
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