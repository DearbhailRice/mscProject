import React, { Component } from "react";
import "../../styles/forms/index.scss";

/**
 * Form component created with the central aim of reusibility 
 */
export default class Form extends Component {
    constructor(props) {
        super(props);
    }
    /**
     * resets form data 
     */
    cancelEdit = () => {
        document.getElementById("formWrapper").reset();
    }

    /**
     * checks if data type is an option if so returns option html 
     * @param {*} optionData 
     * @param {*} label 
     */
    checkOptionType(optionData, label) {

        optionData.map((data, indexData) => {

            if (("Role" == data.type) && ("Role" == label)) {
                if (!data.option1) {
                    return
                }
                console.log("in role if")
                console.log("Band " + data.option2 + " " + data.option1)
                return <option key={indexData} value={data} onChange={(e) => {
                    const value = e.target.value;
                    this.props.onChange(label, value)
                }}>{"Band " + data.option2 + " " + data.option1}</option>
            } else if (("Clinical Area" == data.type) && ("Clinical Area" == label)) {
                if (!data.option1) {
                    return
                }
                console.log("in else ")
                return <option key={indexData} value={data} onChange={(e) => {
                    const value = e.target.value;
                    this.props.onChange(label, value)
                }}>{data.option1}</option>
            }
            else {
                return
            }

        })
    }

    /**
     * generates row html based on input type
     * @param {*} typeOfInput 
     * @param {*} index 
     * @param {*} label 
     */
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
            case "date":

            case "radio":

            case "text":

            case "email":

            case "time":

            case "tel":

            case "file":
                inputValue = this.props.profileData[label];
                break;
            default: inputValue = typeOfInput;
        }

        if (typeOfInput == "file") {
            return <input className="formInput" name={label} id={label} type={typeOfInput} onChange={(e) => {
                const value = e.target.value;
                this.props.onChange(label, value, e)
            }
            } />
        } else if (typeOfInput == "radio") {
            return <div className="radioButtons">
                <label >
                    <input type="radio" id="Yes" name={"preferance " + label} value="Yes" onChange={(e) => {
                        const value = e.target.value;
                        this.props.onChange(label, value)
                    }} />
                Yes
                </label>
                <label>
                    <input type="radio" id="No" name={"preferance " + label} value="No" onChange={(e) => {
                        const value = e.target.value;
                        this.props.onChange(label, value)
                    }} />
                No
                </label>
            </div>
        } else if (typeOfInput == "option") {
            return <select onChange={(e) => {
                const value = e.target.value;
                this.props.onChange(label, value)
            }} required>
                <option key={"Please Select"} value={"Please Select"}>Please Select</option>
                {this.props.options.map((optionData, indexOption) => {
                    console.log("optional Data " + JSON.stringify(optionData, null, 4))
                    this.checkOptionType(optionData, indexOption)
                    return optionData.map((data, indexData) => {
                        console.log("data " + data.type);
                        if (("Role" == data.type) && ("Role" == label)) {
                            if (!data.option1) {
                                return
                            }
                            let opt = data.option1 + "," + data.option2;
                            console.log("in role if")
                            console.log("Band " + data.option2 + " " + data.option1)
                            return <option key={indexData} value={opt} >{"Band " + data.option2 + " " + data.option1}</option>
                        } else if (("Clinical Area" == data.type) && ("Clinical Area" == label)) {
                            if (!data.option1) {
                                return
                            }
                            console.log("in else ")
                            return <option key={indexData} value={data.option1}>{data.option1}</option>
                        } else {
                            return
                        }
                    })
                })}
            </select>
        }
        return <input className="formInput" id={label} type={typeOfInput} defaultValue={inputValue} disabled={isDisabled} onChange={(e) => {
            const value = e.target.value;
            this.props.onChange(label, value, e)
        }
        } />
    }

    render() {
        return (
            <div className="formComponenet">
                {(!this.props.validateError) ? <div></div>
                    :
                    <div className="error">
                        {console.log(this.props.validateError)}
                        {this.props.validateError}
                    </div>
                }
                <div className="formDiv">
                    <fieldset className="fieldset">
                        <form id="formWrapper" encType="multipart/form-data">
                            {/* iterates through data packet passed via state mangement to trigger function to create row data */}
                            {Object.keys(this.props.profileData).map((label, index) => {
                                return <div className="formElement">
                                    {(label == "Band") ? <div></div>
                                        :
                                        <label className="formLabel" key={index}>
                                            {label}:
                                        {this.generateRow(this.props.inputType[index], index, label)}
                                        </label>}
                                </div>
                            })}
                            <div className="formElement">
                                <button className="formButton" type="submit" value="Save" onClick={this.props.onSubmit} disabled={this.props.isError}>Save</button>
                                <input className="formButton" type="reset" value="Cancel" onClick={() => { window.location.reload(true); }} />
                            </div>
                        </form>
                    </fieldset>
                </div>
            </div>
        );
    }
}