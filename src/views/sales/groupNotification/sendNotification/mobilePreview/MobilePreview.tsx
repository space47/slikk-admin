import { handleimage } from '@/common/handleImage'
import React, { useEffect, useState } from 'react'

interface MobilePreviewProps {
    title?: string
    message?: string
    image?: any
}

const MobilePreview = ({ title, message, image }: MobilePreviewProps) => {
    const [imageView, setImageView] = useState<string>('')

    useEffect(() => {
        const handleImageView = async () => {
            if (image) {
                const imageUpload = await handleimage('product', image)
                setImageView(imageUpload)
            }
        }
        handleImageView()
    }, [image])

    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(message ?? '', 'text/html')
    const plainTextMessage = htmlDoc.body.textContent || ''

    console.log('ImageView', imageView)

    return (
        <div>
            <div className="mobile-preview">
                <div className="p-4 rounded-[15px] shadow-xl bg-white m-3">
                    <div className="flex gap-3 items-center mb-4">
                        <div className="w-[25px] h-[25px]">
                            <img src="/img/logo/logo-dark-streamline.png" alt="" />
                        </div>
                        <div className="font-semibold text-gray-700 text-[18px]">Slikk</div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">{title}</h4>
                    <p className="text-sm text-gray-600 mt-2">{plainTextMessage}</p>
                    <div className="flex justify-center items-center">
                        <img src={imageView} alt="Notification" className="w-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobilePreview
