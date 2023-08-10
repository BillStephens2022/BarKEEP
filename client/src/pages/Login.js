import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import { Auth } from "../utils/auth";
import Header from "../components/Header";
import Button from "../components/Button";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../styles/pages/Login.css";

const Login = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [activeButton, setActiveButton] = useState('');

  const [login] = useMutation(LOGIN_USER);

  let navigate = useNavigate();

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
    setActiveButton('register');
  };

  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
    setActiveButton('login');
  };

  const handleGuestClick = async () => {
    const guestLoginData = {
      email: "guest@gmail.com",
      password: "password",
    };

    try {
      const { data } = await login({ variables: { ...guestLoginData } });
      Auth.login(data.login.token);
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login_page">
      <Header subtitle={"Login / Register"} />
     <div className="login-main">
      <h5 className="subtitle-login-2">
        Try our{" "}
        <span className="subtitle-2-span" onClick={handleGuestClick}>
          {" "}
          'Guest Login'{" "}
        </span>{" "}
        for a test drive
      </h5>
      <Button
        onClick={handleLoginClick}
        activeButton={activeButton}
        text="Log In"
        customClass="login-buttons"
      />
      <Button
        onClick={handleGuestClick}
        text="Guest Login"
        customClass="login-buttons"
      />
      <Button
        onClick={handleRegisterClick}
        activeButton={activeButton}
        text="Register"
        customClass="login-buttons"
      />

      {/* Conditionally render the form-container */}
      {showRegisterForm || showLoginForm ? (
        <div className="form-container-login">
          {showRegisterForm && <RegisterForm />}
          {showLoginForm && <LoginForm />}
        </div>
      ) : null}
      <div className="how-to">
        <h3 className="how-to-heading">How to Get Started</h3>
        <ul className="how-to-list">
          <li>"Login as Guest" for a test drive</li>
          <li>Create an account or sign in if you already have one.</li>
          <li>Search TheCocktailDB API for recipes </li>
          <li>Explore cocktails posted by other enthusiasts.</li>
          <li>Add your own favorite cocktail recipe.</li>
          <li>Save your favorite cocktails to your Favorites page.</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default Login;
