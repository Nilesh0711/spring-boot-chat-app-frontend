import React from "react";
import { timeStamptoDate } from "../../util/dateConverter";
import { Chip } from "@mui/material";

const DateBadge = ({ timestamp }) => {
  return (
    <Chip
      style={{ fontSize: "16px", backgroundColor: "#00a884", color: "white" }}
      label={timeStamptoDate(timestamp)}
    />
  );
};

export default DateBadge;
