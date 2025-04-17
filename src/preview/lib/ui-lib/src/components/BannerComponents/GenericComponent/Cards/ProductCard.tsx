import soldOutIcon from "@/assets/general/soldOut.svg";
import { CarouselGridConfig } from "@/preview/utils";
import { fieldsToPDPPage } from "@/preview/utils/products";
import { SingleProductProps } from "@/preview/utils/types";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useState } from "react";
import offerWave from "../../../../assets/svg/offerWave.svg";

export interface ProductCardProps extends SingleProductProps {
  component_config: CarouselGridConfig; // Config object for the component
  isCarousel: boolean; // Is the card part of a carousel
}
export const GenericProductCard = (props: ProductCardProps) => {
  const {
    size,
    type = "dark",
    barcode,
    mrp,
    sp,
    name,
    category,
    sub_category,
    footer,
    product_type,
    brand,
    product_feedback,
    is_wish_listed,
    inventory_count,
    is_try_and_buy,
    image,
    isCarousel,
    heartOnClick = (product, h: any, setH: any) => {},
    component_config,
  } = props;
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
    web_name_bottomMargin,
    web_name_topMargin,
    web_footer_topMargin,
    web_footer_bottomMargin,
    web_footer_font_color,
    web_footer_font_size,
    web_footer_font_style,
  } = component_config;
  const discount = Math.round(
    ((parseFloat(mrp) - parseFloat(sp)) / parseFloat(mrp)) * 100
  );

  const [heartClicked, setHeartClicked] = useState(is_wish_listed);

  const handleHeartClick = () => {
    heartOnClick(props, heartClicked, setHeartClicked);
  };
  const calcWidth = (component_config?.web_width || 0.16) * 100;
  const widthStyle: React.CSSProperties = {
    width: isCarousel ? "100%" : `${(component_config.web_width || 0.16) * 100}vw`,
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

  const cornerRadiusStyle: React.CSSProperties =
    component_config?.web_corner_radius || component_config?.web_corner_radius == 0
      ? {
          borderRadius: component_config?.web_corner_radius,
        }
      : { borderRadius: `${calcWidth / 20}vw` };

  // Combine styles
  const combinedStyle: React.CSSProperties = {
    padding: "0px", // Fixed padding
    boxSizing: "border-box", // Include padding within width
    overflow: "hidden", // Prevent content overflow
    ...borderStyle,
    aspectRatio: 0.5,
    ...(component_config.web_grid ? widthStyle : {}),
    // ...cornerRadiusStyle,
    // ...widthStyle
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
    <div
      className={`flex flex-col h-fit  ${inventory_count == 0 && "opacity-80"}  `}
      style={combinedStyle}
    >
      {web_name && web_name_position && web_name_position == "top" && (
        <div
          className={clsx("flex w-full h-12", nameAlign)}
          style={{
            marginTop: web_name_topMargin,
            marginBottom: web_name_bottomMargin,
          }}
        >
          <p>{name}</p>
        </div>
      )}
      <a
        href={fieldsToPDPPage(category, sub_category, name, brand, barcode)}
        className={`mb-2 relative bg-transparent flex h-[75%]  ${ImageVariants({
          type,
        })}`}
        style={widthStyle}
      >
        <img
          src={image}
          loading="lazy"
          className={`  object-cover object-top  w-full h-full`}
          style={cornerRadiusStyle}
        />
        <div
          className=" absolute top-0 z-0 left-3 flex justify-center "
          style={{
            width: `${calcWidth / 4}vw`,
            height: `${calcWidth / 4}vw`,
          }}
        >
          {!!discount && inventory_count != 0 && (
            <div className=" flex flex-col  max-w-14 w-fit px-1 justify-center items-center font-semibold z-10 text-white">
              <span
                className=""
                style={{
                  lineHeight: `${calcWidth / 10}vw`,
                  fontSize: `${calcWidth / 18}vw`,
                }}
              >
                {discount}%
              </span>
              <span
                className=" uppercase"
                style={{
                  fontSize: `${calcWidth / 18}vw`,
                }}
              >
                Off
              </span>
            </div>
          )}
          {!!discount && inventory_count != 0 && (
            <div className="absolute top-0 left-0 flex h-full w-full ">
              <img className="" src={offerWave} />
            </div>
          )}
        </div>

        {inventory_count == 0 && (
          <div className=" absolute top-0 w-full flex items-center justify-center">
            <img
              src={soldOutIcon}
              style={{
                fontSize: `${calcWidth / 10}vw`,
              }}
            />
          </div>
        )}

        {product_feedback?.length == 1 && product_feedback[0].rating && (
          <div className=" rounded-full flex flex-row justify-between divide-x-2 absolute left-3 bottom-5 pr-1 py-1 bg-white shadow-xl border text-[13px] drop-shadow-xl">
            <div className=" px-1 font-semibold flex flex-row items-center space-x-1">
              <svg
                width="11"
                height="12"
                viewBox="0 0 11 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.740222 4.45897L3.97355 4.15232L5.26022 1.17234C5.41355 0.812344 5.92022 0.812344 6.08022 1.17234L7.36689 4.15232L10.6002 4.45229C10.9869 4.48563 11.1469 4.9724 10.8536 5.2324L8.41356 7.37905L9.12689 10.5457C9.21356 10.9257 8.80022 11.2257 8.46689 11.0257L5.67356 9.37238L2.88022 11.0324C2.54689 11.2324 2.13356 10.9324 2.22022 10.5524L2.93356 7.38572L0.493553 5.23908C0.20022 4.97908 0.360223 4.49897 0.74689 4.45897H0.740222Z"
                  fill="#0A090A"
                />
              </svg>
              <span>{product_feedback[0].rating}</span>
            </div>
            <span className=" px-1">{product_feedback[0].rating_count}</span>
          </div>
        )}
      </a>

      <div
        className={`flex flex-row justify-between items-start w-full text-[13px] h-[25%] ${TextVariants(
          { type }
        )}`}
        style={{
          color: web_footer_font_color || "",
          fontSize: web_footer_font_size || "13px",
          fontStyle: web_footer_font_style === "italic" ? "italic" : "normal",
          fontWeight: web_footer_font_style === "bold" ? "700" : "400",
          textDecorationLine:
            web_footer_font_style === "underline" ? "underline" : "none",
        }}
      >
        <div className=" flex flex-col w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <a href={fieldsToPDPPage(category, sub_category, name, brand, barcode)}>
              <span
                className={`line-clamp-1 ${TextVariants({
                  type,
                })} font-semibold uppercase`}
                style={{
                  color: web_footer_font_color || "",
                  fontSize: web_footer_font_size || `${calcWidth / 14}vw`,
                  fontStyle: web_footer_font_style === "italic" ? "italic" : "normal",
                  fontWeight: web_footer_font_style === "bold" ? "700" : "400",
                  textDecorationLine:
                    web_footer_font_style === "underline" ? "underline" : "none",
                  opacity: 0.5,
                }}
              >
                {brand}
              </span>
            </a>
            {/* <img src={heartClicked ? redHeart : type == "dark" ? lightHeartIcon : heartIcon} className=" w-5" onClick={handleHeartClick} /> */}
          </div>
          <a href={fieldsToPDPPage(category, sub_category, name, brand, barcode)}>
            <span
              className=" line-clamp-2 whitespace-break-spaces capitalize text-opacity-60"
              style={{
                marginTop: `${calcWidth / 50}vw`,
                marginBottom: `${calcWidth / 50}vw`,
                fontSize: `${calcWidth / 14}vw`,
              }}
            >
              {name}
            </span>
          </a>
          <div className=" flex flex-row items-center justify-between  w-full">
            <div
              className="flex flex-row items-center justify-center "
              style={{
                fontSize: `${calcWidth / 13}vw`,
                gap: `${calcWidth / 15}vw`,
              }}
            >
              {discount > 0 && (
                <span className=" text-opacity-40 line-through ">
                  ₹{Math.round(parseInt(mrp))}
                </span>
              )}
              <span
                style={{
                  fontSize: `${calcWidth / 12}vw`,
                }}
              >
                ₹{Math.round(parseInt(sp))}
              </span>
            </div>
          </div>
        </div>

        <div className="w-fit"></div>
      </div>
      {web_name && web_name_position && web_name_position == "bottom" && (
        <div
          className={clsx("flex w-full", nameAlign)}
          style={{
            marginTop: web_name_topMargin,
            marginBottom: web_name_bottomMargin,
          }}
        >
          <p>{name}</p>
        </div>
      )}
      {web_name_footer && (
        <div
          className={clsx("flex w-full", footerAlign)}
          style={{
            marginTop: web_footer_topMargin,
            marginBottom: web_footer_bottomMargin,
          }}
        >
          <p>{footer}</p>
        </div>
      )}
    </div>
  );
};

const SizeVariants = cva("w-full", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

const ImageVariants = cva("", {
  variants: {
    type: {
      dark: "border-none",
      light: "border",
    },
  },
});

const TextVariants = cva("", {
  variants: {
    type: {
      light: "text-primaryBlack",
      dark: "text-white",
    },
  },
  defaultVariants: {
    type: "dark",
  },
});
