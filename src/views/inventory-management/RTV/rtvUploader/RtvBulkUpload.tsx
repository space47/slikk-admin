import React, { useState } from 'react'
import RtvUploader from './RtvUploader'
import RtvHistory from './RtvHistory'

const RtvBulkUpload = () => {
    const [tabSelect, setTabSelect] = useState('bulk_upload')

    return (
        <div>
            <div className="flex gap-10 justify-start">
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'bulk_upload' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => setTabSelect('bulk_upload')}
                >
                    <span className="text-xl font-bold">Bulk upload</span>
                </div>
                {/* <div
                    className={`flex   cursor-pointer  ${tabSelect === 'single_upload' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => setTabSelect('single_upload')}
                >
                    <span className="text-xl font-bold">Single Upload</span>
                </div> */}
            </div>
            <br />
            <br />
            {tabSelect === 'bulk_upload' && (
                <div>
                    <div className="font-bold text-xl mb-5">Upload Indent</div>
                    <RtvUploader />
                    <br />
                    <RtvHistory />
                </div>
            )}
            {/* {tabSelect === 'single_upload' && (
                <div>
                    <IndentSingleUpload />
                </div>
            )} */}
        </div>
    )
}

export default RtvBulkUpload
