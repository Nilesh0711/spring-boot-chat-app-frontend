import React, { useState, useEffect } from "react";
import { stories } from "../../dummy/DummyStories";
import ProgressBar from "./ProgressBar";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const StatusView = () => {
  const [currentStories, setCurrentStories] = useState(0);
  const navigate = useNavigate();

  const handleNextStory = () => {
    if (currentStories < stories?.length - 1) {
      setCurrentStories((curr) => curr + 1);
    } else {
      setCurrentStories(0);
    }
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNextStory();
    }, 2000);
    return () => clearInterval(intervalId);
  }, [currentStories]);

  return (
    <div>
      <div className="relative flex justify-center items-center h-[100vh] bg-slate-900">
        <div className="relative">
          <img
            className="max-h-[96vh] object-contain"
            src={stories?.[currentStories].image}
            alt="image"
          />
          <div className="absolute top-0 flex w-full">
            {stories?.map((item, index) => (
              <ProgressBar
                key={index}
                duration={2000}
                index={index}
                activeIndex={currentStories}
              />
            ))}
          </div>
        </div>
        <div>
          <IoIosArrowRoundBack
            onClick={handleNavigate}
            className="mt-2 text-white text-3xl cursor-pointer absolute top-0 left-10"
          />
          <AiOutlineClose
            onClick={handleNavigate}
            className="mt-2 text-white text-3xl cursor-pointer absolute top-0 right-10"
          />
        </div>
      </div>
    </div>
  );
};

export default StatusView;
