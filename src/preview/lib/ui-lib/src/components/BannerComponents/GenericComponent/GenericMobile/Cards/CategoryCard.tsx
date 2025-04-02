import { ScreenSize } from "@/preview/utils";
import { CarouselGridConfig, CATEGORIES } from "@/preview/utils/DataTypes";
import clsx from "clsx";
import React from "react";

export interface CategoryCardProps extends CATEGORIES {
  component_config: CarouselGridConfig; // Config object for the component
  size: ScreenSize; // Screen size (lg, md, etc.)
  isCarousel: boolean; // Is the card part of a carousel
}

export const CategoryCardMobile: React.FC<CategoryCardProps> = ({
  isCarousel,
  component_config,
  size,
  image,
  name,
  filter_id,
  ...props
}) => {
  const {
    name: isName,
    name_position,
    name_align,
    name_footer,
    name_footer_align,
    font_color,
    font_style,
    font_size,
    footer_font_size,
    name_bottomMargin,
    name_topMargin,
    footer_topMargin,
    footer_bottomMargin,
  } = component_config;
  let url = "/products?&subcategory=" + name;
  if (filter_id) {
    url += "&filter_id=" + filter_id;
  }
  // Dynamic width style based on component_config and carousel mode
  const widthStyle: React.CSSProperties = {
    width: isCarousel ? "100%" : `${(component_config.width || 0.4) * 100}vw`,
  };
  const borderStyle: React.CSSProperties = component_config?.border
    ? {
        borderWidth: component_config.border_width || 0, // Default to 0 if not provided
        borderStyle: component_config.border_style || "solid",
        borderColor: component_config.border_color || "transparent", // Default color
      }
    : {
        border: "none",
      };

  const cornerRadiusStyle: React.CSSProperties = component_config?.corner_radius
    ? {
        borderRadius: component_config?.corner_radius,
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
    name_align === "center"
      ? "justify-center"
      : name_align === "right"
        ? "justify-end"
        : "justify-start";

  const footerAlign =
    name_footer_align === "center"
      ? "justify-center"
      : name_footer_align === "right"
        ? "justify-end"
        : "justify-start";
  return (
    <div style={widthStyle}>
      {/* Wrap the image with a link generated from the utility function */}
      {isName && name_position && name_position == "top" && (
        <div
          className={clsx("flex w-full", nameAlign)}
          style={{
            marginTop: name_topMargin,
            marginBottom: name_bottomMargin,
          }}
        >
          <p
            className="text-white font-bold text-center"
            style={{
              fontSize: `${font_size || 10}px`,
              color: font_color || "#ffffff",
              fontStyle: font_style === "italic" ? "italic" : "normal",
              fontWeight: font_style === "bold" ? "700" : "400",
              textDecorationLine: font_style === "underline" ? "underline" : "none",
            }}
          >
            {name}
          </p>
        </div>
      )}
      <a href={url} className="w-full">
        {/* Dynamically choose the image source based on the screen size */}
        {
          <img
            src={image}
            className="rounded-md object-cover w-full"
            style={combinedStyle}
          />
        }
      </a>
      {isName && name_position && name_position == "bottom" && (
        <div
          className={clsx("flex w-full", nameAlign)}
          style={{
            marginTop: name_topMargin,
            marginBottom: name_bottomMargin,
          }}
        >
          <p
            className="text-white font-bold text-center"
            style={{
              fontSize: `${font_size || 10}px`,
              color: font_color || "#ffffff",
              fontStyle: font_style === "italic" ? "italic" : "normal",
              fontWeight: font_style === "bold" ? "700" : "400",
              textDecorationLine: font_style === "underline" ? "underline" : "none",
            }}
          >
            {name}
          </p>
        </div>
      )}
      {/* {name_footer && (
        <div className={clsx("flex w-full", footerAlign)}>
          <p
            className="text-[#FF7733] font-medium text-center"
            style={{
              fontSize: `${footer_font_size || 10}px`,
              marginTop: footer_topMargin,
              marginBottom: footer_bottomMargin,
            }}
          >
            {footer}
          </p>
        </div>
      )} */}
    </div>
  );
};
