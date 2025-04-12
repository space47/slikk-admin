import rightIcon from "@/assets//general/rightArrow.png";
import currLevelIcon from "@/assets/loyalty/currentLevel.png";
import slikkIcon from "@/assets/loyalty/slikkCoin.png";
import { URL_LOYALTY_POINTS } from "@/common/seo";
import { useAppSelector } from "@/redux/hooks";
import { Points } from "@/redux/types/loyalty.types";
import Link from "next/link";

function LoyaltyTopNav() {
  const data = useAppSelector<Points>((state) => state.loyalty);
  const loyalty = useAppSelector((state) => state.loyalty);
  if (!loyalty.loyalty) {
    return;
  }

  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <Link
        href={URL_LOYALTY_POINTS}
        className="flex flex-row items-center space-x-2 px-2 min-h-[80px] border text-[14px] rounded-xl"
      >
        <img className="h-[50px]" src={slikkIcon} />
        <div className="flex flex-col space-y-1 w-full">
          <span>Available Coins</span>

          <div className="flex flex-row items-center space-x-2">
            <span className="font-bold uppercase text-[18px]">
              {data.available_points}
            </span>
            <div className=" h-full">
              <img src={rightIcon} className=" object-contain w-[5px]" />
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-row items-center space-x-2 px-2 min-h-[80px] border text-[14px] rounded-xl">
        <img className="h-[50px]" src={currLevelIcon} />
        <div className="flex flex-col space-y-1">
          <span>Current Level</span>
          <span className="font-bold uppercase text-[18px]">{loyalty.loyalty}</span>
        </div>
      </div>
    </div>
  );
}

export default LoyaltyTopNav;
