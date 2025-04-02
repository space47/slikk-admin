
import { POSITION_ITEM_BACKEND } from "../utils";
import ComponentGetter from "./ComponentGetter";


function AllComponents({
  data,
  size,
  callBack,
  DefaultComponent,
}: {
  data: POSITION_ITEM_BACKEND[];
  size: any;
  callBack?: (val: any) => void;
  DefaultComponent?: () => JSX.Element;
}) {
 
  if (data?.length == 0 && DefaultComponent != undefined)
    return <>{DefaultComponent()}</>;
  return (
    <div className=" flex flex-col w-full md:gap-y-7 lg:gap-y-10">
      {data?.map((bannerData, key: number) => {
        const dataCount = Number(bannerData?.data_type?.data_count);
        if (Array.isArray(bannerData?.data) && dataCount > 0) {
          bannerData.data = bannerData?.data.slice(0, dataCount);
        }
        return (
          <ComponentGetter
            {...bannerData}
            callBack={callBack}
            size={size}
            key={key}
            DefaultComponent={DefaultComponent || (() => <></>)}
          />
        );
      })}
    </div>
  );
}

export default AllComponents;
