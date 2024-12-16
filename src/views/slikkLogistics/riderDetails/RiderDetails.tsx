import React, { useEffect, useState } from 'react'
import { RiderData } from './RiderDetailsCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import RiderDetailModal from './RiderComponents/RiderDetailModal'

const RiderDetails = () => {
    const [riderDetails, setRiderDetails] = useState<RiderData[]>([])
    const [showRiderDetailModal, setShowRiderDetailModal] = useState(false)
    const [mobileForParticularRider, setMobileForParticularRider] = useState<string>()

    const fetchRiderDetails = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/riders`)
            const data = response?.data?.data
            setRiderDetails(data)
        } catch (error) {
            console.error('error', error)
        }
    }

    useEffect(() => {
        fetchRiderDetails()
    }, [])

    const columns = [
        {
            header: 'Name',
            accessorKey: 'profile',
            cell: ({ row }) => {
                return (
                    <div
                        className="flex gap-2  hover:text-blue-800 hover:text-xl cursor-pointer "
                        onClick={() => hanldeProfileClick(row?.original?.profile?.mobile)}
                    >
                        <span className=""> {row?.original?.profile?.first_name}</span>
                        <span className="">{row?.original?.profile?.last_name}</span>
                    </div>
                )
            },
        },
        { header: 'Mobile', accessorKey: 'profile.mobile' },
        {
            header: 'DOB',
            accessorKey: 'profile.dob',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
        { header: 'Email', accessorKey: 'profile.email' },
    ]

    const hanldeProfileClick = (mobile: string) => {
        setShowRiderDetailModal(true)
        setMobileForParticularRider(mobile)
    }

    return (
        <div>
            <EasyTable mainData={riderDetails} columns={columns} />
            {showRiderDetailModal && (
                <RiderDetailModal
                    dialogIsOpen={showRiderDetailModal}
                    setIsOpen={setShowRiderDetailModal}
                    mobile={mobileForParticularRider}
                />
            )}
        </div>
    )
}

export default RiderDetails
