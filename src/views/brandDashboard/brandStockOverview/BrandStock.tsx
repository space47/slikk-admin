import React, { useEffect, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { IoMdDownload } from 'react-icons/io'
import { Spinner } from '@/components/ui'
import EasyTable from '@/common/EasyTable'
import { Stock } from './brandStockCommon'
import { useBrandColumns } from './brandStockUtils/useBrandColumns'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'

const BrandStock = () => {
    const [data, setData] = useState<Stock[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [showSpinner, setShowSpinner] = useState(false)
    const [noData, setNoData] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`inventory?p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setShowSpinner(false)
            setData(data)
            setTotalData(total)
            if (data.length === 0) {
                setNoData(true)
            } else {
                setNoData(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const filter = async (page: number, pageSize: number, filter: string = '') => {
        try {
            let searchInputType = `&sku=${filter}`
            let response = await axiosInstance.get(
                `inventory?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
            )
            if (response.data.data.results.length === 0) {
                searchInputType = `&name=${filter}`

                response = await axiosInstance.get(
                    `inventory?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
                )
            }

            const data = response.data.data.results
            const total = response.data.data.count

            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, pageSize, selectedCompany, globalFilter])
    useEffect(() => {
        if (globalFilter) {
            filter(page, pageSize, globalFilter)
        }
    }, [page, pageSize, globalFilter])

    const columns = useBrandColumns()

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const date = new Date()

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    const handleDownload = async () => {
        try {
            const downloadUrl = `inventory?download=true&p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`
            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob',
            })
            const urlToBeDownloaded = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = urlToBeDownloaded
            link.download = `${selectedCompany.name}_Stock-${moment(date).format('YYYY-MM-DD')}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-4 shadow-xl rounded-xl">
            <div className="upper flex flex-col md:flex-row justify-between mb-4 items-center md:items-center gap-4">
                <div className="w-auto md:w-auto">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded w-full md:w-auto"
                    />
                </div>

                <button
                    className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex order-first xl:order-none "
                    onClick={handleDownload}
                >
                    <IoMdDownload className="text-xl" />
                    Export
                </button>
            </div>
            {noData ? (
                <div className="flex flex-col gap-1 justify-center items-center h-screen">
                    <h3>No Data Available</h3>
                </div>
            ) : (
                <EasyTable overflow mainData={data} columns={columns} page={page} pageSize={pageSize} />
            )}
            <div className="flex flex-col md:flex-row items-center justify-between ">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalData}
                    onChange={onPaginationChange}
                    className="w-full md:w-auto mb-4 md:mb-0"
                />
                <div className="min-w-[130px] hidden md:w-auto xl:block">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="w-full md:w-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default BrandStock
