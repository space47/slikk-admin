/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import { Dropdown, Input } from '@/components/ui'
import { HiSearch } from 'react-icons/hi'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { SEARCHOPTIONS } from './userCommonTypes/UserCommonTypes'
import { useUserColumns } from './userUtils/useUserColumns'
import PageCommon from '@/common/PageCommon'
import { useUserApi } from './userUtils/useUserApi'

const Seller = () => {
    const navigate = useNavigate()
    const [globalFilter, setGlobalFilter] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { accessDenied, paginatedData, totalData } = useUserApi({ currentSelectedPage, globalFilter, page, pageSize, searchOnEnter })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, setSearchOnEnter: any) => {
        setSearchOnEnter(e.target.value)
    }

    const columns = useUserColumns()

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md mb-7">
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search here..."
                        value={globalFilter}
                        className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSearch(e, setSearchOnEnter)
                            }
                        }}
                    />
                    <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer">
                        <HiSearch
                            className="text-white  dark:text-gray-400 text-xl"
                            onClick={() => {
                                setSearchOnEnter(globalFilter)
                            }}
                        />
                    </div>
                    <div className="flex justify-center xl:justify-normal">
                        <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                            <Dropdown
                                className=" text-xl text-black bg-gray-200 font-bold  "
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={(e) => {
                                    const selected = SEARCHOPTIONS.find((item) => item.value === e)
                                    if (selected) {
                                        setCurrentSelectedPage(selected)
                                    }
                                }}
                            >
                                {SEARCHOPTIONS?.map((item, key) => {
                                    return (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    )
                                })}
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-none">
                    <button
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                        onClick={() => navigate('/app/users/addNew')}
                    >
                        ADD NEW USERS
                    </button>{' '}
                </div>
            </div>
            {accessDenied ? (
                <AccessDenied />
            ) : (
                <>
                    <EasyTable mainData={paginatedData} columns={columns} page={page} pageSize={pageSize} />
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
                </>
            )}
        </div>
    )
}

export default Seller
