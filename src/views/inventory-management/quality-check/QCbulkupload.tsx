import React, { useState } from 'react'
// import Customize from '@/views/ui-components/data-display/Tooltip/Customize';
import QCUploader from './QCUploader'
import QCuploadHistory from '@/views/inventory-management/quality-check/QCuploadHistory'
import SingleUpload from './SingleUpload'

const QCbulkUpload = () => {
    const [tabSelect, setTabSelect] = useState('bulk_upload')
    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    return (
        <div>
            <div className="flex gap-10 justify-start">
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'bulk_upload' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('bulk_upload')}
                >
                    <span className="text-xl font-bold">Bulk upload</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'single_upload' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('single_upload')}
                >
                    <span className="text-xl font-bold">Single Upload</span>
                </div>
            </div>
            <br />
            <br />
            {tabSelect === 'bulk_upload' && (
                <div>
                    <div className="font-bold text-xl mb-5">QUALITY CHECK</div>
                    <QCUploader />
                    <br />
                    <QCuploadHistory />
                </div>
            )}
            {tabSelect === 'single_upload' && (
                <div>
                    <SingleUpload />
                </div>
            )}
        </div>
    )
}

export default QCbulkUpload
