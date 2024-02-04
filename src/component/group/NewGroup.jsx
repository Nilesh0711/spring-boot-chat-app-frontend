import { Avatar, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { createGroupChat } from "../../redux/chat/Action";
import { useDispatch, useSelector } from "react-redux";
import { BASE_IMAGE } from "../../config/api";

const NewGroup = ({ handleCloseNewGroup, groupMember, handleCreatedGroup }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const { auth, chat, message } = useSelector((store) => store);

  const [groupImg, setGroupImg] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupName, setGroupName] = useState("");

  const uploadImageToCloud = (pics) => {
    setIsImageUploading(true);
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
        console.log("image url inside new group component: ", data);
        setGroupImg(data.url.toString());
        setIsImageUploading(false);
      });
  };

  const handleCreateGroup = () => {
    let memberIds = [];

    memberIds.push(auth.reqUser?.id);
    [...groupMember].map((item) => {
      memberIds.push(item.id);
    });

    let data = {
      userIds: memberIds,
      chat_name: groupName,
      chat_image: groupImg === null ? BASE_IMAGE : groupImg,
    };

    dispatch(createGroupChat({ data, token }));
    handleCreatedGroup();
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          onClick={handleCloseNewGroup}
          className="cursor-pointer text-2xl font-bold"
        />
        <p className="text-xl font-semibold">New Group</p>
      </div>
      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput" className="relative">
          <Avatar
            sx={{ width: "15rem", height: "15rem" }}
            className="w-44 h-44"
            alt="image"
            src={
              groupImg ||
              "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_640.png"
            }
          />
          {isImageUploading && (
            <CircularProgress className="absolute top-[5rem] left-[6rem]" />
          )}
        </label>
        <input
          id="imgInput"
          className="hidden"
          onChange={(e) => uploadImageToCloud(e.target.files[0])}
          type="file"
        />
      </div>
      <div className="w-full flex justify-between items-center py-2 px-5">
        <input
          value={groupName}
          placeholder="Group Subject"
          onChange={(e) => setGroupName(e.target.value)}
          type="text"
          className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent"
        />
      </div>

      {groupName && (
        <div className="py-10 bg-slate-200 flex items-center justify-center">
          <Button onClick={handleCreateGroup}>
            <div className="bg-[#0c977d] rounded-full p-4">
              <BsCheck2 className="text-white font-bold text-3xl" />
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
