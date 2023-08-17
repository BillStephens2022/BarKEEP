import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { GoPencil } from "react-icons/go";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { EDIT_PROFILE_PHOTO } from "../utils/mutations";
import ProfilePhoto from "./ProfilePhoto";
import UploadWidget from "./UploadWidget";
import ShimmerLoader from "./ShimmerLoader";
import "../styles/components/Header.css";

const Header = ({ subtitle, page }) => {
  // State to manage profile photo editing
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [uploadedProfilePhotoUrl, setUploadedProfilePhotoUrl] = useState(null);
  const { loading, data } = useQuery(QUERY_ME);
  const { me } = data || {};
  
  // Mutation to edit the profile photo
  const [editProfilePhoto] = useMutation(EDIT_PROFILE_PHOTO, {
    // Update the cache after editing the profile photo
    update(cache, { data: { editProfilePhoto } }) {
      const { me } = cache.readQuery({ query: QUERY_ME });

      cache.writeQuery({
        query: QUERY_ME,
        data: {
          me: {
            ...me,
            profilePhoto: editProfilePhoto.profilePhoto,
          },
        },
      });
    },
    onCompleted(data) {
      console.log("Profile photo updated:", data);
    },
    onError(error) {
      console.error("Profile photo update failed:", error);
    },
  });
  
  // Handler for successful image upload
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
    if (uploadedProfilePhotoUrl) {
      try {
        editProfilePhoto({
          variables: {
            profilePhoto: uploadedProfilePhotoUrl,
          },
          refetchQueries: [{ query: QUERY_ME }],
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
  
  // if data loading, render the ShimmerLoader component
  if (loading) {
    return <ShimmerLoader />;
  }

  return (
    <div className={`header header-${page}`}>
      <div className="header-user">
        <div className="header-profile-photo">
          {/* Render profile photo in page header for various pages except for About, Login, and Logout pages */}
          {page !== "about" && page !== "logout" && page !== "login" ? (
            <ProfilePhoto
              imageUrl={
                me?.profilePhoto
                  ? me?.profilePhoto
                  : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
              }
              size={64}
            />
          ) : null}
          {/* Conditionally render edit button on Profile page */}
          {page === "profile" ? (
            editingProfilePhoto ? (
              <div className="upload-widget-edit-profile-photo">
                {/* Conditionally render the UploadWidget when editingProfilePhoto is true (i.e. when edit button/pencil is clicked) */}
                <UploadWidget onSuccess={handleSuccessfulUpload} />
              </div>
            ) : (
              // Display message to user when Pencil icon is hovered
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
        {/* Render username next to profile photo except on About, Login, and Logout pages */}
        {page !== "about" && page !== "logout" && page !== "login" ? (
          <h3 className="header-username">{me?.username}</h3>
        ) : null}
      </div>
      {/* Render header title and subtitle */}
      <h1 className="header-title"><span className="header-title-left">Bar</span><span className="header-title-right">KEEP</span></h1>
      <h2 className="header-subtitle">{subtitle}</h2>
    </div>
  );
};

export default Header;
