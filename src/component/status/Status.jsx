import React from "react";
import StatusUserCard from "./StatusUserCard";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Status = () => {

    const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center px-[14vw] py-[7vh]">
        {/* leftside */}
        <div className="left h-[85vh] bg-[#1e262c] w-[30%] px-5">
          <div className="pt-5 h-[13%]">
            <StatusUserCard />
          </div>
          <hr className="my-2" />
          <div className="overflow-y-scroll h-[86%]">
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
              <StatusUserCard />
            ))}
          </div>
        </div>
        {/* rightside */}
        <div className="relative h-[85vh] lg:w-[70%] w-[50%] bg-[#0b141a]">
          <AiOutlineClose
            onClick={() => navigate(-1)}
            className="text-white cursor-pointer absolute top-5 right-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
