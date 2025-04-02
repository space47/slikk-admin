import { BANNER_ITEM_FRONTEND, CarouselGridConfig, ScreenSize } from "@/preview/utils";
import { useInterval } from "@/preview/utils/hooks/use-interval";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback, useEffect, useState } from "react";
import { GenericCard, GenericCardProps } from "./GenericCard";
import { GenericCardMobile } from "./GenericMobile/GenericCardMobile";
import { GridComponentMobile } from "./GenericMobile/GridComponentMobile";
import GridComponent from "./GridComponent";

interface CarouselProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  options?: any;
  width?: number;
  gap?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  slidesToScroll?: number;
  showDots?: boolean;
  justifyValue?: string;
  infinite?: boolean | null;
  component_config?: CarouselGridConfig;
  size?: ScreenSize;
  handleSetInView?: (visibleItems: number[]) => void; // Define the structure of the function
}

export function CustomGridCarousel<T>({
  items,
  renderCard,
  options = {},
  width = 1,
  gap = 4,
  autoplay = true,
  autoplayInterval = 4000,
  slidesToScroll = 1,
  showDots = true,
  justifyValue = "flex-start",
  infinite = false,
  component_config = {},
  size = "lg",
  handleSetInView,
}: CarouselProps<T>) {
  function distributeItemsInGrid<T>({
    items,
    rows,
    columns,
  }: {
    items: T[];
    rows: number;
    columns: number;
  }): T[][] {
    // Calculate the number of slides required
    if (rows == 0 || columns == 0) return [[]];
    const itemsPerSlide = rows * columns;
    const totalSlides = Math.ceil(items.length / itemsPerSlide);

    // Initialize the grid with empty arrays for each slide
    const grid: T[][] = Array.from({ length: totalSlides }, () => []);

    // Distribute items into the grid slide by slide
    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
      const startIndex = slideIndex * itemsPerSlide; // Starting index for the current slide
      const endIndex = startIndex + itemsPerSlide; // Ending index (non-inclusive)

      // Slice the items for the current slide and add them to the grid
      grid[slideIndex].push(...items.slice(startIndex, endIndex));
    }

    return grid;
  }
  const cols =
    size == "lg" ? component_config.web_column || 3 : component_config.column || 3;
  const calculatedWidth = 100 / cols / 100;

  const grid = distributeItemsInGrid({
    items: items,
    rows: size == "lg" ? component_config.web_row || 3 : component_config.row || 3,
    columns:
      size == "lg" ? component_config.web_column || 3 : component_config.column || 3,
  });
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    slidesToScroll: slidesToScroll,
    containScroll: "trimSnaps",
    draggable: !autoplay,
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [autoplayEnabled, setAutoplayEnabled] = useState(autoplay);
  useEffect(() => {
    if (!emblaApi) return;
    const updateVisibleSlides = () => {
      const inView = emblaApi?.slidesInView();
      if (inView.length > 0) handleSetInView && handleSetInView(inView);
    };
    setTimeout(() => {
      emblaApi.on("select", updateVisibleSlides);
      emblaApi.on("init", updateVisibleSlides);
      updateVisibleSlides();
    }, 100);
    return () => {
      emblaApi.off("init", updateVisibleSlides);
    };
  });

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    let scrollAccumulator = 0;
    const scrollThreshold = 250; // Adjust this value to control scrolling speed

    const handleWheel = (event: WheelEvent) => {
      if (!autoplayEnabled) {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          event.preventDefault();
          scrollAccumulator += event.deltaX;

          if (Math.abs(scrollAccumulator) >= scrollThreshold) {
            const direction = Math.sign(scrollAccumulator);
            emblaApi.scrollTo(emblaApi.selectedScrollSnap() + direction);
            scrollAccumulator = 0;
          }
        }
      }
    };

    const rootNode = emblaApi.rootNode();
    rootNode.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      rootNode.removeEventListener("wheel", handleWheel);
    };
  }, [emblaApi, setScrollSnaps, onSelect, autoplayEnabled]);

  const autoplayCallback = useCallback(() => {
    if (!autoplayEnabled) return;
    if (emblaApi && emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      emblaApi?.scrollTo(0);
    }
  }, [emblaApi, autoplayEnabled]);

  useInterval(autoplayCallback, autoplayEnabled ? autoplayInterval : null);

  const toggleAutoplay = useCallback(() => {
    setAutoplayEnabled((prev) => !prev);
    if (emblaApi) {
      emblaApi.reInit({
        ...options,
        slidesToScroll: slidesToScroll,
        containScroll: "trimSnaps",
        draggable: autoplayEnabled,
        dragFree: true,
      });
    }
  }, [emblaApi, autoplayEnabled, options, slidesToScroll]);

  const slideWidth = `${width * 100}vw`;
  const mapDataToGenericCardProps = (data: BANNER_ITEM_FRONTEND) => ({
    ...data, // Spread the data fields directly
    component_config: component_config || {}, // Pass the component configuration
    isCarousel: true, // If this should behave as a carousel
  });
  return (
    <div className="w-full mx-auto relative">
      <div
        className={`overflow-hidden ${
          !autoplayEnabled ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        ref={emblaRef}
      >
        <div className="flex" style={{ gap: gap }}>
          {grid.map((items, index) => {
            return (
              <>
                <div
                  style={{
                    flex: `0 0 ${slideWidth}`,
                    marginRight:
                      index === items.length - 1 ? (infinite ? gap : "0") : "0",
                  }}
                  key={index}
                >
                  {size == "lg" ? (
                    <GridComponent<BANNER_ITEM_FRONTEND, GenericCardProps>
                      component_config={{
                        ...component_config,
                        web_width: calculatedWidth,
                      }}
                      size={size}
                      data={items as BANNER_ITEM_FRONTEND[]}
                      RenderComponent={GenericCard}
                      renderComponentProps={mapDataToGenericCardProps}
                      isGridCarousel={true}
                    />
                  ) : (
                    <GridComponentMobile<BANNER_ITEM_FRONTEND, GenericCardProps>
                      component_config={{
                        ...component_config,
                        width: calculatedWidth,
                      }}
                      size={size}
                      data={items as BANNER_ITEM_FRONTEND[]}
                      RenderComponent={GenericCardMobile}
                      renderComponentProps={mapDataToGenericCardProps}
                      isGridCarousel={true}
                    />
                  )}
                </div>
              </>
            );
          })}
          {/* {grid.map((items) => {
            return items?.map((item, index) => (
              <div
                className="min-w-0"
                style={{
                  flex: `0 0 ${slideWidth}`,
                  marginRight:
                    index === items.length - 1
                      ? infinite
                        ? `${gap * 0.25}rem`
                        : "0"
                      : "0",
                }}
                key={index}
              >
                {renderCard(item, index)}
              </div>
            ));
          })} */}
        </div>
      </div>
      {showDots && scrollSnaps?.length > 1 && (
        <div className="flex justify-center mt-4 cursor-pointer">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full mx-1 p-0 min-w-0 ${
                index === selectedIndex ? "w-10 bg-white" : "w-2 bg-white/50"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      {/* arrow buttons */}
      {/* <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button> */}

      {/* pause play buttons */}
      {/* <button
                className="absolute bottom-4 right-4 bg-white border border-gray-300 rounded-full p-2"
                onClick={toggleAutoplay}
                aria-label={autoplayEnabled ? "Pause autoplay" : "Start autoplay"}
            >
                {autoplayEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                )}
            </button> */}
    </div>
  );
}
