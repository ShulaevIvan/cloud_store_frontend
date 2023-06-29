import React from 'react'


const LoginForm = () => {
    return (
        <React.Fragment>
            <form>
                <label>Login</label>
                <input type='text' />
                <label>Password</label>
                <input type='password' />
                <button>Войти</button>
            </form>
        </React.Fragment>
    );
};

export default LoginForm