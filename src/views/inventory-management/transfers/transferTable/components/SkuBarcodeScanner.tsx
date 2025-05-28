import { useEffect, useRef, useState } from 'react'
import { BarcodeScanner, useTorch } from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'
import { BiSolidTorch } from 'react-icons/bi'

interface SkuBarcodeScannerProps {
    onDetected: (result: string) => void
    setIsCamera: (value: boolean) => void
}

const SkuBarcodeScanner = ({ onDetected, setIsCamera }: SkuBarcodeScannerProps) => {
    const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch()

    const onTorchSwitch = () => {
        setIsTorchOn(!isTorchOn)
    }

    console.log('isTorchSupported', isTorchSupported)
    const handleCapture = (value: any[]) => {
        console.log('value', value)
        const data = value[0]?.rawValue
        console.log('data for barcode', data)
        onDetected(data)
        setIsCamera(false)
    }

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="mb-10">
                {isTorchSupported ? (
                    <button onClick={onTorchSwitch} className="bg-yellow-500 text-white p-1 rounded-xl">
                        <BiSolidTorch className="text-xl text-white" />
                    </button>
                ) : null}
            </div>
            <div className="w-full max-w-md px-4">
                <BarcodeScanner
                    style={{ width: '100%', height: 'auto' }}
                    options={{ delay: 1000, formats: ['code_128'] }}
                    onCapture={handleCapture}
                />
            </div>
        </div>
    )
}

export default SkuBarcodeScanner
