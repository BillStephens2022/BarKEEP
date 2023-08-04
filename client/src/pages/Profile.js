import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GoPencil } from "react-icons/go";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { QUERY_ME } from "../utils/queries";
import { EDIT_PROFILE_PHOTO, DELETE_POST } from "../utils/mutations";
import { Auth } from "../utils/auth";
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
import MyPosts from "./MyPosts";
import Favorites from "./Favorites";
import UploadWidget from "../components/UploadWidget";
import "../styles/Profile.css";

const Profile = () => {
  // State to manage view - see My Posts or My Favorite Recipes
  const [view, setView] = useState("myPosts");

  // State to manage profile photo editing
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [uploadedProfilePhotoUrl, setUploadedProfilePhotoUrl] = useState(null);

  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
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
      setUploadedProfilePhotoUrl(convertedUrl);
      console.log("uploaded profile photo url: ", uploadedProfilePhotoUrl);
      handleProfilePhotoUpdate(uploadedProfilePhotoUrl);
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

  return (
    <div className="profile">
      <div className="profile-headings">
        <div className="user-heading">
          <div className="user-profile">
            <ProfilePhoto
              imageUrl={
                me.profilePhoto
                  ? me.profilePhoto
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
          <h3 className="favorites-username">{me.username}</h3>
        </div>
        <h1 className="favorites-title">BarKEEP</h1>
        <div className="profile-button-div">
          <button className="btn btn-my-posts" onClick={() => setView("myPosts")}>My Posts</button>
          <button className="btn btn-favorites" onClick={() => setView("favorites")}>Favorite Recipes</button>
        </div>
      </div>
      {view === "myPosts" ? <MyPosts /> : <Favorites />}
     
    </div>
  );
};

export default Profile;
