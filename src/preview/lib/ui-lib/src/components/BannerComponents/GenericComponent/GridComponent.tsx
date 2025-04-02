import { POSITION_ITEM_FRONTEND } from "@/preview/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";
interface GridComponentProps<T, P> extends POSITION_ITEM_FRONTEND {
  data: T[]; // Array of data for mapping over
  RenderComponent: React.ComponentType<P>; // Custom render component
  renderComponentProps: (data: T) => P; // Function to generate props dynamically for each data item
  heartOnClick?: (
    product: any,
    h: boolean,
    setH: React.Dispatch<React.SetStateAction<boolean>>
  ) => void; // Add this line
  isGridCarousel?: boolean;
}

const GridComponent = <T, P>({
  component_config,
  size,
  data,
  RenderComponent,
  renderComponentProps,
  heartOnClick,
  isGridCarousel = false,
}: GridComponentProps<T, P>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize video playing state based on data length
  useEffect(() => {
    if (data.length > 0) {
      setActiveIndex(0); // Reset to the first item
    }
  }, [data]);

  // Set up interval for auto-switching active index every 10 seconds
  useEffect(() => {
    if (data.length <= 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length); // Loop through items
    }, 10000);

    return () => clearInterval(interval);
  }, [data.length]);

  const cornerRadiusStyle: React.CSSProperties = component_config?.web_corner_radius
    ? {
        borderRadius: `${component_config.web_corner_radius}px`,
      }
    : {};

  // Combine styles
  const combinedStyle: React.CSSProperties = {
    // padding: "0px", // Fixed padding
    // boxSizing: "border-box", // Include padding within width
    // overflow: "hidden", // Prevent content overflow
  };
  return (
    <div
      className={clsx(
        "container bg-transparent text-black",
        // !component_config?.web_section_margin && "mx-auto ",
        isGridCarousel && "min-w-full"
      )}
      style={{
        ...combinedStyle,
        // paddingRight: (component_config?.web_section_padding ?? 4) * 2,
        // paddingLeft: (component_config?.web_section_padding ?? 4) * 2,
        // marginRight: component_config?.web_section_margin
        //   ? component_config?.web_section_margin * 2
        //   : "auto",
        // marginLeft: component_config?.web_section_margin
        //   ? component_config?.web_section_margin * 2
        //   : "auto",
      }}
    >
      <div
        className={`flex flex-wrap `}
        style={{
          gap: component_config?.web_gap || 0,
          rowGap: component_config?.web_vertical_gap || 0,
          justifyContent: component_config?.section_alignment || "flex-start",
        }}
      >
        {data?.map((d, key: number) => {
          // return (<GenericCard component_config={component_config || {}}  {...d} size={size} key={key} isCarousel={true} />
          const props = renderComponentProps(d); // Get dynamic props based on data
          return (
            <RenderComponent
              key={key}
              {...props}
              component_config={component_config}
              size={size}
              isCarousel={false} // Example prop
              heartOnClick={heartOnClick} // Add this line
              isGridCarousel={isGridCarousel}
              isPlaying={key === activeIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GridComponent;
