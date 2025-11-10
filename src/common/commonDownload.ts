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
