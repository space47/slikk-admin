import React, { useState } from 'react'
// import Customize from '@/views/ui-components/data-display/Tooltip/Customize';

import GDNQCUploader from './GDNQCUploader'
import GDNPaginationTable from './GDNQCuploadHistory'
import GDNSingleUpload from './GDNSingleUpload'

const GDNQCbulkUpload = () => {
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
                    <div className="font-bold text-xl mb-5">GDN QUALITY CHECK</div>
                    <GDNQCUploader />
                    <br />
                    <GDNPaginationTable />
                </div>
            )}
            {tabSelect === 'single_upload' && (
                <div>
                    <GDNSingleUpload />
                </div>
            )}
        </div>
    )
}

export default GDNQCbulkUpload
