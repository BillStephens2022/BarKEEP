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
  const [activeButton, setActiveButton] = useState("");

  // Use LOGIN_USER mutation to perform user login
  const [login] = useMutation(LOGIN_USER);

  // Initialize the navigation hook
  let navigate = useNavigate();
  
  // Handle click event to show the registration form
  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
    setActiveButton("register");
  };

  // Handle click event to show the login form
  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
    setActiveButton("login");
  };
 
  // Handle guest login click event to allow user to login as a "guest"
  const handleGuestClick = async () => {
    const guestLoginData = {
      email: "guest@gmail.com",
      password: "password",
    };

    try {
      // Call the LOGIN_USER mutation with guest login data
      const { data } = await login({ variables: { ...guestLoginData } });
      // Use the Auth utility to store the token in local storage
      Auth.login(data.login.token);
      // Navigate to the "CommunityPosts" page after successful login
      navigate("/community");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login_page">
      <Header subtitle="Login / Register" page="login" />
      <div className="login-main gradient-background">
        {/* Display information about guest login */}
        <h5 className="subtitle-login-2">Try our <span className="subtitle-2-span"> 'Guest Login' </span>
          for a test drive
        </h5>
        {/* Render login, guest login, and registration buttons */}
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
        {/* Display a list of steps to get started */}
        <div className="how-to">
          <h3 className="how-to-heading">How to Get Started</h3>
          <ul className="how-to-list">
            <li>"Login as Guest" for a test drive.</li>
            <li>Create an account or sign in if you already have one.</li>
            <li>Search TheCocktailDB API for recipes.</li>
            <li>
              Explore cocktail photos & recipes posted by other enthusiasts.
            </li>
            <li>Add your own favorite cocktail recipe.</li>
            <li>Save your favorite cocktail recipes to your Profile.</li>
            <li>Share recipes with the community.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
