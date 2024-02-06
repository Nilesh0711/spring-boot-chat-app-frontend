import React, { useState, useEffect } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import {
  BsEmojiSmile,
  BsFilter,
  BsMicFill,
  BsThreeDotsVertical,
} from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";

import ChatCard from "./chatCard/ChatCard";
import MessageCard from "./messageCard/MessageCard";

import "./HomePage.css";
import Profile from "./profile/Profile";
import { useNavigate } from "react-router-dom";
import HomeMenu from "./home/HomeMenu";
import CreateGroup from "./group/CreateGroup";
import { currentUser, searchUser } from "../redux/auth/Action";
import { createChat, getUserChat } from "../redux/chat/Action";
import { createMessage, getAllMessage } from "../redux/message/Action";

import SockJS from "sockjs-client";
import { over } from "stompjs";
import Lottie from "react-lottie";
import lottieData from "../lottie/start_chat.json";

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const { auth, chat, message } = useSelector((store) => store);
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const lottieDefaultConfig = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    setMessages(message.message);
  }, [message.message]);

  useEffect(() => {
    if (message.newMessage && stompClient) {
      setMessages((prev) => [...prev, message.newMessage]);
      stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
    }
  }, [message.newMessage]);

  useEffect(() => {
    if (isConnected && stompClient && auth.reqUser && currentChat) {
      stompClient.subscribe(
        "/group/" + currentChat.id.toString(),
        onMessageRecieve
      );
    }
  }, [currentChat, isConnected, stompClient, auth.reqUser]);

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
    let data = {
      token,
      chatId: currentChat?.id,
    };
    if (currentChat?.id) dispatch(getAllMessage(data));
  }, [currentChat]);

  const connect = () => {
    const sock = new SockJS("http://localhost:5454/ws");
    const temp = over(sock);
    setStompClient(() => temp);
    const header = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    };
    temp.connect(header, onConnect, onError);
  };

  const onError = (error) => {
    console.log("on error : ", error);
  };

  const onConnect = () => {
    setIsConnected(true);
  };

  const onMessageRecieve = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    if (
      auth.reqUser.id !== receivedMessage.user.id &&
      currentChat.id === receivedMessage.chat.id
    )
      setMessages((prev) => [...prev, receivedMessage]);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) return parts.pop().split(";").shift();
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
    setCurrentChat(item);
  };

  const handleCreateNewMessage = () => {
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
              <div className="flex justify-between items-center p-3">
                <div
                  onClick={handleCloseOpenProfile}
                  className="flex items-center space-x-3"
                >
                  <img
                    className="rounded-full w-10 h-10 cursor-pointer"
                    src={
                      auth.reqUser?.profile_picture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                    }
                    alt="image"
                  />
                  <p>{auth.reqUser?.full_name}</p>
                </div>
                <div className="space-x-7 text-2xl flex">
                  <TbCircleDashed
                    className="cursor-pointer"
                    onClick={() => navigate("/status")}
                  />
                  <BiCommentDetail />
                  <HomeMenu
                    handleCloseOpenProfile={handleCloseOpenProfile}
                    handleCreatedGroup={handleCreatedGroup}
                  />
                </div>
              </div>

              <div className="relative flex justify-center items-center bg-white py-4 px-3">
                <input
                  className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2"
                  type="text"
                  value={querys}
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                  placeholder="Search or start new Chat"
                />
                <AiOutlineSearch className="left-5 top-7 absolute" />
                <div>
                  <BsFilter className="ml-4 text-3xl" />
                </div>
              </div>
              {/* all users */}
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

                {chat.chats.length > 0 &&
                  !querys &&
                  chat.chats?.map((item) => (
                    <div onClick={(e) => handleCurrentChat(item)}>
                      <hr />
                      {item.group ? (
                        <div>
                          <ChatCard
                            name={item.chat_name}
                            userImg={
                              item.chat_image ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <ChatCard
                            isChat={true}
                            name={
                              auth.reqUser?.id !== item.users[0]?.id
                                ? item.users[0].full_name
                                : item.users[1].full_name
                            }
                            userImg={
                              auth.reqUser?.id !== item.users[0]?.id
                                ? item.users[0].profile_picture ||
                                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                : item.users[1].profile_picture ||
                                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* default whatsapp page */}
        {!currentChat && (
          <div className="w-[70%] flex flex-col items-center justify-center h-full">
            <div className="max-w-[70%] text-center">
              <img
                src="https://www.telefonino.net/app/uploads/2021/11/Whatsapp-Desktop-e-Web-come-usarli-anche-a-smartphone-spento.jpeg"
                alt="image"
              />
              <h1 className="mt-9 text-4xl text-gray-600">WhatsApp Web</h1>
              <p className="my-9">
                Send and receive without keeping your phone online. Use WhatsApp
                on up to 4 Linked devices and 1 phone at the same time.
              </p>
            </div>
          </div>
        )}

        {/* message part */}
        {currentChat && (
          <div className="w-[70%] relative">
            {/* message header */}
            <div className="header absolute top-0 w-full bg-[#f0f2f5]">
              <div className="flex justify-between">
                <div className="py-3 space-x-4 flex items-center px-3">
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
                  <p>
                    {currentChat.group
                      ? currentChat.chat_name
                      : auth.reqUser?.id === currentChat.users[0]?.id
                      ? currentChat.users[1].full_name
                      : currentChat.users[0].full_name}
                  </p>
                </div>
                <div className="py-3 flex space-x-4 items-center px-3">
                  <AiOutlineSearch />
                  <BsThreeDotsVertical />
                </div>
              </div>
            </div>

            {/* message section */}
            <div className="px-10 h-[85vh] overflow-y-scroll bg-blue-200 bg-chatImage2">
              <div className="space-y-1 flex flex-col justify-center mt-20 py-2">
                {messages.length > 0 ? (
                  messages?.map((item, index) => (
                    <MessageCard
                      isGroup={item.chat.group}
                      timestamp={item.timestamp}
                      user={item.user}
                      key={index}
                      isReqUserMessage={item.user.id === auth.reqUser?.id}
                      content={item.content}
                    />
                  ))
                ) : (
                  <div className="text-center my-8 text-black text-3xl font-thin font-serif space-y-4">
                    <p>Start your conversation now!</p>
                    <p>Send a message to begin chatting.</p>
                    {/* Lottie Animation */}
                    <div>
                      <Lottie
                        options={lottieDefaultConfig}
                        height={400}
                        width={400}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* message footer */}
            <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
              <div className="flex justify-between items-center px-5 relative">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
