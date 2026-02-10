import { fieldsToListingPage } from '@/preview/utils'
import { SingleBrandCardProps } from '@/preview/utils/types'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { useState } from 'react'
import bookmark from '../../assets/svg/bookmark.svg'
import filledBookmark from '../../assets/svg/filledBookmark.svg'

export const BrandCard = ({ data, size }: SingleBrandCardProps) => {
    const [Subscribed, setSubscribed] = useState(data.is_subscribed || false)
    if (!data.image) return

    return (
        <a
            href={fieldsToListingPage({
                brand: data.name,
                quick_filter_tags: data.quick_filter_tags,
                size,
                pk: -1,
                tags: [],
                is_clickable: true,
                coupon_code: null,
            })}
            className={ContainerVariants({})}
        >
            <button
                className={clsx('absolute ', size === 'sm' ? 'top-5 right-3 w-3' : 'w-4 top-4 right-4')}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSubscribed((prev) => !prev)
                }}
            >
                <img src={Subscribed ? filledBookmark : bookmark} alt="" />
            </button>
            <img src={data.image} className={ImageVariants({ size })} />
        </a>
    )
}

const ContainerVariants = cva('rounded-lg w-fit p-[2px] relative', {
    variants: {
        size: {
            sm: '',
            md: '',
            lg: '',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})

const ImageVariants = cva('object-contain p-1', {
    variants: {
        size: {
            sm: '',
            md: '',
            lg: '',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})

export * from './BrandCarousel'
export * from './BrandGrid'
