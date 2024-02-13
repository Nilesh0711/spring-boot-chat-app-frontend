import React, { useState, useEffect } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { currentUser, updateUser } from "../../redux/auth/Action";

const Profile = ({ handleCloseOpenProfile }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  const { auth } = useSelector((store) => store);
  const [username, setUsername] = useState(
    auth.reqUser?.full_name || "username"
  );
  const [aboutContent, setAboutContent] = useState(
    auth.reqUser?.about || "Happy Coding!"
  );

  const [nameFlag, setNameFlag] = useState(false);
  const [aboutFlag, setAboutFlag] = useState(false);

  const [tempImage, setTempImage] = useState(
    auth.reqUser.profile_picture || null
  );

  useEffect(() => {
    if (token) dispatch(currentUser(token));
  }, [auth.updateUser]);

  const handleUpdateName = () => {
    if (!nameFlag) return;
    if (username.length > 3) {
      let data = {
        id: auth.reqUser.id,
        token: token,
        data: { full_name: username },
      };
      dispatch(updateUser(data));
    } else alert("Username Should be more than three");
  };

  const handleUpdateAbout = () => {
    if (!aboutFlag) return;
    if (aboutContent.length > 3) {
      let data = {
        id: auth.reqUser.id,
        token: token,
        data: { about: aboutContent },
      };
      dispatch(updateUser(data));
    } else alert("About Should be more than three");
  };

  const handleNameFlag = () => {
    handleUpdateName();
    setNameFlag((val) => !val);
  };

  const handleAboutFlag = () => {
    handleUpdateAbout();
    setAboutFlag((val) => !val);
  };

  const handleChangeUserName = (e) => {
    setUsername(e.target.value);
  };

  const handleChangeAbout = (e) => {
    setAboutContent(e.target.value);
  };

  const uploadImageToCloud = (pics) => {
    let data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "whatsapp_clone");
    data.append("cloud_name", "dhfhmbusq");
    fetch("https://api.cloudinary.com/v1_1/dhfhmbusq/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setTempImage(data.url.toString());
        data = {
          id: auth.reqUser.id,
          token: token,
          data: { profile_picture: data.url.toString() },
        };
        dispatch(updateUser(data));
      });
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          className="cursor-pointer text-2xl font-bold"
          onClick={handleCloseOpenProfile}
        />
        <p className="cursor-pointer font-semibold">Profile</p>
      </div>

      {/* update profile section */}
      <div className="flex flex-col justify-center items-center my-12 ">
        <label htmlFor="imgInput">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
            src={
              tempImage ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            }
            alt="image"
          />
          <input
            onChange={(e) => uploadImageToCloud(e.target.files[0])}
            id="imgInput"
            className="hidden"
            type="file"
          />
        </label>
      </div>

      {/* update name section */}
      <div className="bg-white px-3 mx-3">
        <p className="py-3">Full name</p>
        {!nameFlag && (
          <div className="w-full flex justify-between items-center">
            <p className="py-3">{username || "username"}</p>
            <BsPencil onClick={handleNameFlag} className="cursor-pointer" />
          </div>
        )}

        {nameFlag && (
          <div className="w-full flex justify-between items-center py-2">
            <input
              onChange={handleChangeUserName}
              className="w-[80%] outline-none border-b-2 border-blue-700 p-2"
              placeholder="Enter your name"
              value={username}
              type="text"
            />
            <BsCheck2
              onClick={handleNameFlag}
              className="cursor-pointer text-2xl"
            />
          </div>
        )}
      </div>

      <p className="px-3 mt-6 font-light">
        This is not your usesrname, this name will appear to your Whatsapp
        contacts.
      </p>

      {/* update about section */}
      <div className="bg-white px-3 mx-3 mt-12">
        <p className="py-3">About</p>
        {!aboutFlag && (
          <div className="w-full flex justify-between items-center">
            <p className="py-3">{aboutContent || "username"}</p>
            <BsPencil onClick={handleAboutFlag} className="cursor-pointer" />
          </div>
        )}

        {aboutFlag && (
          <div className="w-full flex justify-between items-center py-2">
            <input
              onChange={handleChangeAbout}
              className="w-[80%] outline-none border-b-2 border-blue-700 p-2"
              placeholder="Enter your name"
              value={aboutContent}
              type="text"
            />
            <BsCheck2
              onClick={handleAboutFlag}
              className="cursor-pointer text-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
