import React, { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../chatCard/ChatCard";
import NewGroup from "./NewGroup";
import { searchUser } from "../../redux/auth/Action";
import { useDispatch, useSelector } from "react-redux";

const CreateGroup = ({ handleCreatedGroup }) => {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const { auth, chat, message } = useSelector((store) => store);

  const [newGroup, setNewGroup] = useState(false);
  const [groupMember, setGroupMember] = useState(new Set());
  const [query, setQuery] = useState("");

  const handleRemoveMember = (item) => {
    const newGroupMember = new Set(groupMember);
    newGroupMember.delete(item);
    setGroupMember(newGroupMember);
  };

  const handleSearch = (e) => {
    setQuery(() => e.target.value);
    if (query.length > 0) dispatch(searchUser({ keyword: query, token }));
  };

  const handleCloseNewGroup = () => {
    setNewGroup((val) => !val);
  };

  return (
    <div className="w-full h-full">
      {!newGroup && (
        <div>
          <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
            <BsArrowLeft
              onClick={handleCreatedGroup}
              className="cursor-pointer text-2xl font-bold"
            />
            <p className="text-xl font-semibold">Add Group participants</p>
          </div>

          {/* selected members & search input */}
          <div className="relative bg-white py-4 px-3">
            <div className="flex space-x-2 flex-wrap space-y-1">
              {groupMember.size > 0 &&
                [...groupMember].map((item, index) => (
                  <SelectedMember
                    handleRemoveMember={() => handleRemoveMember(item)}
                    member={item}
                    key={index}
                  />
                ))}
            </div>
            <input
              placeholder="Search user"
              className="outline-none borber-b border-[#8888] p-2 w-[93%]"
              onChange={(e) => {
                handleSearch(e);
              }}
              type="text"
              value={query}
            />
          </div>

          {/* search users results */}
          <div className="bg-white overflow-y-scroll h-[50.2vh] p-3">
            {query &&
              auth.searchUser?.map((item, index) => (
                <div
                  onClick={() => {
                    groupMember.add(item);
                    setGroupMember(groupMember);
                    setQuery("");
                  }}
                  key={index}
                >
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
          </div>

          <div className="flex bottom-10 py-10 bg-slate-200 items-center justify-center">
            <div
              className="bg-green-600 rounded-full p-4 cursor-pointer"
              onClick={() => {
                setNewGroup(true);
              }}
            >
              <div>
                <BsArrowLeft className="text-white font-bold text-3xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      {newGroup && <NewGroup handleCreatedGroup={handleCreatedGroup} groupMember={groupMember} handleCloseNewGroup={handleCloseNewGroup}/>}
    </div>
  );
};

export default CreateGroup;
