import React from "react";
import { useNavigate } from "react-router-dom";

function StatusUserCard() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/status/{userId}`);
  };

  return (
    <div
    onClick={handleNavigate} 
    className="flex items-center p-3 cursor-pointer">
      <div>
        <img
          className="h-7 w-7 lg:w-10 lg:h-10 rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB9yHxA6DHvci38TYH29l75U9Gl2epxHpt_7vOtptUIw&s"
          alt="image"
        />
      </div>
      <div className="ml-2 text-white">
        <p>username</p>
      </div>
    </div>
  );
}

export default StatusUserCard;
