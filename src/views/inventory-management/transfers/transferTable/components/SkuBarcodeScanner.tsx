import React, { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

interface Props {
    setQrResult: (x: any) => void
}

const SkuBarcodeScanner = ({ setQrResult }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const codeReader = useRef(new BrowserMultiFormatReader())
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const startScanner = async () => {
            try {
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
                setError('Failed to access camera')
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

    return (
        <div>
            <video ref={videoRef} style={{ width: 320, height: 240 }} />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}

export default SkuBarcodeScanner
