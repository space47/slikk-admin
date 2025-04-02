import { MultipleBrandsProps } from "@/preview/utils/types";
import { cva } from "class-variance-authority";
import { BrandCard } from ".";

export const BrandCarousel = ({ data, size }: MultipleBrandsProps) => {
  return (
    <div className={BrandCarouselVariants({ size })}>
      {data?.map((brand, key) => {
        return <BrandCard data={brand} size={size} key={key} />;
      })}
    </div>
  );
};

const BrandCarouselVariants = cva(
  "flex flex-row items-start overflow-x-scroll scrollbar-hide",
  {
    variants: {
      size: {
        sm: "space-x-5",
        md: "space-x-7",
        lg: "space-x-10",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);
