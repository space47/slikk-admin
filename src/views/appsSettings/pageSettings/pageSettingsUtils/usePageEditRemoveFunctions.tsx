/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

interface props {
    setInitalValue: React.Dispatch<React.SetStateAction<any>>
}

export const usePageEditRemoveFunctions = ({ setInitalValue }: props) => {
    const handleRemoveImage = (val: string) => {
        if (val === 'background_image') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_image: null,
                background_config: {
                    ...prev.background_config,
                    background_image: null,
                },
            }))
        } else if (val === 'mobile_background_image') {
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_image: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_image: null,
                },
            }))
        }
    }
    const handleRemoveVideo = (val: string) => {
        if (val === 'background_video') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_video: null,
                background_config: {
                    ...prev.background_config,
                    background_video: null,
                },
            }))
        } else if (val === 'mobile_background_video') {
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_video: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_video: null,
                },
            }))
        } else if (val === 'background_lottie') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_lottie: null,
                background_config: {
                    ...prev.background_config,
                    background_lottie: null,
                },
            }))
        } else if (val === 'mobile_background_lottie') {
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_lottie: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_lottie: null,
                },
            }))
        }
    }

    return { handleRemoveImage, handleRemoveVideo }
}
