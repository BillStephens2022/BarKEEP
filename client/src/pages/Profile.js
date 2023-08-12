import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GoPencil } from "react-icons/go";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { QUERY_ME } from "../utils/queries";
import { EDIT_PROFILE_PHOTO } from "../utils/mutations";
import ProfilePhoto from "../components/ProfilePhoto";
import MyPosts from "../components/MyPosts";
import MyFavorites from "../components/MyFavorites";
import UploadWidget from "../components/UploadWidget";
import "../styles/pages/Profile.css";

const Profile = () => {
  // State to manage view - see My Posts or My Favorite Recipes
  const [view, setView] = useState("myFavorites");

  // State to manage profile photo editing
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [uploadedProfilePhotoUrl, setUploadedProfilePhotoUrl] = useState(null);

  const { loading: userLoading, data: userData, error: userError } = useQuery(QUERY_ME);
  const { me } = userData || {};

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

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <div className="profile">
      <div className="profile-headings">
        <div className="user-heading">
          <div className="user-profile">
            <ProfilePhoto
              imageUrl={
                me?.profilePhoto
                  ? me?.profilePhoto
                  : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
              }
              size={64}
            />
            {editingProfilePhoto ? (
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
            )}
          </div>
          <h3 className="profile-username">{me?.username}</h3>
        </div>
        <h1 className="profile-title">BarKEEP</h1>
        <div className="profile-button-div">
          <h3>View:</h3>
          <button className={`btn btn-view btn-my-favorites ${view === "myFavorites" ? "active" : ""}`} onClick={() => setView("myFavorites")}>Favorite Recipes</button>
          <button className={`btn btn-view btn-my-posts ${view === "myPosts" ? "active" : ""}`} onClick={() => setView("myPosts")}>My Posts</button>
        </div>
      </div>
      {view === "myPosts" ? <MyPosts /> : <MyFavorites />}
     
    </div>
  );
};

export default Profile;
