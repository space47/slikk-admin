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
                // Request camera access with explicit preference for rear camera
                const constraints = {
                    video: {
                        facingMode: { exact: 'environment' }, // Force rear camera
                        width: { ideal: 1000 },
                        height: { ideal: 300 },
                    },
                }

                const stream = await navigator.mediaDevices.getUserMedia(constraints)

                // Set the stream to video element
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    setHasPermission(true)
                }

                // Now start the barcode scanner
                const devices = await BrowserMultiFormatReader.listVideoInputDevices()

                // Try to find the rear camera explicitly if possible
                const rearCamera = devices.find((device) => {
                    return (
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('rear') ||
                        device.label.toLowerCase().includes('environment')
                    )
                })

                const deviceId = rearCamera ? rearCamera.deviceId : devices[0]?.deviceId

                if (deviceId && videoRef.current) {
                    await codeReader.current.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
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
                // If exact rear camera fails, try with just 'environment' (not exact)
                if (err instanceof OverconstrainedError) {
                    try {
                        const fallbackConstraints = {
                            video: {
                                facingMode: 'environment', // Not exact, just preferred
                                width: { ideal: 1000 },
                                height: { ideal: 300 },
                            },
                        }

                        const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)

                        if (videoRef.current) {
                            videoRef.current.srcObject = stream
                            setHasPermission(true)
                        }

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
                        return
                    } catch (fallbackErr) {
                        console.error(fallbackErr)
                        setError('Camera access denied or failed to start scanner')
                        setHasPermission(false)
                    }
                } else {
                    setError('Camera access denied or failed to start scanner')
                    setHasPermission(false)
                }
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

    const requestPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            })
            setHasPermission(true)
            setError(null)
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
                playsInline
                autoPlay
                muted
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
