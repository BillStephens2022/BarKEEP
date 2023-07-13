import React,{ useState } from "react";
import "../styles/Home.css";
import Button from "../components/Button";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import { Auth } from '../utils/auth';

const Login = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [login] = useMutation(LOGIN_USER);

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
  };

  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true)
  };

  const handleGuestClick = async () => {
    console.log("logging in as guest!");
    
    const guestLoginData =  {
      email: "guest@gmail.com",
      password: "password"
    }

    try {
      const { data } = await login( 
        {variables : { ...guestLoginData }, 
      });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="login_page">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Log In / Register</h2>
      <h5 className="subtitle-2">Try our <span className="subtitle-2-span" onClick={handleGuestClick}> 'Guest Login' </span> for a test drive</h5>
      <Button onClick={handleLoginClick} text="Log In" />
      <Button onClick={handleGuestClick} text="Guest Login" />
      <Button onClick={handleRegisterClick} text="Register" />
      <div className="form_container">
        {showRegisterForm ? (<RegisterForm />) : null}
        {showLoginForm ? (<LoginForm />): null}
      </div>
    </div>
  );
};

export default Login;
