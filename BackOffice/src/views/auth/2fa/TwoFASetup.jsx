import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import '../2fa/style2.css'; // Import the CSS file

const TwoFASetup = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [inputError, setInputError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const expectedCode = location.state?.values;

    const {email}= JSON.parse(localStorage.getItem('user'))

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Allow only numbers
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input if a digit is entered
        if (value && index < 5) {
            document.getElementById(`input-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            document.getElementById(`input-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = () => {
        const enteredCode = code.join("").trim(); // Join digits and trim spaces

        if (!enteredCode) {
            setInputError("Verification code is required");
            return;
        }

        if (!expectedCode) {
            setInputError("No verification code found. Please request a new code.");
            return;
        }

        // Compare as strings
        if (enteredCode === expectedCode.toString().trim()) {
            navigate("/app/dashboard/analytics");
        } else {
            setInputError("Invalid code");
        }
    };

    const resendCode = ()=>{
        axios.post("http://localhost:8070/api/users/verfy-account", {email:email}).then((ress)=>{
            navigate('/auth/2fa/', {state:{ values: ress.data.code}})
        }).catch((errr)=>{
            console.log({error: errr})
        })
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-content">
                <div className="login-card">
                    <h2 className="title">Enter Verification Code</h2>
                    <p className="subtitle">Enter the 6-digit code we sent to your Email</p>
                    <div className="code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`input-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="code-input"
                            />
                        ))}
                    </div>
                    {inputError && <small className="error">{inputError}</small>}
                    <button className="verify-button" onClick={handleSubmit}>
                        Verify
                    </button>
                    <p className="resend" onClick={()=>resendCode()}>Resend Code</p>
                </div>
            </div>
        </div>
    );
};

export default TwoFASetup;