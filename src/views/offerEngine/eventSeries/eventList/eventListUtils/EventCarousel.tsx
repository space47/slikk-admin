import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'

interface props {
    image?: string[]
    label: string
    aspectRatioValue?: number
}

const EventCarousel = ({ image, label, aspectRatioValue }: props) => {
    return (
        <div>
            <p className="text-2xl font-bold mt-4 mb-4">{label}</p>
            {Array.isArray(image) && image.length > 0 ? (
                <Splide options={{ rewind: true }} aria-label="Image carousel">
                    {image.map((item, key) =>
                        item ? (
                            <SplideSlide key={key}>
                                <div className="flex items-center justify-center ">
                                    <img
                                        src={item}
                                        alt={`Image ${key}`}
                                        className="w-full h-40 object-cover"
                                        {...(aspectRatioValue && { style: { aspectRatio: aspectRatioValue } })}
                                    />
                                </div>
                            </SplideSlide>
                        ) : null,
                    )}
                </Splide>
            ) : (
                <p>No images available 😊</p>
            )}
        </div>
    )
}

export default EventCarousel
