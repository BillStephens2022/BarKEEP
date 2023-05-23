import React from "react";

const Button = ({ text, onClick }) => {
    return (
        <a className="btn" onClick={onClick}>{text}</a>
    )
}

export default Button;