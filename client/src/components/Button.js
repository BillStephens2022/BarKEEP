import React from "react";

const Button = ({ text, onClick, activeButton }) => {
    return (
        <button className={`btn btn-${text.replace(/\s/g, "").toLowerCase()} ${activeButton === `${text.replace(/\s/g, "").toLowerCase()}` ? 'active' : ''}`} onClick={onClick}>{text}</button>
    )
}

export default Button;
