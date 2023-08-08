import React, { useState } from "react";
import PropTypes from 'prop-types';
import './Login.css';
const baseUrl = 'http://ec2-15-237-108-189.eu-west-3.compute.amazonaws.com:8080';
const url = `${baseUrl}/api/v1/ToDoList`;

async function loginUser(credentials) {
    return fetch(`${url}/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json());
}

export default function Login({ setToken }) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const [error, setError] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            username: username,
            password: password
        });
        // console.log(response);
        if(response.status === "ok"){
            setToken(response.data);
        } else {
            let error = { username: '', password: '' };
            if(response.message === "wrong username"){
                error.username = 'Username not found.';
            } else if(response.message === "wrong password"){
                error.password = 'Wrong password.';
            }
            setError(error);
        }
    };

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                {error.username.length > 0 && (
                    <div className="login-error">
                        <p>{error.username}</p>
                    </div>
                )}
                {error.password.length > 0 && (
                    <div className="login-error">
                        <p>{error.password}</p>
                    </div>
                )}
                <div>
                    <button type="submit" className="btn btn__primary btn-login">Login</button>
                </div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}