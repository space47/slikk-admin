import EasyTable from '@/common/EasyTable'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const EventUsersTable = () => {
    const { id } = useParams()
    const [userData, setUserData] = useState([])

    const fetchForUserData = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups/${id}`)
            const data = response?.data?.data
            setUserData(data?.group_users)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchForUserData()
    }, [id])

    const columns = useMemo(
        () => [
            {
                header: 'First Name',
                accessorKey: 'first_name',
            },
            {
                header: 'Last Name',
                accessorKey: 'last_name',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
            },
            {
                header: 'Checked In Status',
                accessorKey: 'checked_in_status',
                cell: (info: any) => (info.getValue() ? 'Yes' : 'No'), // convert boolean to Yes/No
            },
            {
                header: 'Latitude',
                accessorKey: 'latitude',
            },
            {
                header: 'Longitude',
                accessorKey: 'longitude',
            },
        ],
        [],
    )

    console.log('userData', userData)

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Event Users</h1>
            </div>
            <div>
                <EasyTable noPage mainData={userData} columns={columns} />
            </div>
        </div>
    )
}

export default EventUsersTable
