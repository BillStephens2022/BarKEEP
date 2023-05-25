import React,{ useState } from "react";
import "../styles/Home.css";
import Button from "../components/Button";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Login = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
  };

  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true)
  };

  return (
    <div className="login_page">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Log In / Register</h2>
      <Button onClick={handleLoginClick} text="Log In" />
      <Button onClick={handleRegisterClick} text="Register" />
      <div className="form_container">
        {showRegisterForm ? (<RegisterForm />) : null}
        {showLoginForm ? (<LoginForm />): null}
      </div>
    </div>
  );
};

export default Login;
