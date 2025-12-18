import { Button } from '@/components/ui'
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowRotateLeft } from 'react-icons/fa6'

interface CommonCameraProps {
    onCapture: (file: File) => void
    onClose?: () => void
    width?: number
}

const CommonCamera: React.FC<CommonCameraProps> = ({ onCapture, onClose, width = 350 }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const [rotateCamera, setRotateCamera] = useState(false)

    const stopCamera = () => {
        try {
            const s = streamRef.current
            if (s) {
                console.log('[CommonCamera] stopping stream, tracks:', s.getTracks().length)
                s.getTracks().forEach((t) => {
                    try {
                        t.stop()
                    } catch (e) {
                        console.warn('[CommonCamera] error stopping track', e)
                    }
                })
            } else {
                console.log('[CommonCamera] stopCamera called but no streamRef.current')
            }
        } finally {
            streamRef.current = null
            if (videoRef.current) {
                try {
                    videoRef.current.srcObject = null
                } catch (e) {
                    console.warn('[CommonCamera] could not clear video.srcObject', e)
                }
            }
        }
    }

    useEffect(() => {
        let mounted = true

        const start = async () => {
            stopCamera() // stop previous stream if any
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: rotateCamera ? { facingMode: { exact: 'environment' } } : { facingMode: 'user' },
                    audio: false,
                })
                if (!mounted) {
                    stream.getTracks().forEach((t) => t.stop())
                    return
                }
                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.muted = true
                    videoRef.current.playsInline = true
                    try {
                        await videoRef.current.play()
                    } catch (err) {
                        console.warn('[CommonCamera] video.play() error:', err)
                    }
                }
            } catch (err) {
                console.error('[CommonCamera] getUserMedia error:', err)
            }
        }

        start()

        return () => {
            mounted = false
            stopCamera()
        }
    }, [rotateCamera])

    const base64ToFile = (dataUrl: string, fileName: string): File => {
        const arr = dataUrl.split(',')
        const mimeMatch = arr[0].match(/:(.*?);/)
        const mime = mimeMatch ? mimeMatch[1] : 'image/png'
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], fileName, { type: mime })
    }

    const handleCapture = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) {
            console.warn('[CommonCamera] capture requested but video/canvas missing')
            return
        }
        canvas.width = video.videoWidth || width
        canvas.height = video.videoHeight || Math.round((width * 3) / 4) || width

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            console.warn('[CommonCamera] no 2d context')
            return
        }

        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const base64 = canvas.toDataURL('image/jpeg', 0.92)
            const file = base64ToFile(base64, `${Date.now()}-photo.jpg`)
            stopCamera()
            onCapture(file)
        } catch (err) {
            console.error('[CommonCamera] capture error', err)
        }
    }

    const handleClose = () => {
        stopCamera()
        onClose && onClose()
    }

    return (
        <div className="flex flex-col gap-3 items-center">
            <video ref={videoRef} autoPlay muted playsInline className="rounded-lg border" width={width} style={{ background: '#000' }} />

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="flex gap-3">
                <button onClick={handleCapture} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Capture
                </button>

                {onClose && (
                    <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                        Close
                    </button>
                )}
                <Button
                    variant="gray"
                    icon={<FaArrowRotateLeft className={rotateCamera ? 'rotate-180' : 'rotate-0'} />}
                    onClick={() => setRotateCamera((prev) => !prev)}
                >
                    Rotate
                </Button>
            </div>
        </div>
    )
}

export default CommonCamera
