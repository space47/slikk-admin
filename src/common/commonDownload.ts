import { notification } from 'antd'

export const commonDownload = (response: any, label: string) => {
    const contentType = response.headers['content-type']
    console.log('object', contentType)
    if (contentType !== 'text/csv') {
        notification.success({
            message: response.data?.message || 'File is being generated in background and will be sent on registered email',
        })
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
