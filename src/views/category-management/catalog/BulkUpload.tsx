import React from 'react'
// import Customize from '@/views/ui-components/data-display/Tooltip/Customize';
import ProductUploader from './productUploader'
import UploadHistory from './UploadHistory'

const BulkProductUpload = () => {
    const handleFileUpload = (file: File) => {
        // Handle the file upload logic here
        console.log('File uploaded:', file)
    }

    return (
        <div>
            <h2>Bulk Product File Upload</h2>
            <ProductUploader />
            <br />
            <br />
            <UploadHistory />
        </div>
    )
}

export default BulkProductUpload
