/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loading } from '@/components/shared'
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
}

const QcTabs = ({ data, handleSyncClick, showSyncModal, syncGRN, handleCloseModal, isSyncing }: props) => {
    const [tabSelect, setTabSelect] = useState('quality_checklist')
    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    return (
        <div>
            <div className="flex gap-10 justify-start">
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'quality_checklist' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('quality_checklist')}
                >
                    <span className="text-xl font-bold">Quality Checklist</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'sku_select' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('sku_select')}
                >
                    <span className="text-xl font-bold">Material Module</span>
                </div>
            </div>
            <br />
            {tabSelect === 'quality_checklist' && (
                <div>
                    <div className="mt-5 flex flex-col">
                        {/* TABLE..................................................... */}

                        <div className="flex justify-end mt-5 text-xl mr-7">
                            <button onClick={() => handleSyncClick(data.grn_number)} className="border-none bg-none flex gap-5">
                                {' '}
                                <div className="flex gap-2 font-bold text-green-600">
                                    SYNC GRN <FaSync className="text-2xl" />
                                </div>{' '}
                            </button>
                        </div>
                        <QCtable data={data.grn_quality_check} totalData={data.grn_quality_check.length} />
                    </div>
                    {showSyncModal && (
                        <Modal
                            title=""
                            okText="SYNC"
                            okButtonProps={{
                                style: {
                                    backgroundColor: 'green',
                                    borderColor: 'green',
                                    fontWeight: 'bold',
                                },
                            }}
                            open={showSyncModal}
                            onOk={syncGRN}
                            onCancel={handleCloseModal}
                        >
                            <div className="italic text-lg font-semibold">SYNC YOUR GRN NUMBER</div>
                        </Modal>
                    )}
                    {isSyncing && <Loading loading={isSyncing} />}
                </div>
            )}
            {tabSelect === 'sku_select' && (
                <div>
                    <SkuUpdate data={data} />
                </div>
            )}
        </div>
    )
}

export default QcTabs
