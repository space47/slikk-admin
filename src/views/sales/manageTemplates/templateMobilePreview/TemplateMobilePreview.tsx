import { handleimage } from '@/common/handleImage'
import React, { useEffect, useState } from 'react'
import { GoDotFill } from 'react-icons/go'

interface TemplateMobilePreviewProps {
    title?: string
    message?: string
    image?: any
    video?: any
    text?: any
}

const TemplateMobilePreview = ({ title, message, image, video, text }: TemplateMobilePreviewProps) => {
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
        <div className="whatsapp-message-preview flex justify-end p-4">
            <div className="max-w-[75%] p-3 bg-green-100 rounded-[12px] shadow-md">
                {/* Header (Optional Title) */}
                {title && <div className="font-semibold text-sm text-gray-700 mb-2 word-break-break-word">{title}</div>}

                {/* Text */}
                {text && <p className="text-sm text-gray-800 mt-1 break-words">{text}</p>}

                {/* Message */}
                {message && <p className="text-sm text-gray-800 break-words">{plainTextMessage}</p>}

                {/* Image */}
                {image && <img src={imageView} alt="Media" className="rounded-lg mt-2 w-full object-cover" />}

                {/* Video */}
                {video && (
                    <video controls className="rounded-lg mt-2 w-full" src={video instanceof File ? URL.createObjectURL(video) : video} />
                )}

                {/* Timestamp */}
                <div className="flex justify-end items-center text-xs text-gray-500 mt-2 gap-1">
                    <span>12:45 PM</span>
                    <GoDotFill />
                </div>
            </div>
        </div>
    )
}

export default TemplateMobilePreview
