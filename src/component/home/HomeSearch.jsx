import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";

const HomeSearch = ({ querys, handleSearch }) => {
  return (
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
  );
};

export default HomeSearch;
