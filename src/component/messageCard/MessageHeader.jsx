import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

const MessageHeader = ({ currentChat, handleCloseOpenChatProfile }) => {
  const { auth } = useSelector((store) => store);

  return (
    <div className="header w-full bg-[#f0f2f5]">
      <div className="flex justify-between">
        <div
          onClick={handleCloseOpenChatProfile}
          className="py-3 space-x-4 flex items-center px-3 cursor-pointer"
        >
          <img
            className="w-10 h-10 rounded-full"
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
          <div className="flex flex-col">
            <p>
              {currentChat.group
                ? currentChat.chat_name
                : auth.reqUser?.id === currentChat.users[0]?.id
                ? currentChat.users[1].full_name
                : currentChat.users[0].full_name}
            </p>
            <p className="text-xs font-light">
              Click here for {currentChat.group ? "group info" : "contact info"}
            </p>
          </div>
        </div>
        <div className="py-3 flex space-x-4 items-center px-3">
          <AiOutlineSearch />
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
