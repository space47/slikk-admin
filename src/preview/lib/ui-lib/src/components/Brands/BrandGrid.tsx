import { MultipleBrandsProps } from "@/preview/utils/types";
import { cva } from "class-variance-authority";
import { BrandCard } from ".";

export const BrandGrid = ({ data, size }: MultipleBrandsProps) => {
  return (
    <div className={ContainerVariants({ size })}>
      {data?.map((brand, key) => {
        return <BrandCard size={size} data={brand} key={key} />;
      })}
    </div>
  );
};

const ContainerVariants = cva("w-full grid gap-2", {
  variants: {
    size: {
      sm: "grid-cols-3",
      md: "grid-cols-5",
      lg: "grid-cols-7",
    },
  },
});
