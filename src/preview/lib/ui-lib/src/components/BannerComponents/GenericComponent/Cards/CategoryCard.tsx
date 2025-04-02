import { ScreenSize } from "@/preview/utils";
import { CarouselGridConfig, CATEGORIES } from "@/preview/utils/DataTypes";
import clsx from "clsx";
import React from "react";

export interface CategoryCardProps extends CATEGORIES {
  component_config: CarouselGridConfig; // Config object for the component
  size: ScreenSize; // Screen size (lg, md, etc.)
  isCarousel: boolean; // Is the card part of a carousel
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  isCarousel,
  component_config,
  size,
  name,
  image,
  filter_id,
  ...props
}) => {
  const {
    web_name,
    name_position,
    web_name_position,
    name_align,
    web_name_align,
    name_footer,
    web_name_footer,
    name_footer_align,
    web_name_footer_align,
    font_size,
    web_font_size,
    web_footer_font_size,
    web_name_bottomMargin,
    web_name_topMargin,
    web_footer_topMargin,
    web_footer_bottomMargin,
  } = component_config;
  let url = "/products?subcategory=" + name;
  if (filter_id) {
    url += "&filter_id=" + filter_id;
  }
  // Dynamic width style based on component_config and carousel mode
  const widthStyle: React.CSSProperties = {
    width: isCarousel ? "100%" : `${(component_config.web_width || 0.16) * 100}vw`,
    marginTop: web_name_topMargin,
    marginBottom: web_name_bottomMargin,
  };
  const borderStyle: React.CSSProperties = component_config?.web_border
    ? {
        borderWidth: component_config.web_border_width || 0, // Default to 0 if not provided
        borderStyle: component_config.web_border_style || "solid",
        borderColor: component_config.web_border_color || "transparent", // Default color
      }
    : {
        border: "none",
      };

  const cornerRadiusStyle: React.CSSProperties = component_config?.web_corner_radius
    ? {
        borderRadius: component_config?.web_corner_radius,
      }
    : { borderRadius: 0 };

  // Combine styles
  const combinedStyle: React.CSSProperties = {
    padding: "0px", // Fixed padding
    boxSizing: "border-box", // Include padding within width
    overflow: "hidden", // Prevent content overflow
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
  return (
    <div style={widthStyle}>
      {/* Wrap the image with a link generated from the utility function */}
      {web_name && web_name_position && web_name_position == "top" && (
        <div
          className={clsx("flex w-full", nameAlign)}
          style={{
            marginTop: web_name_topMargin,
            marginBottom: web_name_bottomMargin,
          }}
        >
          <p
            className="text-white font-bold"
            style={{ fontSize: `${web_font_size || 16}px` }}
          >
            {name}
          </p>
        </div>
      )}
      <a href={url} className="w-full">
        {/* Dynamically choose the image source based on the screen size */}
        {<img src={image} className=" object-cover w-full" style={combinedStyle} />}
      </a>
      {web_name && web_name_position && web_name_position == "bottom" && (
        <div
          className={clsx("flex w-full", nameAlign)}
          style={{
            marginTop: web_name_topMargin,
            marginBottom: web_name_bottomMargin,
          }}
        >
          <p
            className="text-white font-bold"
            style={{ fontSize: `${web_font_size || 16}px` }}
          >
            {name}
          </p>
        </div>
      )}
      {/* {web_name_footer && (
        <div
          className={clsx("flex w-full", footerAlign)}
          style={{
            marginTop: web_footer_topMargin,
            marginBottom: web_footer_bottomMargin,
          }}
        >
          <p
            className="text-[#FF7733] font-medium"
            style={{ fontSize: `${web_footer_font_size || 16}px` }}
          >
            {footer}
          </p>
        </div>
      )} */}
    </div>
  );
};
