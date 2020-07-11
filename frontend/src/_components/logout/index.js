
import React from "react";
import { useAuth } from "../../context/auth";
import Navbar from "../navbar"
import "../../styles/logout/logout.scss"

function Logout() {
    const { setAuthTokens } = useAuth();
    if (!localStorage.tokens) {
        window.location.href = "/login"
    }
    function logOutTokens() {
        setAuthTokens();
        localStorage.clear();
    }

    return (
        <div className="logout">
            < Navbar />
            <div className="logoutContent">
                <button className="logoutButton" onClick={logOutTokens}>Log out</button>
            </div>
        </div>
    );
}
export default Logout;