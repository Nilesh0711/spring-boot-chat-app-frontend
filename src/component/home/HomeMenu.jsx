import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { logOutAction } from "../../redux/auth/Action";
import { useNavigate } from "react-router-dom";

export default function HomeMenu({
  handleCreatedGroup,
  handleCloseOpenProfile,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    dispatch(logOutAction());
    navigate("/signup");
  };

  return (
    <div>
      <BsThreeDotsVertical
        className="cursor-pointer"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleCloseOpenProfile}>Profile</MenuItem>
        <MenuItem onClick={handleCreatedGroup}>Create Group</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
