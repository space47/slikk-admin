import { Button, Dropdown, Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { pageSettingsService } from '@/store/services/pageSettingService'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageSettingsColumns } from '../newPageSettingsUtils/usePageSettingsColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import LoadingSpinner from '@/common/LoadingSpinner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { pageNamesRequiredType, setPageNamesData, setSubPageNamesData } from '@/store/slices/pageSettingsSlice/pageNames.slice'
import AddPageNameModal from '../../pageSettings/AddPageNameModal'
import { usePageSettingsFunctions } from '../newPageSettingsUtils/usePageSettingsFunctions'
import EasyTable from '@/common/EasyTable'
import AddSubPageNameModal from '../newPageSettingsUtils/AddSubPageModal'
import {
    mainPageSettingsRequiredType,
    setMainPageSettingsData,
    setCount,
    setPage,
    setPageSize,
    setCurrentPageName,
    setCurrentSubPageName,
} from '@/store/slices/mainPageSettings/mainPageSettingsSlice'
import { AxiosError } from 'axios'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const NewPageSettingsTables = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [updatedPosition, setUpdatedPosition] = useState<{ [key: number]: number }>({})
    const positionRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const [showAddPageModal, setShowAddPageModal] = useState(false)
    const [showAddSubPageModal, setShowAddSubPageModal] = useState(false)

    useEffect(() => {
        const storedPageName = sessionStorage.getItem('currentPageName')
        const storedSubPageName = sessionStorage.getItem('currentSubPageName')

        if (storedPageName) {
            dispatch(setCurrentPageName(JSON.parse(storedPageName)))
        }

        if (storedSubPageName) {
            dispatch(setCurrentSubPageName(JSON.parse(storedSubPageName)))
        }
    }, [dispatch])

    const { mainPageSettingsData, page, pageSize, count, currentPageName, currentSubPageName } =
        useAppSelector<mainPageSettingsRequiredType>((state) => state.pageSettingsMain)

    const { pageForName, pageNamesData, pageSizeForName, subPageNamesData } = useAppSelector<pageNamesRequiredType>(
        (state) => state.pageNames,
    )

    const {
        data: pageSettingsMain,
        isSuccess,
        isLoading,
    } = pageSettingsService.useMainPageSettingsQuery({
        page,
        pageSize,
        pageId: currentPageName?.label,
        sub_page: currentSubPageName?.label,
    })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: pageForName,
        pageSize: pageSizeForName,
    })

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageId: currentPageName?.value as number,
    })

    useEffect(() => {
        if (currentPageName) {
            sessionStorage.setItem('currentPageName', JSON.stringify(currentPageName))
        }
        if (currentSubPageName) {
            sessionStorage.setItem('currentSubPageName', JSON.stringify(currentSubPageName))
        }
    }, [currentPageName, currentSubPageName])

    useEffect(() => {
        const storedPageName = sessionStorage.getItem('currentPageName')
        const storedSubPageName = sessionStorage.getItem('currentSubPageName')

        if (storedPageName) {
            setCurrentPageName(JSON.parse(storedPageName))
        }

        if (storedSubPageName) {
            setCurrentSubPageName(JSON.parse(storedSubPageName))
        }
    }, [dispatch])

    useEffect(() => {
        if (isPageNamesSuccess) {
            dispatch(setPageNamesData(pageNames?.data?.results || []))
        }
    }, [dispatch, pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            dispatch(setSubPageNamesData(SubPageNames?.data || []))
        }
    }, [dispatch, SubPageNames, isSubPageNamesSuccess])

    useEffect(() => {
        if (isSuccess) {
            dispatch(setMainPageSettingsData(pageSettingsMain?.data?.results || []))
            dispatch(setCount(pageSettingsMain?.data?.count || 0))
        }
    }, [dispatch, pageSettingsMain, isSuccess, currentPageName, currentSubPageName])

    const { handleSelectPage, handleSelectSubPage, BANNER_PAGE, SUB_PAGE } = usePageSettingsFunctions({
        pageNamesData,
        subPageNamesData,
        mainPageSettingsData,
        setCurrentPageName,
        setCurrentSubPageName,
        setMainPageSettingsData,
    })

    const handlePositionChange = (id: number, newQuantity: number) => {
        setUpdatedPosition((prevQuantity) => {
            if (prevQuantity[id] === newQuantity) return prevQuantity
            return { ...prevQuantity, [id]: newQuantity }
        })
        setTimeout(() => {
            positionRef.current[id]?.focus()
        }, 0)
    }

    const handleUpdate = async (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            try {
                const res = await axioisInstance.patch(`/page-sections/${id}`, { position: updatedPosition[id] })
                notification.success({ message: res?.data?.data?.message || 'Failed to update position' })
            } catch (error) {
                if (error instanceof AxiosError) {
                    notification.error(error?.response?.data?.message || 'Failed to update position')
                }
            }
        }
    }

    const handleGoToBanner = (sectionHeading: string) => {
        navigate('/app/appSettings/banners', { state: { var1: currentPageName?.label, var2: sectionHeading } })
    }

    const columns = usePageSettingsColumns({ handleGoToBanner, positionRef, handlePositionChange, updatedPosition, handleUpdate })
    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="flex flex-col gap-2 items-center xl:items-start xl:flex-row xl:justify-between mb-6">
                <div className="flex gap-3">
                    <div className=" gap-3 mb-7">
                        <div className="font-bold">Pages</div>
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentPageName?.label}
                                onSelect={handleSelectPage}
                            >
                                {BANNER_PAGE?.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item?.value?.toString()}>
                                        {item.label}
                                    </DropdownItem>
                                ))}
                                <div
                                    className="flex items-center justify-center mt-2 bg-gray-50 text-green-600 p-2
                             hover:bg-gray-100 hover:text-green-500 cursor-pointer"
                                    onClick={() => setShowAddPageModal(true)}
                                >
                                    ADD NEW
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div className=" gap-3 mb-7">
                        <div className="font-bold">Sub Pages</div>
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentSubPageName?.label || 'SELECT'}
                                onSelect={handleSelectSubPage}
                            >
                                {SUB_PAGE?.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item?.value?.toString()}>
                                        {item.label}
                                    </DropdownItem>
                                ))}
                                <div
                                    className="flex items-center justify-center mt-2 bg-gray-50 text-green-600 p-2
                             hover:bg-gray-100 hover:text-green-500 cursor-pointer"
                                    onClick={() => setShowAddSubPageModal(true)}
                                >
                                    ADD NEW
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="new" onClick={() => navigate(`/app/appSettings/newPageSettings/addNew`)}>
                        New Section
                    </Button>
                </div>
            </div>
            <div>
                <EasyTable overflow mainData={mainPageSettingsData || []} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex justify-between mt-10">
                <div>
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={count}
                        className="mb-4 md:mb-0"
                        onChange={(e) => dispatch(setPage(e))}
                    />
                </div>
                <div>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option) {
                                dispatch(setPage(1))
                                dispatch(setPageSize(option?.value))
                            }
                        }}
                    />
                </div>
            </div>
            {showAddPageModal && <AddPageNameModal setIsOpen={setShowAddPageModal} dialogIsOpen={showAddPageModal} />}
            {showAddSubPageModal && <AddSubPageNameModal setIsOpen={setShowAddSubPageModal} dialogIsOpen={showAddSubPageModal} />}
        </div>
    )
}

export default NewPageSettingsTables
