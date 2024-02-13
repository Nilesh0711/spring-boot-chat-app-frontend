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
  deletedMessage,
  getAllMessage,
  getAllMessageLast,
  updatedMessage,
} from "../redux/message/Action";

import MessageHeader from "./messageCard/MessageHeader";
import MessageFooter from "./messageCard/MessageFooter";
import MessageSection from "./messageCard/MessageSection";
import ChatDefault from "./chatCard/ChatDefault";
import HomeHeader from "./home/HomeHeader";
import HomeSearch from "./home/HomeSearch";
import HomeUsers from "./home/HomeUsers";
import { connect } from "../config/socket";
import ChatProfile from "./chatProfile/ChatProfile";

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
  const [isChatProfile, setIsChatProfile] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState(null);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const [isTyping, setIsTyping] = useState(false);
  const [typingChannels, setTypingChannels] = useState([]);

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
    setIsTyping(false);
    setIsChatProfile(false);
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
      const messageDestination = `/group/${currentChat.id.toString()}`;
      const typingDestination = `/group/typing/${currentChat.id.toString()}`;

      if (!subscribedChannels.includes(messageDestination)) {
        stompClient.subscribe(messageDestination, onMessageRecieve);
        setSubscribedChannels((prevChannels) => [
          ...prevChannels,
          messageDestination,
        ]);
      }

      if (!typingChannels.includes(typingDestination)) {
        stompClient.subscribe(typingDestination, onTypingRecieve);
        setTypingChannels((prevChannels) => [
          ...prevChannels,
          typingDestination,
        ]);
      }
    }
  }, [
    currentChat,
    isConnected,
    stompClient,
    auth.reqUser,
    subscribedChannels,
    typingChannels,
  ]);

  // set typing true when content is changing
  useEffect(() => {
    if (content.length < 1 || !auth?.reqUser || !currentChat) return;
    if (stompClient) {
      const payload = { user: auth.reqUser, chat: currentChat };
      stompClient?.send("/app/message/typing", {}, JSON.stringify(payload));
    }
  }, [content]);

  // update message array when new message is created
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

  // update message array when message is updated
  useEffect(() => {
    if (!message.updatedMessage) return;
    setMessages((prev) => {
      const arrayItr1 = prev?.map((item) => {
        const arrayItr2 = item.map((item2) =>
          item2.id === message.updatedMessage.id
            ? {
                ...item2,
                isEdited: true,
                content: message.updatedMessage.content,
              }
            : item2
        );
        return arrayItr2;
      });
      return arrayItr1;
    });
    if (stompClient)
      stompClient?.send(
        "/app/message",
        {},
        JSON.stringify(message.updatedMessage)
      );
  }, [message.updatedMessage]);

  // update message array when message is deleted
  useEffect(() => {
    if (!message.deletedMessage) return;
    setMessages((prev) => {
      const arrayItr1 = prev?.map((item) => {
        const arrayItr2 = item.map((item2) =>
          item2.id === message.deletedMessage.id
            ? { ...item2, isDeleted: true }
            : item2
        );
        return arrayItr2;
      });
      return arrayItr1;
    });
    if (stompClient)
      stompClient?.send(
        "/app/message",
        {},
        JSON.stringify(message.deletedMessage)
      );
  }, [message.deletedMessage]);

  const onMessageRecieve = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    const currentChat = currentChatRef.current;

    // condition to check different user and same currentChat
    if (
      auth.reqUser.id !== receivedMessage.user.id &&
      currentChat.id === receivedMessage.chat.id
    ) {
      // set false to isTyping
      setIsTyping(false);

      // new message from server
      if (!receivedMessage.isEdited && !receivedMessage.isDeleted) {
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

      // deleted message from server
      if (receivedMessage.isDeleted) {
        setMessages((prev) => {
          const arrayItr1 = prev?.map((item) => {
            const arrayItr2 = item.map((item2) =>
              item2.id === receivedMessage.id
                ? { ...item2, isDeleted: true }
                : item2
            );
            return arrayItr2;
          });
          return arrayItr1;
        });
      }

      // edited message from server
      if (receivedMessage.isEdited) {
        setMessages((prev) => {
          const arrayItr1 = prev?.map((item) => {
            const arrayItr2 = item.map((item2) =>
              item2.id === receivedMessage.id
                ? { ...item2, isEdited: true, content: receivedMessage.content }
                : item2
            );
            return arrayItr2;
          });
          return arrayItr1;
        });
      }
    }
    // condition to prevent update from same user side and should be in different chat
    else if (
      auth.reqUser.id !== receivedMessage.user.id &&
      currentChat.id !== receivedMessage.chat.id
    ) {
      dispatch(updateLastMessage(receivedMessage));
      dispatch(updateMessageCount(receivedMessage));
    }
  };

  let typingTimeout = null;
  const onTypingRecieve = (payload) => {
    const receivedUser = JSON.parse(payload.body);
    if (receivedUser.id !== auth?.reqUser.id) {
      setIsTyping(true);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
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

  const handleCloseOpenChatProfile = () => {
    setIsChatProfile((val) => !val);
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
          <div className={` ${isChatProfile ? "w-[40%]" : "w-[70%]"} `}>
            {/* message header */}
            <MessageHeader
              handleCloseOpenChatProfile={handleCloseOpenChatProfile}
              currentChat={currentChat}
            />

            {/* message section */}
            <MessageSection isTyping={isTyping} messages={messages} />

            {/* message footer */}
            <MessageFooter
              handleCreateNewMessage={handleCreateNewMessage}
              setContent={setContent}
              content={content}
            />
          </div>
        )}

        {/* Chat Profile */}
        {isChatProfile && (
          <div className="w-[30%]">
            <ChatProfile
              currentChat={currentChat}
              handleCloseOpenChatProfile={handleCloseOpenChatProfile}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
