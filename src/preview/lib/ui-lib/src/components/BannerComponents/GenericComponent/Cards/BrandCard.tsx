import { CarouselGridConfig, fieldsToListingPage, SingleBrandCardProps } from "@/preview/utils";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

export interface BrandCardProps extends SingleBrandCardProps {
  component_config: CarouselGridConfig;
  isCarousel: boolean;
}

const ResponsiveText = ({ text, className }: { text: string; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(16); // Start with a default font size

  useEffect(() => {
    const resizeText = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        let currentFontSize = fontSize;

        textRef.current.style.fontSize = `${currentFontSize}px`;
        textRef.current.style.whiteSpace = "nowrap";

        while (
          (textRef.current.offsetWidth > containerWidth ||
            textRef.current.offsetHeight > containerHeight) &&
          currentFontSize > 8 // Minimum font size
        ) {
          currentFontSize--;
          textRef.current.style.fontSize = `${currentFontSize}px`;
        }

        textRef.current.style.whiteSpace = "normal";
        setFontSize(currentFontSize);
      }
    };

    resizeText();
    window.addEventListener("resize", resizeText);
    return () => window.removeEventListener("resize", resizeText);
  }, [text]);

  return (
    <div ref={containerRef} className={clsx("w-full h-full overflow-hidden", className)}>
      <p
        ref={textRef}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
        className="break-words"
      >
        {text}
      </p>
    </div>
  );
};

export const GenericBrandCard = ({
  component_config,
  isCarousel,
  size,
  data,
}: BrandCardProps) => {
  const {
    web_name,
    web_name_position,
    web_name_align,
    web_name_footer,
    web_name_footer_align,
    web_border,
    web_border_width,
    web_border_style,
    web_border_color,
    web_corner_radius,
    web_name_bottomMargin,
    web_name_topMargin,
    web_footer_topMargin,
    web_footer_bottomMargin,
    web_font_size,
  } = component_config;
  const widthStyle: React.CSSProperties = {
    width: `${(component_config.web_width || 0.16) * 100}vw`,
  };
  const borderStyle: React.CSSProperties = web_border
    ? {
        borderWidth: web_border_width || 0,
        borderStyle: web_border_style || "solid",
        borderColor: web_border_color || "transparent",
      }
    : { border: "none" };

  const cornerRadiusStyle: React.CSSProperties = web_corner_radius
    ? { borderRadius: `${web_corner_radius}px` }
    : {};

  const combinedStyle: React.CSSProperties = {
    padding: "0px",
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    ...borderStyle,
    ...cornerRadiusStyle,
  };

  const nameAlign =
    web_name_align === "center"
      ? "justify-center"
      : web_name_align === "right"
        ? "justify-end"
        : "justify-start";

  const footerAlign =
    web_name_footer_align === "center"
      ? "justify-center"
      : web_name_footer_align === "right"
        ? "justify-end"
        : "justify-start";

  if (!data.image) return null;
  let url = fieldsToListingPage({
    brand: data.name,
    quick_filter_tags: data.quick_filter_tags,
    size,
    pk: -1,
    tags: [],
    is_clickable: true,
    coupon_code: null,
  });
  if (data?.filter_id) {
    url += "&filter_id=" + data?.filter_id;
  }
  return (
    <div className="flex flex-col w-full h-full" style={widthStyle}>
      {web_name && web_name_position === "top" && (
        <div
          className={clsx("flex w-full mb-1 h-6", nameAlign)}
          style={{
            marginTop: web_name_topMargin,
            marginBottom: web_name_bottomMargin,
          }}
        >
          {data.name}
          {/* <ResponsiveText text={data.name} className="px-1" /> */}
        </div>
      )}
      <div style={combinedStyle} className="flex-grow">
        <a href={url} className={ContainerVariants({ size })}>
          <img src={data.image} alt={data.name} className={ImageVariants({ size })} />
        </a>
      </div>
      {web_name && web_name_position === "bottom" && (
        <div
          className={clsx("flex w-full mt-1 h-6", nameAlign)}
          style={{
            marginTop: web_name_topMargin,
            marginBottom: web_name_bottomMargin,
            fontSize: web_font_size || "unset",
          }}
        >
          {data.name}
          {/* <ResponsiveText text={data.name} className="px-1" /> */}
        </div>
      )}
      {web_name_footer && (
        <div
          className={clsx("flex w-full mt-1 h-6", footerAlign)}
          style={{
            marginTop: web_footer_topMargin,
            marginBottom: web_footer_bottomMargin,
          }}
        >
          {data.name}
          {/* <ResponsiveText text={data.footer || ""} className="px-1" /> */}
        </div>
      )}
    </div>
  );
};

const ContainerVariants = cva("w-full h-full", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

const ImageVariants = cva("object-contain w-full h-full p-1", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});
