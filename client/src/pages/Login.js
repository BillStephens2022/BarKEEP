import React, { useState } from "react";
import "../styles/Home.css";
import Button from "../components/Button";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import { Auth } from "../utils/auth";
import "../styles/Login.css";

const Login = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [activeButton, setActiveButton] = useState('');

  const [login] = useMutation(LOGIN_USER);

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
    console.log("logging in as guest!");

    const guestLoginData = {
      email: "guest@gmail.com",
      password: "password",
    };

    try {
      const { data } = await login({ variables: { ...guestLoginData } });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login_page">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Log In / Register</h2>
      <h5 className="subtitle-2">
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
      />
      <Button
        onClick={handleGuestClick}
        text="Guest Login"
      />
      <Button
        onClick={handleRegisterClick}
        activeButton={activeButton}
        text="Register"
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
  );
};

export default Login;
