import React from 'react'
// import Customize from '@/views/ui-components/data-display/Tooltip/Customize';
import QCUploader from './QCUploader'
import QCuploadHistory from '@/views/inventory-management/quality-check/QCuploadHistory'

const QCbulkUpload = () => {
    const handleFileUpload = (file: File) => {
        // Handle the file upload logic here
        console.log('File uploaded:', file)
    }

    return (
        <div>
            <h2>Bulk Product File Upload</h2>
            <QCUploader />
            <br />
            <QCuploadHistory />
        </div>
    )
}

export default QCbulkUpload
