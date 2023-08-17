import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import "../styles/pages/Home.css";
import { Auth } from "../utils/auth";

const LoginForm = () => {
  // State to manage user form data, validation, and alerts
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Use mutation for login
  const [login] = useMutation(LOGIN_USER);
  
  // Hook to handle navigation after login
  let navigate = useNavigate();

  // Handler for input change in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Login using GraphQL mutation and set Auth token
      const { data } = await login({ variables: { ...userFormData } });
      Auth.login(data.login.token);
      navigate("/community");  // navigate to CommunityPosts after login
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
    // Reset form data
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form
        noValidate
        validated={validated}
        className="form-login"
        onSubmit={handleFormSubmit}
      >  
        {/* Display an alert for login errors */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
         {/* Email input field */}
        <Form.Group>
          <Form.Label htmlFor="email" className="login-label">
            Email
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            className="login-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>
        {/* Password input field */}
        <Form.Group>
          <Form.Label htmlFor="password" className="login-label">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            className="login-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        {/* Submit button */}
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
          className="login-signup-button"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
