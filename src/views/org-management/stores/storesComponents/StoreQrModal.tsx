/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import QRCode from 'react-qr-code'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    store_code?: string
}

const StoreQrModal = ({ dialogIsOpen, setIsOpen, store_code }: Props) => {
    const [generatedQr, setGeneratedQr] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const qrWrapperRef = useRef<HTMLDivElement>(null)

    const fetchQr = async (code: string) => {
        try {
            setLoading(true)
            const res = await axioisInstance.get(`/store/qr/code?store_code=${encodeURIComponent(code)}`)
            setGeneratedQr(res?.data?.data?.qr_code ?? '')
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!store_code || !dialogIsOpen) return
        fetchQr(store_code)
    }, [store_code, dialogIsOpen])

    const handleGenerateNewQr = async () => {
        if (!store_code) return

        try {
            setLoading(true)
            const res = await axioisInstance.post('/store/qr/code', {
                store_code,
            })
            setGeneratedQr(res?.data?.data?.qr_code ?? '')
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadQr = async () => {
        if (!qrWrapperRef.current || !store_code) return

        const svg = qrWrapperRef.current.querySelector('svg')
        if (!svg) return

        try {
            setDownloading(true)

            const serializer = new XMLSerializer()
            const svgData = serializer.serializeToString(svg)

            const svgBlob = new Blob([svgData], {
                type: 'image/svg+xml;charset=utf-8',
            })

            const url = URL.createObjectURL(svgBlob)
            const img = new Image()

            img.onload = () => {
                const scale = 2
                const size = svg.clientWidth * scale
                const padding = 40

                const canvas = document.createElement('canvas')
                canvas.width = size + padding * 2
                canvas.height = size + padding * 2

                const ctx = canvas.getContext('2d')
                if (!ctx) return

                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, padding, padding, size, size)

                URL.revokeObjectURL(url)

                const jpgUrl = canvas.toDataURL('image/jpeg', 0.95)
                const link = document.createElement('a')
                link.href = jpgUrl
                link.download = `${store_code}_QR.jpg`
                link.click()
            }

            img.src = url
        } finally {
            setDownloading(false)
        }
    }

    return (
        <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
            <h4 className="mb-4 font-semibold text-lg">Store QR Code for {store_code}</h4>

            <div className="flex justify-center items-center min-h-[220px]">
                {loading ? (
                    <p className="text-gray-500">Loading QR…</p>
                ) : generatedQr ? (
                    <div ref={qrWrapperRef} className="bg-white p-4 rounded-xl shadow-md">
                        <QRCode value={generatedQr} size={180} />
                    </div>
                ) : (
                    <p className="text-gray-500">No QR found for this store. Generate a new one.</p>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button variant="blue" disabled={loading} onClick={handleGenerateNewQr}>
                    {loading ? 'Generating…' : 'Generate New QR'}
                </Button>

                <Button variant="solid" disabled={!generatedQr || downloading} onClick={handleDownloadQr}>
                    {downloading ? 'Downloading…' : 'Download QR'}
                </Button>
            </div>
        </Dialog>
    )
}

export default StoreQrModal
