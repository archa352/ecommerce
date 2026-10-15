"use client"
import { useState } from "react";

interface  nameType{
    placeholder :  string;
}
export default function PasswordInputBox(props : nameType){
    const [showPassword, setShowPassword] = useState(false);
    return(
        <>
            <input 
                type={`${showPassword ? "text":"password"}`} 
                name="password" className="form-control dz-password" placeholder={props.placeholder} 
            />
            <div className={`show-pass ${showPassword ? "active" : ""}`}
                onClick={()=>setShowPassword(!showPassword)}
            >
                <i className="eye-open fa-regular fa-eye" />
            </div>
        </>
    )
}