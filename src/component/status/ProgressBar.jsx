import React, {useEffect, useState} from "react";
import "./ProgressBar.css";

const ProgressBar = ({ index, activeIndex, duration }) => {
  const isActive = (index === activeIndex);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(intervalId);
        return prev;
      });
    }, duration / 100);
  }, [duration, activeIndex]);

  useEffect(() => {
    console.log("activeIndex : " + activeIndex);

    setProgress(0);
  }, [activeIndex]);

  return (
    <div className={`progress-bar-container ${isActive ? "active" : ""}`}>
      <div
        style={{ width: `${progress}%` }}
        className={`${isActive ? "progress-bar" : ""}`}
      ></div>
    </div>
  );
};

export default ProgressBar;
