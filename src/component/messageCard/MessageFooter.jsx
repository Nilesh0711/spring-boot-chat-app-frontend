import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";

import { BsEmojiSmile, BsMicFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";

const MessageFooter = ({ handleCreateNewMessage, setContent, content, handleOnMessageChange }) => {
  const [isEmoji, setIsEmoji] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setContent((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleIsEmoji = () => {
    setIsEmoji((prev) => !prev);
  };

  return (
    <div className="footer bg-[#f0f2f5] w-full py-3 text-2xl">
      <div className="flex justify-evenly items-center px-5 relative">
        <BsEmojiSmile className="cursor-pointer" onClick={handleIsEmoji} />
        <div className="absolute bottom-16 left-5 ease-in-out">
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            open={isEmoji}
            height={300}
          />
        </div>
        {/* <ImAttachment /> */}

        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateNewMessage();
              setContent("");
            }
          }}
          placeholder="Type Message"
          value={content}
          className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
          onChange={(e) => setContent(e.target.value)}
          type="text"
        />
        {/* <BsMicFill /> */}
      </div>
    </div>
  );
};

export default MessageFooter;
