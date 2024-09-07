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
            <div className="font-bold text-xl mb-5">QUALITY CHECK</div>
            <QCUploader />
            <br />
            <QCuploadHistory />
        </div>
    )
}

export default QCbulkUpload
