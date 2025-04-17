import React, { useEffect, useState } from "react"; 
import { CustomGridCarousel } from "../CustomGridCarousel";
import { POSITION_ITEM_FRONTEND } from "@/preview/utils";
import { SingleProductProps } from "@/preview/utils";

interface GridCarouselMobileProps<T, P> extends POSITION_ITEM_FRONTEND {
  data: T[]; // Array of data for mapping over
  RenderCard: React.ComponentType<P>; // Custom render component
  renderCardProps: (data: T) => P; // Function to generate props dynamically for each data item
  heartOnClick?: (
    product: SingleProductProps,
    h: boolean,
    setH: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

export const GridCarouselMobile = <T, P>({
  component_config,
  size,
  data,
  RenderCard,
  renderCardProps,
  heartOnClick,
}: GridCarouselMobileProps<T, P>) => {
  const [isVideoPlaying, setVideoPlaying] = useState<boolean[]>([]);
  const [inView, setInView] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (data.length) {
      setVideoPlaying(data.map(() => false));
    }
  }, [data]);

  const handleSetInView = (idx: number[]) => {
    setInView(idx);
  };

  useEffect(() => {
    if (inView.length > 0) {
      setActiveIndex(0);
    }
  }, [inView]);

  useEffect(() => {
    (inView || []).forEach((index) =>
      setVideoPlaying((prev) => {
        const modified = [...prev];
        modified[index] = false;
        return modified;
      })
    );
    setVideoPlaying((prev) => {
      const modified = [...prev];
      modified[inView[activeIndex]] = true;
      return modified;
    });
    const interval = setInterval(() => {
      if (inView.length === 0) return;
      setActiveIndex((prev) => (prev + 1) % inView.length);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, inView]);
  useEffect(() => {
    if (inView.length) {
      setVideoPlaying((prev) => {
        const modified = [...prev];
        modified.forEach((_, index) => {
          modified[index] = false;
        });
        modified[activeIndex] = true;
        return modified;
      });
    }
  }, [activeIndex]);
  const cornerRadiusStyle: React.CSSProperties = component_config?.corner_radius
    ? {
        borderRadius: `${component_config.corner_radius}px`,
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
      className="w-full"
      style={{
        ...combinedStyle,
        // paddingRight: (component_config?.section_padding ?? 0) * 2,
        // paddingLeft: (component_config?.section_padding ?? 0) * 2,
        // marginRight: (component_config?.section_margin ?? 0) * 2,
        // marginLeft: (component_config?.section_margin ?? 0) * 2,
      }}
    >
      <CustomGridCarousel
        items={data}
        renderCard={(d: T, index: number) => (
          <RenderCard
            key={index}
            {...renderCardProps(d)} // Use the mapping function to get the correct props
            component_config={component_config} // Pass the component config
            size={size} // Pass the size
            isCarousel={true} // Indicate that it's in a carousel
            heartOnClick={heartOnClick}
            isPlaying={isVideoPlaying[index]}
          />
        )}
        handleSetInView={handleSetInView}
        options={{ loop: component_config?.infinit_loop || false }}
        width={component_config?.width || 0.4}
        gap={component_config?.gap || 4}
        autoplay={component_config?.carousel_autoplay || false}
        autoplayInterval={(component_config?.interval || 3) * 1000}
        showDots={component_config?.show_dots || false}
        // justifyValue={component_config?.section_alignment || "flex-start"}
        infinite={component_config?.infinit_loop}
        size={size}
        component_config={component_config || {}}
      />
    </div>
  );
};
