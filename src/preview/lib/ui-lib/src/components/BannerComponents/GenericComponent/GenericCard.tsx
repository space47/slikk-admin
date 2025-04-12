import { fieldsToListingPage, ScreenSize } from "@/preview/utils";
import { BANNER_ITEM_FRONTEND, CarouselGridConfig } from "@/preview/utils/DataTypes";
import clsx from "clsx";
import React from "react";
import VideoPlayer from "../SupportingComponents/VideoPlayer";
import LottieView from "@/preview/components/LottieVIew";

export interface GenericCardProps extends BANNER_ITEM_FRONTEND {
  component_config: CarouselGridConfig; // Config object for the component
  size: ScreenSize; // Screen size (lg, md, etc.)
  isCarousel: boolean; // Is the card part of a carousel
  isGridCarousel?: boolean;
  isPlaying?: boolean;
}

export const GenericCard: React.FC<GenericCardProps> = ({
  isCarousel,
  component_config,
  isGridCarousel = false,
  image_mobile,
  image_web,
  size,
  name,
  footer,
  extra_attributes,
  isPlaying,
  ...props
}) => {
  const {
    name: isName,
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
    web_font_color,
    web_font_style,
    web_footer_font_color,
    web_footer_font_style,
    web_footer_font_size,
    web_name_bottomMargin,
    web_name_topMargin,
    web_footer_topMargin,
    web_footer_bottomMargin,
  } = component_config || {};
  // Dynamic width style based on component_config and carousel mode

  const widthStyle: React.CSSProperties = {
    width: isCarousel
      ? "100%"
      : isGridCarousel
        ? `calc(${(component_config.web_width || 0.16) * 100}vw - ${
            component_config?.web_gap || 8
          }px)`
        : `${(component_config.web_width || 0.16) * 100}vw`,
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
      <a
        href={
          extra_attributes?.web_redirection_url
            ? extra_attributes?.web_redirection_url
            : fieldsToListingPage({ name, size, ...props })
        }
        className="w-full"
      >
        {/* Dynamically choose the image source based on the screen size */}
        {extra_attributes?.video_web ? (
          <div style={combinedStyle}>
            <VideoPlayer
              thumbnail={image_web || ""}
              url={extra_attributes?.video_web}
              aspectRatio={extra_attributes?.web_aspect_ratio || 0.56}
              radius={component_config?.web_corner_radius || 0}
              isPlayingVideo={isPlaying}
            />
          </div>
        ) : extra_attributes?.lottie_web ? (
          <LottieView
            path={extra_attributes?.lottie_web}
            width={`${(component_config?.web_width || 0.16) * 100}vw`}
            height={`${(component_config?.web_width || 0.16) * 100 * (component_config?.web_aspect_ratio || 1)}vw`}
          />
        ) : (
          <img
            src={size !== "lg" ? image_mobile : image_web}
            className=" object-cover w-full"
            style={combinedStyle}
          />
        )}
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
            style={{
              fontSize: `${web_font_size || 16}px`,
              color: web_font_color || "#ffffff",
              fontStyle: web_font_style === "italic" ? "italic" : "normal",
              fontWeight: web_font_style === "bold" ? "700" : "400",
              textDecorationLine: web_font_style === "underline" ? "underline" : "none",
            }}
          >
            {name}
          </p>
        </div>
      )}
      {web_name_footer && (
        <div className={clsx("flex w-full", footerAlign)}>
          <p
            className="text-[#FF7733] font-medium"
            style={{
              marginTop: web_footer_topMargin,
              marginBottom: web_footer_bottomMargin,
              fontSize: `${web_footer_font_size || 16}px`,
              color: web_footer_font_color || "#FF7733",
              fontStyle: web_footer_font_style === "italic" ? "italic" : "normal",
              fontWeight: web_footer_font_style === "bold" ? "700" : "400",
              textDecorationLine:
                web_footer_font_style === "underline" ? "underline" : "none",
            }}
          >
            {footer}
          </p>
        </div>
      )}
    </div>
  );
};
