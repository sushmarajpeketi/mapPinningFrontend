import { useRef, useState } from "react";
import "./register.css";
import { Room, Cancel } from "@mui/icons-material";
import axios from "axios";
export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [error, setError] = useState();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    console.log("In the handleSubmit");
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    console.log("new User is", newUser);
    try {
      await axios.post("/api/users/register", newUser);
      setFailure(false);
      setSuccess(true);
    } catch (err) {
      console.log("errror is", err);
      setError(
        err.response?.data?.message ||
          error.message ||
          "Oops,Something went wrong"
      );
      setSuccess(false);
      setFailure(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        SushmaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success"> Successfull !!! You can login now</span>
        )}

        {failure && <span className="failure">Oops! something wrong!</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
