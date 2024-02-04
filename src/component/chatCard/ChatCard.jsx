import React from "react";

const ChatCard = ({ name, userImg }) => {
  return (
    <div className="flex items-center justify-center py-2 group cursor-pointer">
      <div className="w-[15%]">
        <img
          className="h-14 w-14 rounded-full"
          src={userImg}
          alt="image"
        />
      </div>
      <div className="w-[85%]">
        <div className="flex justify-between items-center">
          <p className="text-lg">{name}</p>
          <p className="text-sm">timestamp</p>
        </div>
        <div className="flex justify-between items-center">
          <p>message...</p>
          <div className="flex space-x-2 items-center">
            <p className="text-xs py-1 px-2 text-white bg-green-500 rounded-full">
              5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
