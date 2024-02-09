import React, { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import "./HomePage.css";
import Profile from "./profile/Profile";
import { useNavigate } from "react-router-dom";
import CreateGroup from "./group/CreateGroup";
import { currentUser, searchUser } from "../redux/auth/Action";
import {
  createChat,
  getUserChat,
  updateLastMessage,
  updateMessageCount,
} from "../redux/chat/Action";
import {
  createMessage,
  getAllMessage,
  getAllMessageLast,
} from "../redux/message/Action";

import MessageHeader from "./messageCard/MessageHeader";
import MessageFooter from "./messageCard/MessageFooter";
import MessageSection from "./messageCard/MessageSection";
import ChatDefault from "./chatCard/ChatDefault";
import HomeHeader from "./home/HomeHeader";
import HomeSearch from "./home/HomeSearch";
import HomeUsers from "./home/HomeUsers";
import { connect } from "../config/socket";

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const { auth, chat, message } = useSelector((store) => store);
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const currentChatRef = useRef(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState(null);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const fetchData = async () => {
    try {
      const { temp, connected } = await connect();
      setStompClient(temp);
      setIsConnected(connected);
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  useEffect(() => {
    if (!auth.reqUser) navigate("/signup");
  }, [auth.reqUser]);

  useEffect(() => {
    dispatch(currentUser(token));
  }, [token]);

  useEffect(() => {
    dispatch(getUserChat(token));
  }, [chat.createdChat, chat.createdGroup]);

  useEffect(() => {
    setMessages(message.message);
  }, [message.message]);

  useEffect(() => {
    currentChatRef.current = currentChat;
    let data = {
      token,
      chatId: currentChat?.id,
    };
    if (currentChat?.id) dispatch(getAllMessage(data));
  }, [currentChat, currentChatRef.current]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isConnected && stompClient && auth.reqUser && currentChat) {
      const channel = `/group/${currentChat.id.toString()}`;

      if (!subscribedChannels.includes(channel)) {
        stompClient.subscribe(channel, onMessageRecieve);
        setSubscribedChannels((prevChannels) => [...prevChannels, channel]);
      }
    }
  }, [currentChat, isConnected, stompClient, auth.reqUser, subscribedChannels]);

  useEffect(() => {
    if (!message.newMessage) return;
    dispatch(updateLastMessage(message.newMessage));
    setMessages((prevMessages) => {
      if (prevMessages.length > 0) {
        const lastArrayIndex = prevMessages.length - 1;
        const updatedLastArray = [
          ...prevMessages[lastArrayIndex],
          message.newMessage,
        ];
        return [...prevMessages.slice(0, lastArrayIndex), updatedLastArray];
      } else {
        return [[message.newMessage]];
      }
    });
    if (stompClient)
      stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
  }, [message.newMessage]);

  useEffect(() => {
    if (!message.updatedMessage) return;
    setMessages((prev) => {
      const arrayItr1 = prev?.map((item) => {
        const arrayItr2 = item.map((item2) =>
          item2.id === message.updatedMessage.id
            ? { ...item2, isEdited: true, content }
            : item2
        );
        return arrayItr2;
      });
      return arrayItr1;
    });
  }, [message.updatedMessage]);

  useEffect(() => {
    if (!message.deletedMessage) return;
    setMessages((prev) => {
      const arrayItr1 = prev?.map((item) => {
        const arrayItr2u = item.map((item2) =>
          item2.id === message.deletedMessage.id
            ? { ...item2, isDeleted: true }
            : item2
        );
        return arrayItr2u;
      });
      return arrayItr1;
    });
  }, [message.deletedMessage]);

  const onMessageRecieve = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    const currentChat = currentChatRef.current;
    if (
      auth.reqUser.id !== receivedMessage.user.id &&
      currentChat.id === receivedMessage.chat.id
    ) {
      setMessages((prevMessages) => {
        if (prevMessages.length > 0) {
          const lastArrayIndex = prevMessages.length - 1;
          const updatedLastArray = [
            ...prevMessages[lastArrayIndex],
            receivedMessage,
          ];
          return [...prevMessages.slice(0, lastArrayIndex), updatedLastArray];
        } else {
          return [[receivedMessage]];
        }
      });
    }
    dispatch(updateLastMessage(receivedMessage));
    dispatch(updateMessageCount(receivedMessage));
  };

  const handleSearch = (e) => {
    setQuerys(() => e.target.value);
    if (querys.length > 0) dispatch(searchUser({ keyword: querys, token }));
  };

  const handleOnClickChatCard = (userId) => {
    dispatch(createChat({ data: { userId }, token }));
    setQuerys(() => "");
  };

  const handleCurrentChat = (item) => {
    setCurrentChat(() => item);
  };

  const handleCreateNewMessage = () => {
    if (content.length < 1)
      return alert("Message should contain atleast 1 character");
    let data = {
      chatId: currentChat.id,
      content,
    };
    dispatch(createMessage({ data, token }));
  };

  const handleCloseOpenProfile = () => {
    setIsProfile((val) => !val);
  };

  const handleCreatedGroup = () => {
    setIsGroup((val) => !val);
  };

  return (
    <div>
      <div className="py-14 bg-[#00a884]"></div>
      <div className="relative bg-red-600"></div>
      <div className="flex bg-[#f0f2f5] h-[94vh] w-[96vw] left-[2vw] absolute top-[5vh]">
        <div className="left w-[30%] bg-[#e8e9ec] h-full">
          {/* Profile */}
          {isProfile && (
            <div className="w-full h-full">
              <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
            </div>
          )}

          {/* Create Group */}
          {isGroup && (
            <div className="w-full h-full">
              <CreateGroup handleCreatedGroup={handleCreatedGroup} />
            </div>
          )}

          {/* Home */}
          {!isProfile && !isGroup && (
            <div>
              <HomeHeader
                handleCloseOpenProfile={handleCloseOpenProfile}
                handleCreatedGroup={handleCreatedGroup}
              />

              <HomeSearch handleSearch={handleSearch} querys={querys} />

              {/* all users */}
              <HomeUsers
                currentChat={currentChat}
                querys={querys}
                handleCurrentChat={handleCurrentChat}
                handleOnClickChatCard={handleOnClickChatCard}
              />
            </div>
          )}
        </div>

        {/* default whatsapp page */}
        {!currentChat && <ChatDefault />}

        {/* message part */}
        {currentChat && (
          <div className="w-[70%]">
            {/* message header */}
            <MessageHeader currentChat={currentChat} />

            {/* message section */}
            <MessageSection messages={messages} />

            {/* message footer */}
            <MessageFooter
              handleCreateNewMessage={handleCreateNewMessage}
              setContent={setContent}
              content={content}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
