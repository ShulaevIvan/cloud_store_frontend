import React from 'react'
import { useState, useRef, useEffect } from 'react';


const LoginForm = () => {
    const initialState = {
        loginStatus: true,
        loginInputRef: useRef(null),
        passwordInputRef: useRef(null),
        userData: {},
        
    }
    const [loginFromState, setLoginFormState] = useState(initialState);

    const loginHandler = (e) => {
        e.preventDefault();
        if (loginFromState.loginInputRef.current.value.trim() !== '' && loginFromState.passwordInputRef.current.value !== '') {
            const data = {
                username: loginFromState.loginInputRef.current.value,
                password: loginFromState.passwordInputRef.current.value,
            };
            const fetchFunc = async () => {
                await fetch('http://localhost:8000/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        setLoginFormState(prevState => ({
                            ...prevState,
                            loginStatus: prevState.loginStatus = true,
                            userData: prevState.userData = data
                        }));
                        return;
                    }
                    setLoginFormState(prevState => ({
                        ...prevState,
                        loginStatus: prevState.loginStatus = false
                    }));
                })
            }
            fetchFunc();
            setTimeout(() => {
                console.log(loginFromState.userData)
            }, 1000)
        }
    };


    return (
        <React.Fragment>
            <div className='login-form-wrap'>
                <div className={loginFromState.loginStatus ? 'login-err-hidden' : 'login-err-show'}>
                    <p>неправильный логин или пароль</p>
                </div>
                <form className='login-form'>
                    <div className='login-input-wrap'>
                        <label>Login</label>
                            <input ref={loginFromState.loginInputRef} type='text' />
                    </div>
                    <div className='password-input-wrap'>
                        <label>Password</label>
                            <input ref={loginFromState.passwordInputRef} type='password' />
                    </div>
                    <div className='enter-btn-wrap'>
                        <button onClick={loginHandler}>Enter</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};

export default LoginForm