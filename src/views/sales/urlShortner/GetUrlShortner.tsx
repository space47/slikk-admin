/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { URLSHORTNERTYPE } from '@/store/types/shortUrl.types'
import { fetchUrlShortner, setPage, setPageSize } from '@/store/slices/urlShortner/urlShortner.slice'
import { FaDotCircle, FaEdit } from 'react-icons/fa'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import QRcodeModal from './QRcodeModal'
import EasyTable from '@/common/EasyTable'
import { notification } from 'antd'

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const GetUrlShortner = () => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [urlData, setUrlData] = useState([])
    const [storeUrl, setStoreUrl] = useState<string>()
    const [showQrModal, setShowQrModal] = useState(false)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { result, page, pageSize, count } = useAppSelector((state: { urlShortner: URLSHORTNERTYPE }) => state.urlShortner)

    useEffect(() => {
        dispatch(fetchUrlShortner())
    }, [dispatch, page, pageSize])

    const fetchForGlobalFilter = async () => {
        try {
            const response = await axioisInstance.get(`/short_urls?short_code=${globalFilter}`)
            const data = response?.data?.message
            setUrlData(data?.results)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (globalFilter) {
            fetchForGlobalFilter()
        }
    }, [globalFilter])

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'short_code',
                cell: ({ getValue }: any) => (
                    <span className="">
                        <FaEdit className="text-xl text-blue-500 cursor-pointer" onClick={() => handleEditUrlShortner(getValue())} />
                    </span>
                ),
            },
            {
                header: 'MARKETING TITLE',
                accessorKey: 'short_code',
                cell: ({ getValue }) => {
                    return <div className="w-[100px]">{getValue()}</div>
                },
            },
            {
                header: 'Short Url',
                accessorKey: 'short_url',
                cell: ({ getValue }) => {
                    return (
                        <div className="cursor-pointer hover:text-blue-600" onClick={() => handleCopy(getValue())}>
                            {getValue()}
                        </div>
                    )
                },
            },
            { header: 'WEB URL', accessorKey: 'web_url' },
            { header: 'ANDROID URL', accessorKey: 'android_url' },
            { header: 'IOS URL', accessorKey: 'ios_url' },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Generate QR',
                accessorKey: 'id',
                cell: ({ row }) => {
                    const urlName = row.original.web_url
                    return (
                        // <input
                        //     type="radio"
                        //     name="bannerId"
                        //     onChange={() => hanldeGenerateQR(urlName)}
                        //     // checked={data.length === bannerIdStore.length}
                        // />
                        <button onClick={() => hanldeGenerateQR(urlName)}>
                            <FaDotCircle />
                        </button>
                    )
                },
            },
        ],
        [],
    )

    const handleCopy = (file: any) => {
        navigator.clipboard.writeText(file)
        notification.success({
            message: 'Copied',
        })
    }

    const hanldeGenerateQR = (qr: string) => {
        setStoreUrl(qr)
        setShowQrModal(true)
    }

    const handleEditUrlShortner = (value: string) => {
        navigate(`/app/appsCommuncication/urlShortner/${value}`)
    }

    const tableData = globalFilter ? urlData : result || []

    const onPaginationChange = (page: number) => {
        dispatch(setPage(page))
    }

    const handleCreateUrl = () => {
        navigate('/app/appsCommuncication/urlShortner/addNew')
    }

    return (
        <div className="flex flex-col gap-5">
            {' '}
            <div>
                <div>
                    <input placeholder="Search by short code" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <Button variant="new" onClick={handleCreateUrl}>
                        CREATE URL
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <EasyTable mainData={tableData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => dispatch(setPageSize(option?.value))}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
            {showQrModal && <QRcodeModal dialogIsOpen={showQrModal} setIsOpen={setShowQrModal} value={storeUrl} />}
        </div>
    )
}

export default GetUrlShortner
