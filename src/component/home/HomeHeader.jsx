import React from "react";
import { BiCommentDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import HomeMenu from "./HomeMenu";
import { TbCircleDashed } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const HomeHeader = ({ handleCloseOpenProfile, handleCreatedGroup }) => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  return (
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
  );
};

export default HomeHeader;
