/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { FaSync } from 'react-icons/fa'
import QCtable from './QCtable'
import { Modal } from 'antd'
import SkuUpdate from './SkuUpdate'

interface props {
    handleSyncClick: any
    showSyncModal: any
    syncGRN: any
    handleCloseModal: any
    isSyncing: any
    data: any
    setSelectValue: any
    handleRegenerateGrn: (doc_number: string) => Promise<void>
    regenerateLoading: boolean
}

const QcTabs = ({
    data,
    handleSyncClick,
    showSyncModal,
    syncGRN,
    handleCloseModal,
    isSyncing,
    setSelectValue,
    handleRegenerateGrn,
    regenerateLoading,
}: props) => {
    const [tabSelect, setTabSelect] = useState('quality_checklist')

    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    return (
        <div className=" bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex gap-8">
                        <button
                            className={`relative py-4 px-1 font-semibold text-lg transition-all duration-300 ${
                                tabSelect === 'quality_checklist'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                            }`}
                            onClick={() => handleSelectTab('quality_checklist')}
                        >
                            Quality Checklist
                            {tabSelect === 'quality_checklist' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            className={`relative py-4 px-1 font-semibold text-lg transition-all duration-300 ${
                                tabSelect === 'sku_select'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                            }`}
                            onClick={() => handleSelectTab('sku_select')}
                        >
                            Material Module
                            {tabSelect === 'sku_select' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                        </button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 py-8">
                {tabSelect === 'quality_checklist' && (
                    <QCtable
                        handleRegenerateGrn={handleRegenerateGrn}
                        handleSyncClick={handleSyncClick}
                        isSyncing={isSyncing}
                        regenerateLoading={regenerateLoading}
                        setSelectValue={setSelectValue}
                        data={data}
                    />
                )}

                {tabSelect === 'sku_select' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Material Module</h2>
                            <p className="text-gray-600 mt-1">Update and manage material SKU information</p>
                        </div>
                        <SkuUpdate />
                    </div>
                )}
            </div>

            {showSyncModal && (
                <Modal
                    centered
                    title={
                        <div className="flex items-center gap-2">
                            <FaSync className="w-5 h-5 text-blue-600" />
                            <span className="text-lg font-semibold text-gray-800">Sync GRN</span>
                        </div>
                    }
                    okText="PROCEED TO SYNC"
                    cancelText="Cancel"
                    okButtonProps={{
                        className: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6',
                    }}
                    cancelButtonProps={{
                        className: 'border-gray-300 text-gray-700 hover:border-gray-400',
                    }}
                    open={showSyncModal}
                    width={500}
                    onOk={syncGRN}
                    onCancel={handleCloseModal}
                >
                    <div className="py-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4 mx-auto">
                            <FaSync className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-center text-lg font-semibold text-gray-800 mb-2">Confirm GRN Sync</h4>
                        <p className="text-center text-gray-600 mb-4">
                            Are you sure you want to sync GRN <span className="font-semibold text-blue-600">{data.grn_number}</span>? This
                            action will update all related records.
                        </p>
                    </div>
                </Modal>
            )}
            {isSyncing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full mx-4">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Syncing GRN</h3>
                            <p className="text-gray-600 text-center">Please wait while we sync your GRN information...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QcTabs
