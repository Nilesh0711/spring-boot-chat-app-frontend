import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatCard from "../chatCard/ChatCard";

const HomeUsers = ({
  querys,
  handleCurrentChat,
  handleOnClickChatCard,
  currentChat,
}) => {
  const { auth, chat } = useSelector((store) => store);

  const [userChats, setUserChats] = useState(null);

  useEffect(() => {
    if (!chat.updatedLastChatMessage) return;
    setUserChats((prev) => {
      const updatedChats = prev?.map((item) =>
        item.chat.id === chat?.updatedLastChatMessage?.chat.id
          ? { ...item, message: chat?.updatedLastChatMessage }
          : item
      );
      return updatedChats;
    });
  }, [chat.updatedLastChatMessage]);

  useEffect(() => {
    if (!chat.updatedLastChatCount) return;
    if (currentChat?.id !== chat?.updatedLastChatCount?.chat.id) {
      setUserChats((prev) => {
        const updatedChats = prev?.map((item) =>
          item.chat.id === chat?.updatedLastChatCount?.chat.id
            ? { ...item, messageCount: (item.messageCount || 0) + 1 }
            : item
        );
        return updatedChats;
      });
    }
  }, [chat.updatedLastChatCount]);

  useEffect(() => {
    setUserChats(chat?.chats);
  }, [chat?.chats]);

  useEffect(() => {
    if (!currentChat) return;
    setUserChats((prev) => {
      const updatedChats = prev?.map((item) =>
        item.chat.id === chat?.updatedLastChatCount?.chat.id
          ? { ...item, messageCount: 0 }
          : item
      );
      return updatedChats;
    });
  }, [currentChat]);

  return (
    <div className="bg-white overflow-y-scroll h-[80vh] px-3">
      {querys &&
        auth.searchUser
          ?.filter((item) => item.id !== auth.reqUser?.id)
          .map((item) => (
            <div onClick={(e) => handleOnClickChatCard(item.id)}>
              <hr />
              <ChatCard
                name={item.full_name}
                userImg={
                  item.profile_picture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }
              />
            </div>
          ))}

      {userChats?.length > 0 &&
        !querys &&
        userChats?.map((item) => (
          <div onClick={(e) => handleCurrentChat(item.chat)}>
            <hr />
            {item.chat.group ? (
              <div>
                <ChatCard
                  name={item.chat.chat_name}
                  userImg={
                    item.chat.chat_image ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                  }
                  timestamp={item.message?.timestamp}
                  content={item.message?.content}
                  count={item.messageCount}
                />
              </div>
            ) : (
              <div>
                <ChatCard
                  name={
                    auth.reqUser?.id !== item.chat.users[0]?.id
                      ? item.chat.users[0].full_name
                      : item.chat.users[1].full_name
                  }
                  userImg={
                    auth.reqUser?.id !== item.chat.users[0]?.id
                      ? item.chat.users[0].profile_picture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                      : item.chat.users[1].profile_picture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                  }
                  timestamp={item.message?.timestamp}
                  content={item.message?.content}
                  count={item.messageCount}
                />
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default HomeUsers;
