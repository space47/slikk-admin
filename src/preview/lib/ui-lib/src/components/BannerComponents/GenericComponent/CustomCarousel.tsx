"use client";

import type { CarouselGridConfig, ScreenSize } from "@/preview/utils";
import { useInterval } from "@/preview/utils/hooks/use-interval";
import useEmblaCarousel from "embla-carousel-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

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
  coverFlow?: boolean;
  component_config?: CarouselGridConfig;
  size?: ScreenSize;
  handleSetInView?: (visibleItems: number[]) => void; // Define the structure of the function
}

export function CustomCarousel<T>({
  items,
  renderCard,
  options = {},
  width = 0.41,
  gap = 4,
  autoplay = true,
  autoplayInterval = 4000,
  slidesToScroll = 1,
  showDots = true,
  justifyValue = "flex-start",
  infinite = false,
  coverFlow = false,
  size,
  component_config = {},
  handleSetInView, // Receive the function
}: CarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    slidesToScroll: slidesToScroll,
    draggable: !autoplay,
    dragFree: coverFlow
      ? false
      : (size == "sm" && !component_config.carousel) ||
        (size !== "sm" && !component_config.web_carousel),
    align: coverFlow ? "center" : "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [autoplayEnabled, setAutoplayEnabled] = useState(autoplay || false);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

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
  }, [emblaApi]);
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
        draggable: autoplayEnabled,
        dragFree:
          (size == "sm" && !component_config.carousel) ||
          (size !== "sm" && !component_config.web_carousel),
        align: coverFlow ? "center" : "start",
      });
    }
  }, [emblaApi, autoplayEnabled, options, slidesToScroll, coverFlow, infinite]);

  useEffect(() => {
    setAutoplayEnabled(autoplay);
  }, [autoplay]);

  const slideWidth = coverFlow ? `${width * 80}vw` : `${width * 100}vw`;

  return (
    <div
      className={`flex w-full flex-col mx-auto relative ${coverFlow ? "perspective-1000" : ""}`}
      onMouseEnter={() => {
        autoplay && setAutoplayEnabled(false);
      }}
      onMouseLeave={() => {
        autoplay && setAutoplayEnabled(true);
      }}
    >
      <div
        className={`overflow-hidden ${!autoplayEnabled ? "cursor-grab active:cursor-grabbing" : ""}`}
        ref={emblaRef}
      >
        <div
          className="flex"
          style={{
            gap: gap,
            justifyContent: autoplay ? "flex-start" : justifyValue,
          }}
        >
          {items?.map((item, index) => {
            return (
              <div
                style={{
                  flex: `0 0 ${slideWidth}`,
                  height: "max-content",
                  marginRight: index === items.length - 1 ? (infinite ? gap : "0") : "0",
                }}
                key={index}
              >
                <div
                  className={
                    coverFlow ? "transform transition-all duration-300 ease-out py-1" : ""
                  }
                  style={
                    coverFlow
                      ? {
                          transform:
                            index === selectedIndex
                              ? "scale(1.05) translateZ(0)"
                              : "scale(0.9) translateZ(-50px)",
                          opacity: index === selectedIndex ? 1 : 0.7,
                        }
                      : {}
                  }
                >
                  {renderCard(item, index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showDots && scrollSnaps?.length > 1 && (
        <div className="flex justify-center">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`h-1 rounded-full mx-1 my-2 p-0 min-w-0 ${
                index === selectedIndex ? "w-6 bg-white" : "w-1 bg-white/50"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
{
  /* arrow buttons */
}
{
  /* <button
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
            </button> */
}

{
  /* pause play buttons */
}
{
  /* <button
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
            </button> */
}
