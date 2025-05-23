import { useZxing } from 'react-zxing'
import { useState, useEffect } from 'react'

interface SkuBarcodeScannerProps {
    onResult: (result: string) => void
    onClose: () => void
}

export const SkuBarcodeScanner = ({ onResult, onClose }: SkuBarcodeScannerProps) => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
    const [selectedCamera, setSelectedCamera] = useState<string | undefined>()

    // Get available cameras and prefer back camera
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === 'videoinput')
            setCameras(videoDevices)

            // Try to find a back camera (usually labeled "environment")
            const backCamera = videoDevices.find(
                (device) => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'),
            )
            setSelectedCamera(backCamera?.deviceId || videoDevices[0]?.deviceId)
        })
    }, [])

    const { ref } = useZxing({
        onDecodeResult(result) {
            onResult(result.getText())
        },
        onDecodeError(error) {
            console.error('Scan error:', error)
        },
        deviceId: selectedCamera,
        constraints: {
            facingMode: { ideal: 'environment' }, // Prefer back camera
        },
    })

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="flex justify-between items-center bg-gray-800 p-3">
                    <h2 className="text-white font-bold">Scan Barcode/QR</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close scanner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scanner Viewport */}
                <div className="relative">
                    <video ref={ref} className="w-full h-auto border-4 border-blue-500" playsInline />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-white border-dashed w-64 h-64 rounded-lg"></div>
                    </div>
                </div>

                {/* Camera Selector (if multiple cameras available) */}
                {cameras.length > 1 && (
                    <div className="p-3 bg-gray-100">
                        <select
                            value={selectedCamera}
                            onChange={(e) => setSelectedCamera(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            {cameras.map((camera) => (
                                <option key={camera.deviceId} value={camera.deviceId}>
                                    {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="p-3 text-center text-gray-600 bg-gray-50">Point your camera at a barcode or QR code</div>
            </div>
        </div>
    )
}
