import React, { useEffect, useRef } from 'react'
import Quagga from 'quagga'

interface Props {
    setQrResult: (barcode: string) => void
}

const BarcodeScanner = ({ setQrResult }: Props) => {
    const scannerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Initialize barcode scanner when component mounts
        if (scannerRef.current) {
            Quagga.init(
                {
                    inputStream: {
                        name: 'Live',
                        type: 'LiveStream',
                        target: scannerRef.current,
                        constraints: {
                            facingMode: 'environment', // Use rear camera
                        },
                    },
                    decoder: {
                        readers: [
                            'code_128_reader', // For standard barcodes
                            'ean_reader', // For EAN barcodes
                            'ean_8_reader', // For EAN-8 barcodes
                            'upc_reader', // For UPC barcodes
                            'upc_e_reader', // For UPC-E barcodes
                        ],
                    },
                },
                (err) => {
                    if (err) {
                        console.error('Failed to initialize Quagga:', err)
                        return
                    }
                    Quagga.start()
                },
            )

            Quagga.onDetected(handleBarcodeDetected)
        }

        return () => {
            Quagga.offDetected(handleBarcodeDetected)
            Quagga.stop()
        }
    }, [])

    const handleBarcodeDetected = (result: any) => {
        const code = result.codeResult.code
        if (code) {
            console.log('Barcode detected:', code)
            setQrResult(code)
            // Uncomment if you want to stop after first detection
            // Quagga.stop()
        }
    }

    return (
        <div>
            {/* Barcode Scanner */}
            <div
                ref={scannerRef}
                style={{
                    height: 240,
                    width: 320,
                    margin: '0 auto',
                    border: '1px solid #ccc',
                }}
            />
        </div>
    )
}

export default BarcodeScanner
