import React from 'react'
// import Customize from '@/views/ui-components/data-display/Tooltip/Customize';
import ProductUploader from './productUploader'
import UploadHistory from './UploadHistory'

const BulkProductUpload = () => {
    return (
        <div className="flex flex-col gap-4">
            <h2>Bulk Product File Upload</h2> <br />
            <ProductUploader />
            <div className="flex flex-col gap-5">
                <h4>Uploaded Files</h4>
                <UploadHistory />
            </div>
        </div>
    )
}

export default BulkProductUpload
