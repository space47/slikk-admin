import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const commonDownload = (response: any, label: string) => {
    const contentType = response.headers['content-type']

    if (contentType !== 'text/csv') {
        if (response?.data?.data?.includes('https')) {
            notification.info({ message: 'Link downloading' })
            const link = document.createElement('a')
            link.href = response.data.data
            link.download = `link`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            notification.success({
                message: response.data?.message || 'File is being generated in background and will be sent on registered email',
            })
        }
    } else {
        const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = urlToBeDownloaded
        link.download = `${label}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

export const commonPresignedDownload = async (fileUrl: string, fileName: string) => {
    try {
        const response = await axioisInstance.get(`file/presign?file_url=${encodeURIComponent(fileUrl)}`)
        console.log('sss', response)
        const preSignedUrl = response.data.data
        await fetch(preSignedUrl)
            .then((res) => res.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.href = url
                a.download = `${fileName}.pdf`

                document.body.appendChild(a)

                a.click()

                document.body.removeChild(a)

                URL.revokeObjectURL(url)
            })
            .catch((err) => console.log(err))
    } catch (error) {
        console.log(error)
    }
}
