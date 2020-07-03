import React, { Component } from "react";
import "../../styles/forms/index.scss";



export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    cancelEdit = () => {
        document.getElementById("formWrapper").reset();
    }

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
                inputValue = this.props.profileData[label];
                break;
            default: inputValue = typeOfInput;

        }


        if (typeOfInput == "radio") {
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

        }

        if (typeOfInput == "option") {

            return <select onChange={(e) => {

                const value = e.target.value;
                this.props.onChange(label, value)
            }} required>
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

        //label  and value \\ componentTitle 

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

                        <form id="formWrapper">

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

                                <button className="formButton" type="submit" value="Save" onClick={this.props.onSubmit} >Save</button>
                                <input className="formButton" type="reset" value="Cancel" onClick={() => { window.location.href = this.props.originUrl }} />
                            </div>
                        </form>
                    </fieldset>
                </div>

            </div>
        );
    }
}