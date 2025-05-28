import { useEffect, useRef, useState } from 'react'
import { BarcodeScanner } from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'

interface SkuBarcodeScannerProps {
    onDetected: (result: string) => void
    setIsCamera: (value: boolean) => void
}

const SkuBarcodeScanner = ({ onDetected, setIsCamera }: SkuBarcodeScannerProps) => {
    const handleCapture = (value: any[]) => {
        console.log('value', value)
        const data = value[0]?.rawValue
        console.log('data for barcode', data)
        onDetected(data)
        setIsCamera(false)
    }

    return (
        <div className="items-center flex justify-center">
            <BarcodeScanner
                style={{ width: '600px', height: '200px' }}
                options={{ delay: 1000, formats: ['code_128'] }}
                onCapture={handleCapture}
            />
        </div>
    )
}

export default SkuBarcodeScanner
