import React, { useState } from "react";
import { timeStamptoTime } from "../../util/dateConverter";
import { BsCheck2, BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { deletedMessage, updatedMessage } from "../../redux/message/Action";

const MessageCard = ({
  triggerNotScrollToBottom,
  messageId,
  isReqUserMessage,
  content,
  isGroup,
  user,
  timestamp,
  isEdited,
  isDeleted,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [flag, setFlag] = useState(false);
  const [newContent, setNewContent] = useState(content || "");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditMessage = () => {
    if (!flag) return;
    triggerNotScrollToBottom();
    if (newContent.length > 1) {
      let data = {
        token,
        data: {
          messageId,
          content: newContent,
        },
      };
      dispatch(updatedMessage(data));
      return;
    }
    alert("Message should contain atleast one character");
  };

  const handleFlag = () => {
    handleClose();
    handleEditMessage();
    setFlag((val) => !val);
  };

  const handleChange = (e) => {
    setNewContent(e.target.value);
  };

  const handleDeleteMessage = () => {
    triggerNotScrollToBottom();
    let data = {
      token,
      messageId,
    };
    dispatch(deletedMessage(data));
  };

  return (
    <div
      className={`max-w-[70%] py-1 flex relative space-y-2 ${
        isReqUserMessage ? "self-end" : "self-start"
      } `}
    >
      {/* message profile_picture */}
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

      {/* message main body */}
      <div
        className={`py-2 flex flex-col max-w-full break-words ${
          isReqUserMessage
            ? "bg-[#294B29] rounded-b-xl rounded-tl-xl pr-5 pl-2.5"
            : "bg-[#638889] rounded-b-xl rounded-tr-xl pr-2.5 pl-5"
        }`}
      >
        {/* message content */}
        <div className={`${flag ? "pr-5" : "pr-14"}`}>
          {!isDeleted ? (
            <div>
              {!flag && (
                <p className="text-white text-lg">
                  {newContent || content || "Loading..."}
                </p>
              )}
              {flag && (
                <div className="flex justify-between items-center py-2">
                  <input
                    onChange={handleChange}
                    className="w-full p-2 rounded-md"
                    placeholder="Enter your name"
                    value={newContent}
                    type="text"
                  />
                  <BsCheck2
                    onClick={handleFlag}
                    className="cursor-pointer text-2xl text-white ml-2"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-200 text-lg italic font-mono">
              Message Deleted...
            </p>
          )}
          {isEdited && (
            <p className="text-white text-xs font-light">(Edited)</p>
          )}
          {/* timestamp */}
          <p className="text-white text-xs ml-3 font-thin italic absolute bottom-2 right-2">
            {timeStamptoTime(timestamp)}
          </p>
        </div>

        {/* edit and delete message BsThreeDotsVertical */}
        {isReqUserMessage && !isDeleted && (
          <div className="text-white text-sm absolute italic top-3 right-1">
            <BsThreeDotsVertical
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {!flag && <MenuItem onClick={handleFlag}>Edit</MenuItem>}
              {flag && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setFlag((val) => !val);
                  }}
                >
                  Cancel
                </MenuItem>
              )}
              <MenuItem onClick={handleDeleteMessage}>Delete</MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
