import React from "react";
import LoginForm from "../loginForm/LoginForm";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const registerHandler = () => {
        navigate('/singup');
    }
    return (
        <React.Fragment>
            <div className="container">
                <div className="login-wrapper">
                    <div className="login-form">
                        <LoginForm></LoginForm>
                    </div>
                </div>
                <div className="register-wrap">
                    <div className="register-btn-wrap">
                        <button onClick={(registerHandler)} className="register-btn">Зарегистрироваться</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default HomePage