import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { Auth } from "../utils/auth";
import "../styles/pages/Login.css";

const defaultProfilePhoto =
  "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg";

const RegisterForm = () => {

  // State for user registration form data
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePhoto: defaultProfilePhoto, // Default photo URL, user will be able to edit it later with uploaded photo from Profile page
  });

  // state for password verification (user must enter twice upon registration)
  const [passwordVerification, setPasswordVerification] = useState("");

  // checks whether passwords match so that user gets real time message about whether both passwords entered have matched
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // set state for form validation
  const [validated, setValidated] = useState(false);

  // State for showing an alert in case of errors
  const [showAlert, setShowAlert] = useState(false);

  // Use the ADD_USER mutation
  const [addUser] = useMutation(ADD_USER);

  // Use the React Router navigation hook
  let navigate = useNavigate();

  // Function to handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });

    // Update the password verification state when the second password input changes
    if (name === "passwordVerification") {
      setPasswordVerification(value);
      // Update passwords matching state
      setPasswordsMatch(userFormData.password === value);
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Validate the form and check if passwords match
    if (
      form.checkValidity() === false ||
      userFormData.password !== passwordVerification
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // Form is valid, set validated state
    setValidated(true);

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      if (!data) {
        throw new Error("something went wrong!");
      }

      // Login the user after successful registration
      Auth.login(data.addUser.token);
      navigate("/community");
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data and password verification
    setUserFormData({
      username: "",
      email: "",
      password: "",
      profilePhoto: defaultProfilePhoto, //reset profile photo to the default
    });
    setPasswordVerification("");
  };

  return (
    <>
      {/* Registration form */}
      <Form
        noValidate
        validated={validated}
        className="form-register"
        onSubmit={handleFormSubmit}
      >
        {/* Show alert for errors */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your signup!
        </Alert>
        {/* Username field */}
        <Form.Group>
          <Form.Label htmlFor="username" className="login-label">
            Username <span className="required">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            className="login-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email field */}
        <Form.Group>
          <Form.Label htmlFor="email" className="login-label">
            Email <span className="required">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
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

        {/* Password field */}
        <Form.Group>
          <Form.Label htmlFor="password" className="login-label">
            Password <span className="required">*</span>
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

        {/* Password verification field */}
        <Form.Group>
          <Form.Label htmlFor="passwordVerification" className="login-label">
            Confirm Password <span className="required">*</span>
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="passwordVerification"
            onChange={handleInputChange}
            value={passwordVerification}
            className="login-input"
            required
          />
          <Form.Group>
            {passwordsMatch ? (
              <p className="passwords-match-message">Passwords match</p>
            ) : (
              <p className="passwords-dontmatch-message">
                Passwords do not match
              </p>
            )}
          </Form.Group>
        </Form.Group>

        {/* Required field legend */}
        <p className="required-legend">
          <span className="required">*</span> Indicates required field
        </p>

        {/* Submit button */}
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password &&
              userFormData.passwordVerification &&
              passwordsMatch
            )
          }
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

export default RegisterForm;
