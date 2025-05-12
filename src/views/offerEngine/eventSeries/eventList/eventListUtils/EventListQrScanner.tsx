import React from 'react'
import QrReader from 'react-qr-scanner'

interface props {
    delay?: number
    setDelay?: (x: number) => void
    qrResult?: any
    setQrResult: (x: any) => void
}

const EventListQrScanner = ({ delay, setQrResult, qrResult, setDelay }: props) => {
    const previewStyle = {
        height: 240,
        width: 320,
    }
    const handleError = () => {
        console.log('error')
    }
    const handleScan = (data: any) => {
        if (data) {
            console.log(data)
            setQrResult(JSON.stringify(data?.text))
        }
    }

    return (
        <div>
            <QrReader delay={delay} style={previewStyle} onError={handleError} onScan={handleScan} facingMode="rear" legacyMode={true} />
        </div>
    )
}

export default EventListQrScanner
