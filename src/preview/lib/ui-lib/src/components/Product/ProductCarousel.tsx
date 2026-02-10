import { MultipleProductProps } from '@/preview/utils/types'
import { cva } from 'class-variance-authority'
import { ProductCard } from './ProductCard'

export const ProductCarousel = ({ products, size, type, heartOnClick }: MultipleProductProps) => {
    return (
        <div className=" flex flex-row overflow-x-scroll gap-5 items-start">
            {products?.map((product, key) => {
                return (
                    <div className={CarouselVars({ size })} key={product.barcode}>
                        <ProductCard heartOnClick={heartOnClick} {...product} key={product.barcode} size={size} type={type} />
                    </div>
                )
            })}
        </div>
    )
}

const CarouselVars = cva('w-full', {
    variants: {
        size: {
            sm: 'min-w-[150px] max-w-[150px]',
            md: 'min-w-[200px] max-w-[200px]',
            lg: 'min-w-[250px] max-w-[250px]',
        },
    },
})
