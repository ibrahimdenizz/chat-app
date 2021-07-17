import React from 'react'
import "./Button.css"

const Button = ({children,className, type,color, onClick}) => {
    const btnColor = color ?  " button-" + color : ""
    const btnClassName = (className ? (" " + className) : "")
    const btnClasses = "button" + btnClassName + btnColor
    return (
            <button 
                className={btnClasses} 
                type={type} 
                onClick={onClick} 
            >
                {children}
            </button>
    )
}

export default Button
