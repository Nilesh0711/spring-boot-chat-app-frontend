import React from "react";

const MessageCard = ({
  isReqUserMessage,
  content,
  isGroup,
  user,
  timestamp,
}) => {
  return (
    <div
      className={`max-w-[70%] py-1 flex space-y-2 ${
        isReqUserMessage ? "self-end" : "self-start"
      } `}
    >
      {isGroup && !isReqUserMessage && (
        <img
          className="w-8 h-8 rounded-full"
          src={
            user.profile_picture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          }
          alt="user image"
        />
      )}
      <div
        className={`py-2 mx-2 ${
          isReqUserMessage
            ? "bg-[#294B29] rounded-b-xl rounded-tl-xl pr-5 pl-2.5"
            : "bg-[#638889] rounded-b-xl rounded-tr-xl pr-2.5 pl-5"
        }
        }`}
      >
        <p className="text-white text-lg">{content}</p>
      </div>
    </div>
  );
};

export default MessageCard;
