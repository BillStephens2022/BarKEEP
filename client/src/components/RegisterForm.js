import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import UploadWidget from "./UploadWidget";
import { Auth } from "../utils/auth";
import "../styles/Login.css";

const defaultProfilePhoto =
  "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg";

const RegisterForm = () => {
  // sets initial form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePhoto: defaultProfilePhoto, // Default photo URL
  });

  // set state for form validation
  const [validated, setValidated] = useState(false);

  // set loading state for profile photo upload
  const [isUploading, setIsUploading] = useState(false); 

  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  const [addUser] = useMutation(ADD_USER);

  // Function to handle photo upload success
  const handleUploadSuccess = (result) => {
    const convertedUrl = result.info.secure_url.replace(/\.heic$/, ".jpg");
    setUserFormData({
      ...userFormData,
      profilePhoto: convertedUrl, // Save the uploaded photo URL
    });
    setIsUploading(false); // Set the uploading state to false after successful upload
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(userFormData);

    if (userFormData.username && userFormData.email && userFormData.password) {
      setIsUploading(true); // Start the upload process if necessary fields are filled
    }

    setValidated(true);

    if (isUploading) {
      // Wait for the upload to complete before submitting the form
      return;
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      if (!data) {
        throw new Error("something went wrong!");
      }

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
      profilePhoto: defaultProfilePhoto, //reset profile photo to the default
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form
        noValidate
        validated={validated}
        className="form-register"
        onSubmit={handleFormSubmit}
      >
        {/* show alert if server response is bad */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your signup!
        </Alert>

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
        <Form.Group className="form-group-upload">
          <Form.Label className="login-label">Profile Photo</Form.Label>
          <UploadWidget onSuccess={handleUploadSuccess} />
        </Form.Group>
        <p className="required-legend">
          <span className="required">*</span> Indicates required field
        </p>
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password &&
              !isUploading // Disable the button while uploading profile photo
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
