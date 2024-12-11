import './login.css';
import { useRef, useState } from 'react';
import { Cancel,Room } from '@mui/icons-material';
import axios from 'axios';

export default function Login({setShowLogin,storage,setCurrentUsername}) {
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
            storage.setItem("user",res.data.username)
            setShowLogin(false)
            setCurrentUsername(res.data.username)
            console.log('Response:', res.data);
            setError(false);
        } catch (err) {
            const message = err.response?.data?.message || err.message || "An error occurred";
            console.log('Error Message:', message);
            setErrorMessage(message);
            setError(true);
        }
    };

    const handlerClose = ()=>{
        setShowLogin(false)
    }
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
            <Cancel className='loginCancel' onClick={handlerClose}/>
        </div>
    );
}
