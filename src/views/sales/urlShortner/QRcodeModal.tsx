/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import QRCode from 'react-qr-code'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    value: string | undefined
    title?: string
}

const QRcodeModal = ({ dialogIsOpen, setIsOpen, value, title }: props) => {
    const qrRef = useRef<SVGSVGElement | undefined>()

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        if (!qrRef.current) return
        const svg = qrRef.current
        const svgData = new XMLSerializer().serializeToString(svg)

        const img = new Image()
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = svg.clientWidth * 2
            canvas.height = svg.clientHeight * 2
            const ctx = canvas.getContext('2d')!
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)
            const jpgUrl = canvas.toDataURL('image/jpeg', 0.95)
            const link = document.createElement('a')
            link.href = jpgUrl
            link.download = `${title}.jpg`
            link.click()
        }

        img.src = url
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">QR CODE</h5>
                <div className="flex justify-center">
                    <QRCode ref={qrRef as any} value={value ?? ''} />
                </div>
                <div className="text-right mt-6">
                    <Button variant="solid" onClick={onDialogOk}>
                        Download QR
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default QRcodeModal
