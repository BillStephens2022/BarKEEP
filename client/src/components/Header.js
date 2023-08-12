import React, { useState } from "react";
import "../styles/components/Header.css";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { GoPencil } from "react-icons/go";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { EDIT_PROFILE_PHOTO } from "../utils/mutations";
import ProfilePhoto from "./ProfilePhoto";
import UploadWidget from "./UploadWidget";

// import { Auth } from "../utils/auth";

const Header2 = ({
  subtitle,
  page,
}) => {
     // State to manage profile photo editing
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [uploadedProfilePhotoUrl, setUploadedProfilePhotoUrl] = useState(null);
  const { loading, data } = useQuery(QUERY_ME);
  const { me } = data || {};



  const [editProfilePhoto] = useMutation(EDIT_PROFILE_PHOTO, {
    onCompleted(data) {
      console.log("Profile photo updated:", data);
    },
    onError(error) {
      console.error("Profile photo update failed:", error);
    },
  });

  const handleSuccessfulUpload = (result) => {
    // When the upload is successful, Cloudinary returns the secure_url in the result
    if (result && result.info.secure_url) {
      const convertedUrl = result.info.secure_url.replace(/\.heic$/, ".jpg");
      console.log("converted URL: ", convertedUrl);
      setUploadedProfilePhotoUrl(convertedUrl, () => {
        handleProfilePhotoUpdate(convertedUrl);
      });
      console.log("uploaded profile photo url: ", uploadedProfilePhotoUrl);
      handleProfilePhotoUpdate(convertedUrl);
    }
  };

  // Function to handle the profile photo update
  const handleProfilePhotoUpdate = async (uploadedProfilePhotoUrl) => {
    // Call the mutation to update the profile photo with the new secure_url
    console.log("url for photo in handleProfilePhotoUpdate function: ", uploadedProfilePhotoUrl);
    if (uploadedProfilePhotoUrl) {
      try {
        editProfilePhoto({
          variables: {
            profilePhoto: uploadedProfilePhotoUrl,
          },
        });

        // Reset the uploadedProfilePhotoUrl and toggle editing state
        setUploadedProfilePhotoUrl(null);
        toggleEditingProfilePhoto();
      } catch (error) {
        console.error("Profile photo update failed:", error);
      }
    }
  };

  // Function to toggle the editing state
  const toggleEditingProfilePhoto = () => {
    setEditingProfilePhoto((prevState) => !prevState);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`header header-${page}`}>
      <div className="header-user">
        <div className="header-profile-photo">
        {page !== "about" ? 
          <ProfilePhoto
            imageUrl={
              me?.profilePhoto
                ? me?.profilePhoto
                : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
            }
            size={64}
          /> : null }
          {page === "profile" ? (
            editingProfilePhoto ? (
              <div className="upload-widget-edit-profile-photo">
                {/* Conditionally render the UploadWidget when editingProfilePhoto is true */}
                <UploadWidget onSuccess={handleSuccessfulUpload} />
              </div>
            ) : (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Edit Profile Photo</Tooltip>}
              >
                <i className="edit-photo-icon">
                  <GoPencil
                    className="edit-photo-icon-pencil"
                    onClick={toggleEditingProfilePhoto}
                  />
                </i>
              </OverlayTrigger>
            )
          ) : null}
        </div>
        {page !== "about" ? 
        <h3 className="header-username">{me?.username}</h3>
        : null }
        
      </div>
      <h1 className="header-title">BarKEEP</h1>
      <h2 className="header-subtitle">{subtitle}</h2>
    </div>
  );
};

export default Header2;
