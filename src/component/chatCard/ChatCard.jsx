import React from "react";
import { timeStamptoTime } from "../../util/dateConverter";
import { shortenText } from "../../util/shortenText";

const ChatCard = ({ name, userImg, content, timestamp, count = 0 }) => {
  return (
    <div className="flex items-center justify-center py-2 group cursor-pointer">
      <div className="w-[15%]">
        <img className="h-14 w-14 rounded-full" src={userImg} alt="image" />
      </div>
      <div className="w-[85%]">
        <div className="flex justify-between items-center">
          <p className="text-lg">{name}</p>
          <p className={`text-sm ${count > 0 ? "font-bold" : ""}`}>
            {(timestamp && timeStamptoTime(timestamp)) || ""}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className={`${count > 0 ? "font-bold" : ""}`}>
            {(content && shortenText(content)) || "Start your conversation!"}
          </p>
          <div className="flex space-x-2 items-center">
            <p
              className={`text-xs py-1 px-2 text-white bg-green-500 rounded-full ${
                count > 0 ? "visible" : "hidden"
              }`}
            >
              {count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
