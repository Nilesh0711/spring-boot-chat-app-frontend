import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DateBadge from "./DateBadge";
import MessageCard from "./MessageCard";
import Lottie from "react-lottie";
import lottieData from "../../lottie/start_chat.json";

const MessageSection = ({ messages }) => {
  const { auth } = useSelector((store) => store);

  const lottieDefaultConfig = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const messagesEndRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    } else {
      setShouldScrollToBottom(true);
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  const triggerNotScrollToBottom = () => {
    setShouldScrollToBottom(false);
  };

  return (
    <div className="px-10 h-[80vh] overflow-y-auto bg-blue-200">
      <div className="space-y-1 flex flex-col justify-center mt-2 py-2">
        {messages?.length > 0 && messages[0] != null ? (
          messages?.map((item, index) => (
            <div className="w-full flex flex-col" key={index}>
              <div className="w-full items-center justify-center flex py-2">
                <DateBadge timestamp={item[0].timestamp} />
              </div>
              {item.map((item2, index2) => (
                <MessageCard
                  triggerNotScrollToBottom={triggerNotScrollToBottom}
                  messageId={item2.id}
                  isGroup={item2.chat.group}
                  timestamp={item2.timestamp}
                  user={item2.user}
                  key={index2}
                  isReqUserMessage={item2.user.id === auth.reqUser?.id}
                  content={item2.content}
                  isEdited={item2.isEdited}
                  isDeleted={item2.isDeleted}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center my-8 text-black text-3xl font-thin font-serif space-y-4">
            <p>Start your conversation now!</p>
            <p>Send a message to begin chatting.</p>
            {/* Lottie Animation */}
            <div>
              <Lottie options={lottieDefaultConfig} height={400} width={400} />
            </div>
          </div>
        )}
        {/* Empty div used to scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageSection;
