'use client'

import { DialogContent, Dialog } from '@/preview/ui/dialog'
import { ScreenSize } from '@/preview/utils'

import clsx from 'clsx'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export function CarouselModal({
    size = 'lg',
    imagesUrl,
    isOpen,
    onOpenChange,
}: {
    imagesUrl: string
    isOpen: boolean
    size: ScreenSize | undefined
    onOpenChange: (open: boolean) => void
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isChanging, setIsChanging] = useState(false)
    const images = imagesUrl.split(',').slice(0, 10) // Limit to 10 images
    const isMobile = size !== 'lg'

    const nextImage = () => {
        setIsChanging(true)
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setIsChanging(true)
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    useEffect(() => {
        if (isChanging) {
            const timer = setTimeout(() => setIsChanging(false), 50)
            return () => clearTimeout(timer)
        }
    }, [isChanging])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                prevImage()
            } else if (event.key === 'ArrowRight') {
                nextImage()
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    const renderIndicators = () => {
        return images.map((_, index) => (
            <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 transition-all ${
                    index === currentImageIndex ? 'bg-white scale-100' : 'bg-gray-600 scale-75 hover:scale-100'
                }`}
                onClick={() => setCurrentImageIndex(index)}
            >
                <span className="sr-only">Go to image {index + 1}</span>
            </button>
        ))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
            <DialogContent
                className={clsx(
                    'gap-0 border-0 p-0 overflow-hidden bg-black/80 flex flex-col [&>button]:hidden',
                    isMobile ? 'h-[90vh] w-full mt-0 z-[100]' : 'h-screen w-1/2 aspect-[4/3]',
                )}
            >
                <div className="flex-grow relative overflow-hidden">
                    <div className="w-full h-full flex justify-center items-center overflow-hidden">
                        <img
                            src={images[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                                isChanging ? 'opacity-0' : 'opacity-100'
                            }`}
                        />
                    </div>
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={clsx(
                                'absolute top-2 text-white bg-black/50 hover:bg-black/70 z-10',
                                isMobile ? 'right-2' : 'right-2',
                            )}
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="h-8 w-8" />
                        <span className="sr-only">Previous image</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
                        onClick={nextImage}
                    >
                        <ChevronRight className="h-8 w-8" />
                        <span className="sr-only">Next image</span>
                    </Button>
                </div>
                <div
                    className={clsx('flex justify-center items-center py-2 bg-gray-900 fixed bottom-0 w-full', isMobile ? 'h-12' : 'h-10')}
                >
                    <div className="flex">{renderIndicators()}</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
