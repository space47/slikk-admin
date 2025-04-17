import { BANNER_ITEM_FRONTEND, POSITION_ITEM_FRONTEND } from "@/preview/utils";
import { GenderData } from "@/preview/utils/types";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useState } from "react";
import menPng from "../../../assets/pngs/BannerComponents/men.png";
import menSelectedPng from "../../../assets/pngs/BannerComponents/selectedMen.png";
import womenSelectedPng from "../../../assets/pngs/BannerComponents/selectedWomen.png";
import womenPng from "../../../assets/pngs/BannerComponents/women.png";

const GenderVariants = cva("absolute bottom-0 left-3", {
  variants: {
    size: {
      sm: "h-12",
      md: "h-14",
      lg: "h-16",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});
const GenderContainerVariants = cva(
  "flex flex-row  rounded-xl relative border bg-gradient-to-l cursor-pointer",
  {
    variants: {
      size: {
        sm: "min-w-36 max-w-44 w-full h-10 text-sm",
        md: "w-52 h-11",
        lg: "w-56 h-12",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

const ComponentVariants = cva("flex flex-row space-x-4 w-full ", {
  variants: {
    type: {
      centered: "justify-center",
      left: "justify-start",
      right: "justify-end",
    },
  },
  defaultVariants: {
    type: "centered",
  },
});

export const GenderSelector = ({
  numOptions = 2,
  callBack,
  size = "lg",
  genderPosition = "centered",
  defVal = "WOMEN",
  data,
}: POSITION_ITEM_FRONTEND) => {
  // const option: GenderData[] = generateOptions(data);
  const option: GenderData[] = [
    {
      name: "Women",
      icon: womenPng,
      selectedIcon: womenSelectedPng,
      value: "WOMEN",
    },
    {
      name: "Men",
      icon: menPng,
      selectedIcon: menSelectedPng,
      value: "MEN",
    },
  ].splice(0, numOptions || 2);

  const [selectedOption, setSelectedOption] = useState<GenderData>(
    option.filter((g) => g?.value == defVal)[0]
  );

  const handleClick = (data: GenderData) => {
    setSelectedOption(data);
    callBack && callBack(data);
  };

  return (
    <div
      className={clsx(
        ComponentVariants({ type: genderPosition || "centered" }),
        size == "sm" ? " items-end" : " items-center h-20"
      )}
    >
      {option?.map((data, key) => {
        const isSelected = selectedOption?.value == data?.value;
        return (
          <div
            className={clsx(
              "flex justify-center items-end",
              size == "sm" ? "h-12" : "h-16"
            )}
            key={key}
          >
            <div
              //
              className={clsx(
                GenderContainerVariants({ size }),
                isSelected
                  ? data.value == "WOMEN"
                    ? " from-[#0A090A] to-[#673839]  border-[#673839]"
                    : " from-[#0A090A] to-[#0364A5] border-[#03609D]"
                  : "from-[#0A090A] to-[#0A090A]  border-[#58595B]"
              )}
              key={key}
              onClick={() => handleClick(data)}
            >
              <img src={data.icon} alt="" className={GenderVariants({ size })} />
              <div className={"flex items-center justify-center h-full w-full"}>
                <p className={clsx("pl-2 text-white", isSelected && "font-semibold")}>
                  {data.name}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
function generateOptions(data: any): GenderData[] {
  const genderData: GenderData[] = [];
  data?.map((item: BANNER_ITEM_FRONTEND) => {
    const genderItem = {
      name: item.name ?? "",
      icon: item.image_web ?? "",
      selectedIcon: item.image_web ?? "",
      value: item.name ?? "",
    };
    genderData.push(genderItem);
  });
  return genderData;
}
