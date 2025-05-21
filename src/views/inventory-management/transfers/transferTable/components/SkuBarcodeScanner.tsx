import React, { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

interface Props {
    setQrResult: (x: string) => void
}

const SkuBarcodeScanner = ({ setQrResult }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const codeReader = useRef(new BrowserMultiFormatReader())
    const [error, setError] = useState<string | null>(null)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)

    useEffect(() => {
        const startScanner = async () => {
            try {
                // First request camera access directly
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Prefer rear camera on mobile
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                })

                // Set the stream to video element
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    setHasPermission(true)
                }

                // Now start the barcode scanner
                const devices = await BrowserMultiFormatReader.listVideoInputDevices()
                if (devices.length > 0 && videoRef.current) {
                    await codeReader.current.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (result, err) => {
                        if (result) {
                            setQrResult(result.getText())
                        }
                        if (err && !(err instanceof Error)) {
                            console.error(err)
                        }
                    })
                }
            } catch (err) {
                console.error(err)
                setError('Camera access denied or failed to start scanner')
                setHasPermission(false)
            }
        }

        startScanner()

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream
                stream.getTracks().forEach((track) => track.stop())
                videoRef.current.srcObject = null
            }
        }
    }, [setQrResult])

    // Helper to request permission again
    const requestPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true })
            setHasPermission(true)
            setError(null)
            // You might want to restart the scanner here
        } catch (err) {
            setError('Camera access denied')
            setHasPermission(false)
        }
    }

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: 'auto',
                    display: hasPermission === false ? 'none' : 'block',
                }}
                playsInline // Important for iOS
                autoPlay // Important for all browsers
                muted // Required for autoplay in some browsers
            />

            {error && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    {hasPermission === false && (
                        <button
                            onClick={requestPermission}
                            style={{
                                padding: '10px 20px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Allow Camera Access
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default SkuBarcodeScanner
