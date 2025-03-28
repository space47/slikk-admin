/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, TableData } from './inwardCommon'
import AccessDenied from '@/views/pages/AccessDenied'
import { InwardColumns } from './inwardUtils/InwardColumns'

const PaginationTable = () => {
    const [data, setData] = useState<TableData[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [accessDenied, setAccessDenied] = useState(false)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [globalFilter, setGlobalFilter] = useState<any>('')
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyCode, setCompanyCode] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                let filter = ''
                let code = ''
                if (globalFilter) {
                    filter = `&brand=${globalFilter}`
                }
                if (companyCode) {
                    code = `&company=${companyCode}`
                }
                const response = await axiosInstance.get(
                    `goods/received/${selectedCompany.id}?p=${page}&page_size=${pageSize}${filter}${code}`, // &company_id
                )
                const data = response.data.data.results
                const total = response.data.data.count
                setData(data)
                setTotalData(total)
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setAccessDenied(true)
                }
                console.error(error)
            }
        }
        fetchData()
    }, [page, pageSize, selectedCompany, globalFilter, companyCode])

    const columns = InwardColumns()

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPage(1)
        setPageSize(Number(value))
    }

    const navigate = useNavigate()

    const handleGRN = () => {
        navigate('/app/goods/received/form')
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div>
            <div className=" flex gap-6 justify-between mb-10">
                <div className="flex gap-3">
                    <div>
                        <div className="font-bold">Search</div>
                        <input
                            type="search"
                            value={globalFilter}
                            placeholder="Search by document No."
                            className="rounded-lg"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div className={' w-full'}>
                        <div className="font-bold">Select Company</div>
                        <div>
                            <div className="flex flex-col gap-2 w-full max-w-md">
                                <Select
                                    isClearable
                                    className="w-full  rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                    options={companyList}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    onChange={(newVal) => {
                                        console.log(newVal)
                                        setCompanyCode(newVal?.code)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleGRN}>
                        ADD NEW GRN
                    </button>{' '}
                </div>
            </div>
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default PaginationTable
