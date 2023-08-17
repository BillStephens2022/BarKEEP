import React from "react";

/**
 * Button Component
 * 
 * @param {string} text - The text displayed on the button.
 * @param {Function} onClick - The function to be executed when the button is clicked.
 * @param {string} activeButton - The currently active button's identifier.
 * @param {string} customClass - Additional CSS class to customize the button's appearance.
 * @returns {JSX.Element} - A button element.
 */

const Button = ({ text, onClick, activeButton, customClass }) => {
    return (
        <button className={`btn btn-${customClass} btn-${text.replace(/\s/g, "").toLowerCase()} ${activeButton === `${text.replace(/\s/g, "").toLowerCase()}` ? 'active' : ''}`} onClick={onClick}>{text}</button>
    )
}

export default Button;
