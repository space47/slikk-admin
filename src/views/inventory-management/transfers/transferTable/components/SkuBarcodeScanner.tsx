import { useEffect, useRef, useState } from 'react'
import Quagga from '@ericblade/quagga2'

interface SkuBarcodeScannerProps {
    onDetected: (result: string) => void
    onClose: () => void
    setIsCamera: (value: boolean) => void
}

const SkuBarcodeScanner = ({ onDetected, onClose, setIsCamera }: SkuBarcodeScannerProps) => {
    const scannerRef = useRef<HTMLDivElement>(null)
    const [lastScanned, setLastScanned] = useState<string | null>(null)
    const detectionTimeout = useRef<NodeJS.Timeout>()

    useEffect(() => {
        if (!scannerRef.current) return

        console.log('Mount')
        Quagga.init(
            {
                inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: scannerRef.current,
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: 'environment',
                    },
                },
                decoder: {
                    readers: ['code_128_reader'],
                    multiple: false,
                },
                locate: true,
                numOfWorkers: 4,
                frequency: 10,
                debug: {
                    drawBoundingBox: true,
                    showFrequency: true,
                    drawScanline: true,
                },
            },
            (err) => {
                if (err) {
                    console.error('Scanner initialization failed:', err)
                    return
                }
                Quagga.start()
            },
        )

        const handleDetection = (result: any) => {
            const code = result.codeResult.code

            console.log('Valid barcode detected:', code)
            setLastScanned(code)
            onDetected(code)
            clearTimeout(detectionTimeout.current)
        }

        Quagga.onDetected(handleDetection)

        return () => {
            Quagga.offDetected(handleDetection)
            Quagga.stop()

            const videos = document.querySelectorAll('video')
            videos.forEach((video) => {
                const mediaStream = video.srcObject as MediaStream | null
                if (mediaStream) {
                    mediaStream.getTracks().forEach((track) => track.stop())
                    video.srcObject = null
                    console.log('Stopped media stream tracks')
                }
            })

            // Quagga internal track stopping (if available)
            const track = Quagga?.CameraAccess?.getActiveTrack?.()
            if (track) {
                track.stop()
                console.log('Stopped Quagga internal camera track')
            }

            clearTimeout(detectionTimeout.current)
        }
    }, [onDetected, lastScanned])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="flex justify-between items-center bg-gray-800 p-3">
                    <h2 className="text-white font-bold">Barcode Scanner</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-300">
                        ✕
                    </button>
                </div>

                <div ref={scannerRef} className="relative h-64 w-full bg-black"></div>

                <div className="p-3 text-center text-gray-600 bg-gray-50">Point at a barcode (EAN, UPC, Code 128, etc.)</div>
            </div>
        </div>
    )
}

export default SkuBarcodeScanner
