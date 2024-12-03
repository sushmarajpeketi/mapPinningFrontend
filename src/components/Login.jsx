import './login.css';
import { useRef, useState } from 'react';
import { Room } from '@mui/icons-material';
import axios from 'axios';

export default function Login() {
    const nameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handlerLogin = async (e) => {
        e.preventDefault();
        const userLogin = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post('/api/users/login', userLogin);
            console.log('Response:', res.data);
            setError(false);
        } catch (err) {
            const message = err.response?.data?.message || err.message || "An error occurred";
            console.log('Error Message:', message);
            setErrorMessage(message);
            setError(true);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                SushmaPin
            </div>
            <form onSubmit={handlerLogin}>
                <input placeholder="username" type="text" ref={nameRef} />
                <input placeholder="password" type="password" ref={passwordRef} />
                <button className="loginBtn" type="submit">Login</button>
                {error && <span className="failure">{errorMessage}.</span>}
            </form>
        </div>
    );
}
