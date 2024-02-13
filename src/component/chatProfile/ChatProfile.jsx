import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";

import { BiSolidDislike } from "react-icons/bi";
import { MdBlock, MdDelete } from "react-icons/md";

const ChatProfile = ({ handleCloseOpenChatProfile, currentChat }) => {
  const { auth } = useSelector((store) => store);

  return (
    <div>
      {/* header */}
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          onClick={handleCloseOpenChatProfile}
          className="cursor-pointer text-2xl font-bold"
        />
        <p className="text-xl font-semibold">{` ${
          currentChat.group ? "Group Info" : "Contact Info"
        }`}</p>
      </div>

      {/* main body */}

      <div className="mt-10 flex flex-col items-center">
        {/* image and name */}
        <div className="flex flex-col items-center">
          <img
            className="w-48 h-48 rounded-full"
            src={
              currentChat.group
                ? currentChat.chat_image
                : auth.reqUser?.id !== currentChat.users[0]?.id
                ? currentChat.users[0].profile_picture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                : currentChat.users[1].profile_picture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            }
            alt="image"
          />
          <p className="mt-6 text-2xl">
            {currentChat.group
              ? currentChat.chat_name
              : auth.reqUser?.id === currentChat.users[0]?.id
              ? currentChat.users[1].full_name
              : currentChat.users[0].full_name}
          </p>
          <p className="mt-1 text-sm font-mono text-gray-600">
            {/* +91 720XX 872XX */}
            {currentChat.group
              ? ""
              : auth.reqUser?.id === currentChat.users[0]?.id
              ? currentChat.users[1].email
              : currentChat.users[0].email}
          </p>
        </div>

        {/* seperator */}
        <div className="h-[15px] w-full bg-[#eaeaec] my-6" />

        {/* about */}
        <div className="flex flex-col px-6 space-y-2 items-start justify-start w-full">
          <h1 className="text-xl font-bold text-stone-600">About</h1>
          <p>
            {currentChat.group
              ? currentChat.chat_name
              : auth.reqUser?.id === currentChat.users[0]?.id
              ? currentChat.users[1].about
              : currentChat.users[0].about}
          </p>
        </div>

        {/* seperator */}
        <div className="h-[15px] w-full bg-[#eaeaec] my-6" />
      </div>

      {/* footer chat related operations */}
      <div className="flex flex-col w-full text-lg text-red-500">
        {/* Block User */}
        <div className="flex items-center space-x-5 hover:bg-gray-200 px-5 py-3 cursor-pointer">
          <MdBlock className="w-6 h-6" />
          <p>
            Block{" "}
            {currentChat.group
              ? currentChat.chat_name
              : auth.reqUser?.id === currentChat.users[0]?.id
              ? currentChat.users[1].full_name
              : currentChat.users[0].full_name}
          </p>
        </div>

        {/* Report User */}
        <div className="flex items-center space-x-5 hover:bg-gray-200 px-5 py-3 cursor-pointer">
          <BiSolidDislike className="w-6 h-6" />
          <p>
            Report{" "}
            {currentChat.group
              ? currentChat.chat_name
              : auth.reqUser?.id === currentChat.users[0]?.id
              ? currentChat.users[1].full_name
              : currentChat.users[0].full_name}
          </p>
        </div>

        {/* Delete User */}
        <div className="flex items-center space-x-5 hover:bg-gray-200 px-5 py-3 cursor-pointer">
          <MdDelete className="w-6 h-6" />
          <p>Delete {currentChat.group ? "group" : "chat"}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
