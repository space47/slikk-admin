
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import explorerIcon from "@/assets/loyalty/explorer_loyalty.png";
import trendsetterIcon from "@/assets/loyalty/Trendsetter_loyalty.png";
import iconIcon from "@/assets/loyalty/Icon_Loyalty.png";

export const EXPLORER_TIER_DATA = {
  name: "Explorer",
  min_orders: 3,
  src: explorerIcon,
};

export const TRENDSETTER_TIER_DATA = {
  name: "Trendsetter",
  min_orders: 5,
  src: trendsetterIcon,
};

export const ICON_TIER_DATA = {
  name: "Icon",
  min_orders: 10,
  src: iconIcon,
};

function LoyaltyProgress() {
  const [anchor, setAnchor] = useState("");
  const updateSize = () => {
    const leftMost = document.getElementsByClassName("Explorer-img")[0];
    const rightMost = document.getElementsByClassName("Icon-img")[0];
    const line = document.getElementById("loyalty-line");
    if (leftMost && rightMost && line) {
      const leftRect = leftMost.getBoundingClientRect();
      const rightRect = rightMost.getBoundingClientRect();

      const startX = leftRect.right;
      const endX = rightRect.left + rightRect.width / 2;
      const midX = (startX + endX) / 2;
      line.style.left = `${startX}px`;
      line.style.width = `${endX - startX}px`;
      line.style.top = `${(leftRect.top + leftRect.bottom) / 2}px`;
    }
  };

  useEffect(() => {
    // updateSize();
    // document.addEventListener("resize", updateSize)
  }, []);

  return (
    <div className="h-[160px] w-full bg-primary-violet text-primaryWhite flex flex-col justify-center items-center">
      <div className="flex flex-row w-full items-center justify-between px-[2%] progressbar relative mt-6 lg:max-w-4xl">
      <img src={explorerIcon} alt="" />
        {/* <div id="loyalty-line" className={`absolute h-[2px] bg-primaryWhite bg-opacity-55 px-[2%]`}>
                </div> */}
      </div>
      {anchor && (
        <div className="w-full flex flex-row items-start justify-start px-[2%]">
          <Tooltip
            anchorSelect={anchor}
            content="YOU'RE HERE"
            isOpen={true}
            style={{
              backgroundColor: "white",
              color: "#5F023A",
              fontWeight: "bolder",
              fontSize: "12px",
              borderRadius: "10px",
              padding: "6px",
            }}
            place="top"
            positionStrategy="absolute"
          />
        </div>
      )}
    </div>
  );
}

export default LoyaltyProgress;

const ExplorerIconDiv = () => {
  const { min_orders, src, name } = EXPLORER_TIER_DATA;

  return (
    <div
      className={`flex flex-col space-y-1 items-center text-primaryWhite w-[100px] ${name} z-10`}
    >

      <span className="font-bold text-[12px] leading-4 uppercase">{name}</span>
      <span className="text-[12px] text-opacity-45 text-primaryWhite text-center leading-3">{`Order ${min_orders} times to enroll`}</span>
    </div>
  );
};
const TrendSetterIconDiv = () => {
  const { min_orders, src, name } = TRENDSETTER_TIER_DATA;

  return (
    <div
      className={`flex flex-col space-y-1 items-center text-primaryWhite w-[100px] ${name} z-10`}
    >
      <img src={src} className={`w-[60px] ${name}-img`} />
      <span className="font-bold text-[12px] leading-4 uppercase">{name}</span>
      <span className="text-[12px] text-opacity-45 text-primaryWhite text-center leading-3">{`Order ${min_orders} times to enroll`}</span>
    </div>
  );
};
const IconIconDiv = () => {
  const { min_orders, src, name } = ICON_TIER_DATA;

  return (
    <div
      className={`flex flex-col space-y-1 items-center text-primaryWhite w-[100px] ${name} z-10`}
    >
      <img src={src} className={`w-[60px] ${name}-img`} />
      <span className="font-bold text-[12px] leading-4 uppercase">{name}</span>
      <span className="text-[12px] text-opacity-45 text-primaryWhite text-center leading-3">{`Order ${min_orders} times to enroll`}</span>
    </div>
  );
};
