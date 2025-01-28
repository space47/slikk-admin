/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaEdit } from 'react-icons/fa'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Dropdown, FormItem, Select } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { JobPostingTypes, SEARCHOPTIONS } from '../careersCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import NewDeptModal from './NewDeptModal'
import ActiveInactiveModal from './ActiveInactiveModal'
import { Switch } from 'antd'
import { Field, FieldProps } from 'formik'
import { departmentTypes } from '@/store/types/departments.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchDepartments } from '@/store/slices/departmentSlice/Department.slice'

const CareerDetails = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [careerDatas, setCareerDatas] = useState<JobPostingTypes[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [totalPages, setTotalPages] = useState<number>(0)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [showAddNewDept, setShowAddNewDept] = useState<boolean>(false)
    const [storeForActive, setStoreForActive] = useState<any>()
    const [showModalForActive, setShowModalForActive] = useState(false)
    const [checkActive, setCheckActive] = useState(false)
    const [departmentName, setDepartmentName] = useState<any>('')

    console.log('department id', departmentName)

    const { departmentsData } = useAppSelector<departmentTypes>((state) => state.departmentsData)

    const fetchCareerDatas = async () => {
        try {
            let departmentIds = ''
            let searchFilter = ''
            // if (globalFilter) {
            //     searchFilter = `&job_id=${globalFilter}`
            // }
            if (currentSelectedPage.value === 'title' && globalFilter) {
                searchFilter = `&title=${globalFilter}`
            }
            if (currentSelectedPage.value === 'location' && globalFilter) {
                searchFilter = `&location=${globalFilter}`
            }

            if (departmentName !== '' || departmentName !== null || departmentName !== undefined) {
                departmentIds = `&department=${departmentName}`
            }

            const response = await axioisInstance.get(`/jobs?p=${page}&ps=${pageSize}${searchFilter}${departmentIds}&dashboard=true`)
            const data = response?.data?.data
            setCareerDatas(data?.results)
            setTotalPages(data?.count)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCareerDatas()
    }, [page, pageSize, globalFilter, currentSelectedPage, departmentName])

    useEffect(() => {
        dispatch(fetchDepartments())
    }, [dispatch])

    const columns = useMemo(
        () => [
            {
                header: 'Activate / Inactivate',
                accessorKey: 'is_active',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            <Switch
                                className="bg-red-500"
                                checked={row.original.is_active}
                                onChange={(checked) => handleActiveCareer(row.original.id, checked, row.original.is_active)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'job_id',
                cell: ({ row }: any) => {
                    return (
                        <div onClick={() => handleEditCareers(row.original.job_id)}>
                            <FaEdit className="text-2xl cursor-pointer text-blue-500" />
                        </div>
                    )
                },
            },
            {
                header: 'Job ID',
                accessorKey: 'job_id',
            },
            {
                header: 'Title',
                accessorKey: 'title',
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: ({ row }: any) => (
                    <div className="truncate max-w-[200px]" title={row.original.description}>
                        {row.original.description}
                    </div>
                ),
            },
            {
                header: 'Location',
                accessorKey: 'location',
            },
            {
                header: 'Job Type',
                accessorKey: 'job_type',
            },
            {
                header: 'Minimum Experience',
                accessorKey: 'min_experience',
                cell: ({ row }: any) => `${row.original.min_experience} years`,
            },
            {
                header: 'Salary Range',
                accessorKey: 'salary_range',
                cell: ({ row }: any) => row.original.salary_range || 'Not specified',
            },
            {
                header: 'Responsibilities',
                accessorKey: 'responsibilities',
                cell: ({ row }: any) => (
                    <div className="truncate max-w-[200px]" title={row.original.responsibilities}>
                        {row.original.responsibilities}
                    </div>
                ),
            },
            {
                header: 'Qualifications',
                accessorKey: 'qualifications',
                cell: ({ row }: any) => (
                    <div className="truncate max-w-[200px]" title={row.original.qualifications}>
                        {row.original.qualifications}
                    </div>
                ),
            },
            {
                header: 'How to Apply',
                accessorKey: 'how_to_apply',
                cell: ({ row }: any) => (
                    <div className="truncate max-w-[200px]" title={row.original.how_to_apply}>
                        {row.original.how_to_apply}
                    </div>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: ({ row }: any) => (
                    <div className={row.original.is_active ? 'text-green-500' : 'text-red-500'}>
                        {row.original.is_active ? 'Active' : 'Inactive'}
                    </div>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: ({ row }: any) => moment(row.original.created_at).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                header: 'Updated At',
                accessorKey: 'updated_at',
                cell: ({ row }: any) => moment(row.original.updated_at).format('YYYY-MM-DD HH:mm:ss'),
            },
        ],
        [storeForActive],
    )

    const formattedData = departmentsData?.map((item) => ({
        label: item?.name,
        value: item?.id,
    }))

    console.log('Checkinh active', departmentsData)

    const handleActiveCareer = (id, e, checked) => {
        setStoreForActive(id)
        setShowModalForActive(true)
        setCheckActive(checked)
    }

    console.log('Id for Active', checkActive)

    const handleEditCareers = (id: string) => {
        navigate(`/app/appSettings/careers/edit/${id}`)
    }

    const hanldeAddCareers = () => {
        navigate(`/app/appSettings/careers/addNew`)
    }

    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <div>
                            <input
                                type="search"
                                placeholder="Search here"
                                className="w-full border border-gray-300 rounded p-2"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target?.value)}
                            />
                        </div>
                        <div>
                            <div className="bg-gray-100 items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white font-bold">
                                <Dropdown
                                    className=" text-xl text-black bg-gray-200 font-bold  "
                                    title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                    onSelect={handleSelect}
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

                    <div className="flex gap-2">
                        <Select
                            isMulti
                            isClearable
                            className="xl:w-[300px]"
                            options={formattedData}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            onChange={(newVal) => {
                                const values = newVal?.map((item) => item?.value)
                                return setDepartmentName(values?.join(','))
                            }}
                        />

                        <Button variant="new" size="sm" onClick={() => setShowAddNewDept(true)}>
                            Add Department
                        </Button>
                        <Button variant="new" size="sm" onClick={hanldeAddCareers}>
                            Add New
                        </Button>
                    </div>
                </div>
                <EasyTable overflow mainData={careerDatas} columns={columns} page={page} pageSize={pageSize} />
                {!globalFilter && (
                    <PageCommon page={page} setPage={setPage} pageSize={pageSize} totalData={totalPages} setPageSize={setPageSize} />
                )}
            </div>
            {showAddNewDept && <NewDeptModal dialogIsOpen={showAddNewDept} setIsOpen={setShowAddNewDept} />}
            {showModalForActive && (
                <ActiveInactiveModal
                    dialogIsOpen={showModalForActive}
                    setIsOpen={setShowModalForActive}
                    idForUpdate={storeForActive}
                    isActive={checkActive}
                />
            )}
        </div>
    )
}

export default CareerDetails
