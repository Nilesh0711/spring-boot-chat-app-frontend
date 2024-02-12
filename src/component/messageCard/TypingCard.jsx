import React from "react";
import Lottie from "react-lottie";
import lottieData from "../../lottie/typing.json";

const TypingCard = () => {
  const lottieDefaultConfig = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="bg-[#1e2121] my-6 rounded-b-full rounded-tr-full h-[45px] flex items-center justify-center">
      <Lottie options={lottieDefaultConfig} height={100} width={120} />
    </div>
  );
};

export default TypingCard;
