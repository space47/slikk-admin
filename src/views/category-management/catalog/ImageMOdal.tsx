import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import type { MouseEvent } from 'react'

type ImageProps = {
    dialogIsOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    image: string[]
}

const ImageModal = ({ dialogIsOpen, setIsOpen, image }: ImageProps) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                className=""
            >
                {Array.isArray(image) && image.length > 0 ? (
                    <Splide
                        options={{ rewind: true }}
                        aria-label="Image carousel"
                    >
                        {image.map((item, key) =>
                            item ? (
                                <SplideSlide key={key}>
                                    <div className="flex items-center justify-center h-[600px]">
                                        <img
                                            src={item}
                                            alt={`Image ${key}`}
                                            className="w-[550px] h-[550px] object-contain "
                                        />
                                    </div>
                                </SplideSlide>
                            ) : null,
                        )}
                    </Splide>
                ) : (
                    <p>No images available 😊</p>
                )}
            </Dialog>
        </div>
    )
}

export default ImageModal
