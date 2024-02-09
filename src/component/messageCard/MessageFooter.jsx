import React from "react";
import { BsEmojiSmile, BsMicFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";

const MessageFooter = ({handleCreateNewMessage, setContent, content}) => {
  return (
    <div className="footer bg-[#f0f2f5] w-full py-3 text-2xl">
      <div className="flex justify-between items-center px-5">
        <BsEmojiSmile className="cursor-pointer" />
        <ImAttachment />

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
        <BsMicFill />
      </div>
    </div>
  );
};

export default MessageFooter;
